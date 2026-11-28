"""Rebuild the gem globe in Blender, path trace it with Cycles, and export it.

    /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/gem-globe/render.py -- \
        --layout /tmp/gem-globe/layout.json --out /tmp/gem-globe/out \
        [--orb gold|porcelain|hollow] [--samples 400] [--width 1600] [--height 1200] \
        [--no-render] [--no-export]

The layout comes from export-layout.mjs, which runs the same code as the web page, so the
stones here are the same stones, in the same places, as in the three.js scene.
"""

import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ASSETS = os.path.join(ROOT, "public", "static", "gem-globe")

parser = argparse.ArgumentParser()
parser.add_argument("--layout", default="/tmp/gem-globe/layout.json")
parser.add_argument("--out", default="/tmp/gem-globe/out")
parser.add_argument("--orb", default="gold", choices=["gold", "porcelain", "hollow"])
parser.add_argument("--samples", type=int, default=400)
parser.add_argument("--width", type=int, default=1600)
parser.add_argument("--height", type=int, default=1200)
parser.add_argument("--fire", type=float, default=0.0, help="above 0 splits each stone into three coloured glass layers")
parser.add_argument("--no-render", action="store_true")
parser.add_argument("--no-export", action="store_true")
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
os.makedirs(args.out, exist_ok=True)

with open(args.layout) as f:
    layout = json.load(f)
SCALE = layout["scale"]
TYPES = {t["key"]: t for t in layout["types"]}

# The web scene is Y-up with the globe's centre 1.1 above the table. Blender is Z-up.
GLOBE_HEIGHT = 1.1
TO_BLENDER = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0)))
SPIN = Matrix.Rotation(0.4, 3, "Y")
TILT = Matrix.Rotation(math.radians(-23.4), 3, "Z")
PLACE = TO_BLENDER @ TILT @ SPIN


def place(p):
    v = PLACE @ Vector(p)
    return (v.x, v.y, v.z + GLOBE_HEIGHT)


def srgb_to_linear(c):
    return [((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c]


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
globe = bpy.data.collections.new("gem-globe")
scene.collection.children.link(globe)


# ---------------------------------------------------------------- materials

def gem_material(spec):
    """Clear stone: three glass layers, one per colour channel, each bending light a little
    differently (that is the fire), over a volume that absorbs colour with depth."""
    mat = bpy.data.materials.new(spec["key"])
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    spread = spec["dispersion"] * args.fire
    if spread == 0:
        glass = nodes.new("ShaderNodeBsdfGlass")
        glass.inputs["Roughness"].default_value = 0.0
        glass.inputs["IOR"].default_value = spec["ior"]
        links.new(glass.outputs[0], out.inputs["Surface"])
    layers = []
    for colour, ior in () if spread == 0 else (((1, 0, 0, 1), spec["ior"] - spread), ((0, 1, 0, 1), spec["ior"]), ((0, 0, 1, 1), spec["ior"] + spread)):
        glass = nodes.new("ShaderNodeBsdfGlass")
        glass.inputs["Color"].default_value = colour
        glass.inputs["Roughness"].default_value = 0.0
        glass.inputs["IOR"].default_value = ior
        layers.append(glass)
    if layers:
        add1 = nodes.new("ShaderNodeAddShader")
        add2 = nodes.new("ShaderNodeAddShader")
        links.new(layers[0].outputs[0], add1.inputs[0])
        links.new(layers[1].outputs[0], add1.inputs[1])
        links.new(add1.outputs[0], add2.inputs[0])
        links.new(layers[2].outputs[0], add2.inputs[1])
        links.new(add2.outputs[0], out.inputs["Surface"])
    absorb = nodes.new("ShaderNodeVolumeAbsorption")
    # The web shader removes colour as exp(-(-ln tint) * distance / width). Blender's node
    # works as exp(-(1 - colour) * density * distance), so convert one to the other.
    strongest = 4.6
    tint = [max(v, 0.012) for v in srgb_to_linear(spec["color"])]
    absorb.inputs["Color"].default_value = (*[max(0.0, 1 + math.log(v) / strongest) for v in tint], 1)
    absorb.inputs["Density"].default_value = strongest / (SCALE * 2.4)
    links.new(absorb.outputs[0], out.inputs["Volume"])
    return mat


def simple_gem_material(spec):
    """The same stone as a plain Principled material, which USD and glTF can carry."""
    mat = bpy.data.materials.new(spec["key"] + "-export")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(spec["color"]), 1)
    bsdf.inputs["Roughness"].default_value = 0.0
    bsdf.inputs["IOR"].default_value = spec["ior"]
    bsdf.inputs["Transmission Weight"].default_value = 1.0
    return mat


def principled(name, colour, metallic=0.0, roughness=0.5, **extra):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*colour, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    for key, value in extra.items():
        bsdf.inputs[key].default_value = value
    return mat


# ---------------------------------------------------------------- stones

def add_object(name, verts, faces, material, smooth=False, collection=globe):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    if smooth:
        for poly in mesh.polygons:
            poly.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    obj.data.materials.append(material)
    collection.objects.link(obj)
    return obj


by_type = {}
for gem in layout["gems"]:
    by_type.setdefault(gem["type"], []).append(gem)

export_materials = {}
for key, gems in by_type.items():
    spec = TYPES[key]
    verts, faces = [], []
    if spec.get("cabochon"):
        # Pearls: a UV sphere pushed into each ellipsoid.
        segments, rings = 32, 16
        for gem in gems:
            e = gem["ellipsoid"]
            c, ax, ay, az = (Vector(e[k]) for k in ("c", "ax", "ay", "az"))
            base = len(verts)
            for i in range(rings + 1):
                th = math.pi * i / rings
                for j in range(segments):
                    ph = 2 * math.pi * j / segments
                    p = c + ax * (math.sin(th) * math.cos(ph)) + ay * (math.sin(th) * math.sin(ph)) + az * math.cos(th)
                    verts.append(place(p))
            for i in range(rings):
                for j in range(segments):
                    a = base + i * segments + j
                    b = base + i * segments + (j + 1) % segments
                    faces.append((a, b, b + segments, a + segments))
        material = principled(
            "pearl", srgb_to_linear(spec["color"]), roughness=0.28,
            **{"Coat Weight": 1.0, "Coat Roughness": 0.1, "Sheen Weight": 0.4}
        )
        obj = add_object(key, verts, faces, material, smooth=True)
        # Merge the doubled pole and seam vertices so the spheres shade smoothly.
        bpy.context.view_layer.objects.active = obj
        export_materials[key] = material
    else:
        for gem in gems:
            index = {}
            for face in gem["faces"]:
                loop = []
                for k in range(0, len(face), 3):
                    p = (face[k], face[k + 1], face[k + 2])
                    key3 = (round(p[0], 5), round(p[1], 5), round(p[2], 5))
                    if key3 not in index:
                        index[key3] = len(verts)
                        verts.append(place(p))
                    if not loop or loop[-1] != index[key3]:
                        loop.append(index[key3])
                if len(loop) > 1 and loop[0] == loop[-1]:
                    loop.pop()
                if len(loop) >= 3:
                    faces.append(loop)
        add_object(key, verts, faces, gem_material(spec))
        export_materials[key] = simple_gem_material(spec)
    print(f"{key}: {len(gems)} stones, {len(verts)} vertices")

# The orb inside.
if args.orb != "hollow":
    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=0.9985, location=(0, 0, GLOBE_HEIGHT))
    orb = bpy.context.object
    orb.name = "orb"
    bpy.ops.object.shade_smooth()
    if args.orb == "gold":
        orb.data.materials.append(principled("orb", srgb_to_linear((1.0, 0.9, 0.72)), metallic=1.0, roughness=0.2))
    else:
        orb.data.materials.append(principled("orb", srgb_to_linear((0.96, 0.94, 0.89)), roughness=0.45))
    for c in orb.users_collection:
        c.objects.unlink(orb)
    globe.objects.link(orb)

# ---------------------------------------------------------------- export

if not args.no_export:
    # Swap in the plain materials, export just the globe, then swap back.
    originals = {}
    for obj in globe.objects:
        if obj.name in export_materials:
            originals[obj.name] = obj.data.materials[0]
            obj.data.materials[0] = export_materials[obj.name]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in globe.objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = globe.objects[0]
    usdz = os.path.join(args.out, "gem-globe.usdz")
    bpy.ops.wm.usd_export(filepath=usdz, selected_objects_only=True, export_materials=True)
    glb = os.path.join(args.out, "gem-globe.glb")
    bpy.ops.export_scene.gltf(filepath=glb, use_selection=True, export_format="GLB", export_yup=True)
    for name, material in originals.items():
        bpy.data.objects[name].data.materials[0] = material
    bpy.ops.object.select_all(action="DESELECT")
    for path in (usdz, glb):
        print(f"exported {path} ({os.path.getsize(path) / 1e6:.1f} MB)")

if args.no_render:
    sys.exit(0)

# ---------------------------------------------------------------- the room

bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=4.55, depth=0.22, location=(0, 0, -0.11))
table = bpy.context.object
table.name = "table"
wood = bpy.data.materials.new("wood")
wood.use_nodes = True
nodes, links = wood.node_tree.nodes, wood.node_tree.links
bsdf = nodes["Principled BSDF"]
coords = nodes.new("ShaderNodeTexCoord")
mapping = nodes.new("ShaderNodeMapping")
mapping.inputs["Scale"].default_value = (0.22, 0.22, 0.22)
links.new(coords.outputs["Object"], mapping.inputs["Vector"])
diffuse = nodes.new("ShaderNodeTexImage")
diffuse.image = bpy.data.images.load(os.path.join(ASSETS, "wood", "wood_table_001_diff_1k.jpg"))
rough = nodes.new("ShaderNodeTexImage")
rough.image = bpy.data.images.load(os.path.join(ASSETS, "wood", "wood_table_001_rough_1k.jpg"))
rough.image.colorspace_settings.name = "Non-Color"
normal = nodes.new("ShaderNodeTexImage")
normal.image = bpy.data.images.load(os.path.join(ASSETS, "wood", "wood_table_001_nor_gl_1k.jpg"))
normal.image.colorspace_settings.name = "Non-Color"
bump = nodes.new("ShaderNodeNormalMap")
bump.inputs["Strength"].default_value = 0.5
for tex in (diffuse, rough, normal):
    links.new(mapping.outputs["Vector"], tex.inputs["Vector"])
darken = nodes.new("ShaderNodeMixRGB")
darken.blend_type = "MULTIPLY"
darken.inputs["Fac"].default_value = 1.0
darken.inputs["Color2"].default_value = (0.42, 0.36, 0.32, 1)
links.new(diffuse.outputs["Color"], darken.inputs["Color1"])
links.new(darken.outputs["Color"], bsdf.inputs["Base Color"])
links.new(rough.outputs["Color"], bsdf.inputs["Roughness"])
links.new(normal.outputs["Color"], bump.inputs["Color"])
links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
table.data.materials.append(wood)

bpy.ops.mesh.primitive_torus_add(major_radius=0.46, minor_radius=0.065, major_segments=96, minor_segments=24, location=(0, 0, 0.065))
ring = bpy.context.object
ring.name = "ring"
bpy.ops.object.shade_smooth()
ring.data.materials.append(principled("brass", srgb_to_linear((0.85, 0.64, 0.25)), metallic=1.0, roughness=0.25))

# The same photograph of a room that lights the web scene.
world = bpy.data.worlds.new("room")
world.use_nodes = True
scene.world = world
env = world.node_tree.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(os.path.join(ASSETS, "env", "wooden_lounge_1k.hdr"))
world_mapping = world.node_tree.nodes.new("ShaderNodeMapping")
world_coords = world.node_tree.nodes.new("ShaderNodeTexCoord")
# three.js and Blender put the seam of an equirectangular image in different places.
world_mapping.inputs["Rotation"].default_value = (0, 0, math.radians(0))
world.node_tree.links.new(world_coords.outputs["Generated"], world_mapping.inputs["Vector"])
world.node_tree.links.new(world_mapping.outputs["Vector"], env.inputs["Vector"])
background = world.node_tree.nodes["Background"]
world.node_tree.links.new(env.outputs["Color"], background.inputs["Color"])
background.inputs["Strength"].default_value = 1.25


def to_blender(x, y, z):
    return (x, -z, y)


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


# Key light: a small, strong lamp where the web scene has its spotlight.
key_data = bpy.data.lights.new("key", "AREA")
key_data.shape = "DISK"
key_data.size = 0.5
key_data.energy = 5000
key_data.color = (1.0, 0.94, 0.85)
key = bpy.data.objects.new("key", key_data)
key.location = to_blender(3.6, 6.4, 2.6)
scene.collection.objects.link(key)
look_at(key, to_blender(0, GLOBE_HEIGHT - 0.5, 0))

for name, direction, colour, energy in (("blue", (-0.62, 0.55, 0.56), (0.6, 0.72, 1.0), 500), ("warm", (-0.2, 0.8, -0.57), (1.0, 0.84, 0.64), 600)):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "DISK"
    data.size = 0.35
    data.energy = energy
    data.color = colour
    lamp = bpy.data.objects.new(name, data)
    d = Vector(direction).normalized() * 6.5
    lamp.location = to_blender(d.x, d.y + GLOBE_HEIGHT, d.z)
    scene.collection.objects.link(lamp)
    look_at(lamp, to_blender(0, GLOBE_HEIGHT, 0))

camera_data = bpy.data.cameras.new("camera")
camera_data.sensor_fit = "VERTICAL"
camera_data.angle = math.radians(34)
camera_data.dof.use_dof = True
camera_data.dof.focus_distance = 5.3
camera_data.dof.aperture_fstop = 5.6
camera = bpy.data.objects.new("camera", camera_data)
camera.location = to_blender(4.3, 2.2, 4.2)
scene.collection.objects.link(camera)
look_at(camera, to_blender(0, GLOBE_HEIGHT - 0.12, 0))
scene.camera = camera

# ---------------------------------------------------------------- Cycles

scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
for device_type in ("METAL", "OPTIX", "CUDA"):
    try:
        prefs.compute_device_type = device_type
        prefs.get_devices()
        if any(d.type == device_type for d in prefs.devices):
            for d in prefs.devices:
                d.use = d.type == device_type
            scene.cycles.device = "GPU"
            print(f"rendering on {device_type}")
            break
    except Exception:
        continue

scene.cycles.samples = args.samples
scene.cycles.use_denoising = True
# Light has to get into a stone, bounce around and get out again, many times over.
scene.cycles.max_bounces = 32
scene.cycles.transmission_bounces = 24
scene.cycles.glossy_bounces = 16
scene.cycles.volume_bounces = 0
scene.cycles.caustics_refractive = True
scene.cycles.caustics_reflective = True
scene.cycles.blur_glossy = 0.2
scene.cycles.sample_clamp_indirect = 20
scene.render.resolution_x = args.width
scene.render.resolution_y = args.height
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.render.filepath = os.path.join(args.out, f"cycles-{args.orb}.png")

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(args.out, "gem-globe.blend"))
bpy.ops.render.render(write_still=True)
print(f"rendered {scene.render.filepath}")
