// The three.js scene for the gem globe. Loaded only in the browser, only when the
// component scrolls into view, so three.js stays out of the site's main bundle.

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { GEM_TYPES, MAX_PLANES, generateLayout, makeEarthSampler, verifyLayout } from './layout'
import { DEFAULT_PARAMS, ENVIRONMENTS, GEM_BASE, ORBS } from './params'
import type { GemGlobeParams } from './params'
import type { EarthSampler, Layout, LayoutOptions, LayoutReport } from './layout'

const LAYOUT_KEYS: (keyof LayoutOptions)[] = ['count', 'seed', 'variety', 'gap', 'height', 'irregularity', 'palette']
const TEX_WIDTH = MAX_PLANES + 2
const GLOBE_Y = 1.1

// ---------------------------------------------------------------- shaders

const gemVertex = /* glsl */`
attribute float gemId;
flat varying int vGem;
varying vec3 vPos;
flat varying vec3 vNrm;
void main () {
  vGem = int(gemId + 0.5);
  vPos = position;
  vNrm = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Everything happens in the globe's own coordinates, where the stones' planes are stored.
const gemFragment = /* glsl */`
precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D tPlanes;
uniform sampler2D tEnv;
uniform sampler2D tBack;
uniform mat4 uMVP;
uniform mat3 uLocalToWorld;
uniform vec3 uCamLocal;
uniform float uBackPass;
uniform int uBounces;
uniform float uRefraction;
uniform float uFire;
uniform float uSaturation;
uniform float uScale;
uniform float uSparkle;
uniform vec3 uLightDir[3];
uniform vec3 uLightColor[3];
uniform vec3 uBaseReflect;
uniform vec3 uBaseDiffuse;
uniform vec3 uBaseTransmit;
uniform vec3 uBaseEmit;
uniform float uBaseIor;
uniform float uRoomGain;

flat varying int vGem;
varying vec3 vPos;
flat varying vec3 vNrm;

const int GEM_COL = ${MAX_PLANES};

// The room: the HDR photograph plus three small, very bright lamps. The lamps are what
// make the stones flash as the globe turns.
vec3 room (vec3 dl, float lod) {
  vec3 d = normalize(uLocalToWorld * dl);
  vec2 uv = vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5);
  vec3 c = min(textureLod(tEnv, uv, lod).rgb, vec3(40.0)) * uRoomGain;
  if (lod < 3.0) {
    for (int i = 0; i < 3; i++) {
      c += uLightColor[i] * uSparkle * smoothstep(0.9988, 0.9996, dot(d, uLightDir[i]));
    }
  }
  return c;
}

float schlick (float cosTheta, float n1, float n2) {
  float r0 = (n1 - n2) / (n1 + n2);
  r0 *= r0;
  float x = 1.0 - clamp(cosTheta, 0.0, 1.0);
  return r0 + (1.0 - r0) * x * x * x * x * x;
}

// Leave the stone through a facet. Red, green and blue bend by slightly different
// amounts, which is where a diamond's coloured flashes come from.
vec3 leave (vec3 dir, vec3 n, float ior, float spread) {
  vec3 r = refract(dir, -n, ior - spread);
  vec3 g = refract(dir, -n, ior);
  vec3 b = refract(dir, -n, ior + spread);
  vec3 c = vec3(0.0);
  if (dot(g, g) > 0.0) { c.g = room(g, 0.0).g; }
  if (dot(r, r) > 0.0) { c.r = room(r, 0.0).r; } else { c.r = c.g; }
  if (dot(b, b) > 0.0) { c.b = room(b, 0.0).b; } else { c.b = c.g; }
  return c;
}

void main () {
  if (uBackPass > 0.5 && dot(vPos, normalize(uCamLocal)) > 0.0) { discard; }

  vec4 info = texelFetch(tPlanes, ivec2(GEM_COL, vGem), 0);
  vec4 more = texelFetch(tPlanes, ivec2(GEM_COL + 1, vGem), 0);
  vec3 tint = max(info.rgb, vec3(0.012));
  float ior = 1.0 + (info.a - 1.0) * uRefraction;
  float spread = more.x * uFire;
  int count = int(more.y + 0.5);
  vec3 absorb = -log(tint) * uSaturation / (uScale * 2.4);

  vec3 n = normalize(vNrm);
  vec3 rd = normalize(vPos - uCamLocal);
  if (dot(rd, n) > 0.0) { n = -n; }

  float fresnel = schlick(dot(-rd, n), 1.0, ior);
  vec3 mirror = room(reflect(rd, n), 0.0);

  vec3 p = vPos;
  vec3 dir = refract(rd, n, 1.0 / ior);
  vec3 through = vec3(1.0);
  vec3 col = vec3(0.0);

  for (int bounce = 0; bounce < uBounces; bounce++) {
    // Find the facet this ray leaves through: the nearest plane ahead of it.
    float tMin = 1e9;
    int hit = -1;
    vec3 hn = vec3(0.0);
    for (int k = 0; k < count; k++) {
      vec4 pl = texelFetch(tPlanes, ivec2(k, vGem), 0);
      float dn = dot(pl.xyz, dir);
      if (dn > 1e-6) {
        float t = (pl.w - dot(pl.xyz, p)) / dn;
        if (t < tMin) { tMin = t; hit = k; hn = pl.xyz; }
      }
    }
    if (hit < 0) { break; }
    float t = max(tMin, 0.0);
    p += dir * t;
    through *= exp(-absorb * t);

    if (hit == 0) {
      // The flat base, resting on the orb.
      col += through * uBaseEmit;
      if (uBaseTransmit.g > 0.0) {
        vec3 o = refract(dir, -hn, ior / uBaseIor);
        if (dot(o, o) > 0.0) {
          float fr = schlick(dot(dir, hn), ior, uBaseIor);
          vec3 seen = room(o, 0.0);
          if (uBackPass < 0.5) {
            // Follow the ray across the inside of the globe and look up what the far
            // wall of stones looks like there.
            vec3 q = p + o * max(-2.0 * dot(p, o), 0.0);
            vec4 clip = uMVP * vec4(q, 1.0);
            vec4 back = texture(tBack, clip.xy / clip.w * 0.5 + 0.5);
            seen = mix(seen, back.rgb, back.a);
          }
          col += through * (1.0 - fr) * uBaseTransmit * seen;
          through *= fr;
        }
      } else {
        vec3 up = -hn;
        vec3 light = room(up, 6.0);
        for (int i = 0; i < 3; i++) {
          light += uLightColor[i] * 0.02 * max(dot(normalize(uLocalToWorld * up), uLightDir[i]), 0.0);
        }
        // That light also crossed the stone on its way in.
        col += through * uBaseDiffuse * light * pow(tint, vec3(0.5 * uSaturation));
        through *= uBaseReflect;
      }
      dir = reflect(dir, hn);
    } else {
      vec3 o = refract(dir, -hn, ior);
      if (dot(o, o) > 0.0) {
        float fr = schlick(dot(dir, hn), ior, 1.0);
        col += through * (1.0 - fr) * leave(dir, hn, ior, spread);
        through *= fr;
      }
      // Otherwise the angle is too shallow to escape: total internal reflection.
      dir = reflect(dir, hn);
    }
    if (max(through.r, max(through.g, through.b)) < 0.012) { break; }
  }
  // Whatever is still bouncing around gets a soft, averaged view of the room.
  col += through * room(dir, 3.5) * 0.6;

  gl_FragColor = vec4(mix(col, mirror, fresnel), 1.0);
}
`

// Seen from the key light: how much light each stone lets through, and in what colour.
// Rendered into a small texture that the spotlight then projects onto the table.
const causticVertex = /* glsl */`
attribute vec3 tint;
varying vec3 vTint;
flat varying vec3 vNrm;
void main () {
  vTint = tint;
  vNrm = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const causticFragment = /* glsl */`
uniform float uStrength;
varying vec3 vTint;
flat varying vec3 vNrm;
void main () {
  float h = fract(sin(dot(vNrm, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float focus = 0.6 + 3.2 * pow(h, 4.0);
  gl_FragColor = vec4(mix(vec3(1.0), pow(vTint, vec3(0.4)) * focus, uStrength), 1.0);
}
`

// ---------------------------------------------------------------- scene

export interface GemGlobeEvents {
  onProgress?: (message: string) => void
  onReport?: (report: LayoutReport, ms: number) => void
  onFps?: (fps: number, pixelRatio: number) => void
}

export class GemGlobeScene {
  params: GemGlobeParams
  private container: HTMLElement
  private events: GemGlobeEvents
  private renderer!: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private backScene = new THREE.Scene()
  private causticScene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  private controls!: OrbitControls
  private composer!: EffectComposer
  private bloom!: UnrealBloomPass
  private tilt = new THREE.Group()
  private globe = new THREE.Group()
  private backGlobe = new THREE.Group()
  private causticGlobe = new THREE.Group()
  private gemMesh: THREE.Mesh | null = null
  private backMesh: THREE.Mesh | null = null
  private causticMesh: THREE.Mesh | null = null
  private pearlMesh: THREE.Mesh | null = null
  private backPearls: THREE.Mesh | null = null
  private orb!: THREE.Mesh
  private orbMaterial!: THREE.MeshPhysicalMaterial
  private lamp = new THREE.PointLight(0xffb45a, 0, 0, 2)
  private table = new THREE.Group()
  private keyLight!: THREE.SpotLight
  private shared: Record<string, THREE.IUniform> = {}
  private tracedMaterial!: THREE.ShaderMaterial
  private backMaterial!: THREE.ShaderMaterial
  private causticMaterial!: THREE.ShaderMaterial
  private standardMaterials: THREE.MeshPhysicalMaterial[] = []
  private pearlMaterial!: THREE.MeshPhysicalMaterial
  private backPearlMaterial!: THREE.MeshPhysicalMaterial
  private backPlane = new THREE.Plane()
  private backTarget!: THREE.WebGLRenderTarget
  private causticTarget!: THREE.WebGLRenderTarget
  private planeTexture: THREE.DataTexture | null = null
  private envCache = new Map<string, THREE.DataTexture>()
  private earth: EarthSampler | null = null
  private layout: Layout | null = null
  private frame = 0
  private running = false
  private last = 0
  private pixelRatio = 1
  private maxPixelRatio = 2
  private fpsFrames = 0
  private fpsTime = 0
  private slowStreak = 0
  private observer: ResizeObserver | null = null
  private disposed = false
  private black = new THREE.Color(0, 0, 0)

  constructor (container: HTMLElement, params: Partial<GemGlobeParams> = {}, events: GemGlobeEvents = {}) {
    this.container = container
    this.params = { ...DEFAULT_PARAMS, ...params }
    this.events = events
  }

  get canvas () { return this.renderer.domElement }

  async init () {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    this.maxPixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2)
    this.pixelRatio = this.maxPixelRatio
    if (coarse) { this.params.bounces = Math.min(this.params.bounces, 4) }

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false })
    this.renderer = renderer
    renderer.setPixelRatio(this.pixelRatio)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.localClippingEnabled = true
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    this.container.appendChild(renderer.domElement)

    this.camera.position.set(4.3, 2.2, 4.2)
    this.controls = new OrbitControls(this.camera, renderer.domElement)
    this.controls.target.set(0, GLOBE_Y - 0.12, 0)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.enablePan = false
    this.controls.minDistance = 1.7
    this.controls.maxDistance = 11
    this.controls.maxPolarAngle = Math.PI * 0.497
    this.setImmersive(false)

    this.backTarget = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: true })
    this.causticTarget = new THREE.WebGLRenderTarget(768, 768, { depthBuffer: false })
    this.causticTarget.texture.colorSpace = THREE.SRGBColorSpace

    this.buildMaterials()
    this.buildRoom()

    const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 })
    this.composer = new EffectComposer(renderer, target)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.4, 0.2, 3.0)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())

    this.events.onProgress?.('Loading the room')
    const [, earth] = await Promise.all([this.loadEnvironment(this.params.environment), this.loadEarth(), this.loadWood()])
    this.earth = earth
    if (this.disposed) { return }

    this.events.onProgress?.('Cutting the stones')
    await new Promise(resolve => setTimeout(resolve, 20))
    this.rebuild()
    this.applyParams()

    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(this.container)
    this.resize()
  }

  // ---- loading

  private async loadEnvironment (key: string) {
    const env = ENVIRONMENTS[key] || ENVIRONMENTS.lounge!
    let texture = this.envCache.get(env.file)
    if (!texture) {
      texture = await new HDRLoader().loadAsync(`${GEM_BASE}/${env.file}`)
      texture.mapping = THREE.EquirectangularReflectionMapping
      // Mipmaps give the shader cheap blurred views of the room for soft light.
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.wrapS = THREE.RepeatWrapping
      texture.needsUpdate = true
      this.envCache.set(env.file, texture)
    }
    if (this.disposed) { return }
    this.scene.background = texture
    this.scene.environment = texture
    this.backScene.environment = texture
    this.shared.tEnv!.value = texture
  }

  private async loadEarth (): Promise<EarthSampler | null> {
    try {
      const read = async (file: string) => {
        const img = new Image()
        img.src = `${GEM_BASE}/${file}`
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        ctx.drawImage(img, 0, 0)
        return ctx.getImageData(0, 0, canvas.width, canvas.height)
      }
      const [color, water] = await Promise.all([read('earth-color.jpg'), read('earth-water.png')])
      return makeEarthSampler(color.data, color.width, color.height, water.data, water.width, water.height)
    } catch {
      return null
    }
  }

  private async loadWood () {
    const loader = new THREE.TextureLoader()
    const load = async (name: string, srgb: boolean) => {
      const t = await loader.loadAsync(`${GEM_BASE}/wood/wood_table_001_${name}_1k.jpg`)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(2, 2)
      t.anisotropy = 8
      if (srgb) { t.colorSpace = THREE.SRGBColorSpace }
      return t
    }
    try {
      const [map, normalMap, roughnessMap] = await Promise.all([load('diff', true), load('nor_gl', false), load('rough', false)])
      const material = (this.table.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial
      material.map = map; material.normalMap = normalMap; void roughnessMap
      material.color.set(0xd8c8b8)
      material.normalScale.set(0.35, 0.35)
      material.needsUpdate = true
    } catch { /* the table stays plain brown */ }
  }

  // ---- construction

  private buildMaterials () {
    const s = this.shared
    s.tPlanes = { value: null }
    s.tEnv = { value: null }
    s.tBack = { value: this.backTarget.texture }
    s.uMVP = { value: new THREE.Matrix4() }
    s.uLocalToWorld = { value: new THREE.Matrix3() }
    s.uCamLocal = { value: new THREE.Vector3() }
    s.uBounces = { value: 5 }
    s.uRefraction = { value: 1 }
    s.uFire = { value: 1 }
    s.uSaturation = { value: 1 }
    s.uScale = { value: 0.03 }
    s.uSparkle = { value: 1 }
    s.uLightDir = { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] }
    s.uLightColor = { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] }
    s.uBaseReflect = { value: new THREE.Color() }
    s.uBaseDiffuse = { value: new THREE.Color() }
    s.uBaseTransmit = { value: new THREE.Color() }
    s.uBaseEmit = { value: new THREE.Color() }
    s.uBaseIor = { value: 1 }
    s.uRoomGain = { value: 1.25 }

    this.tracedMaterial = new THREE.ShaderMaterial({
      uniforms: { ...s, uBackPass: { value: 0 } }, vertexShader: gemVertex, fragmentShader: gemFragment
    })
    this.backMaterial = new THREE.ShaderMaterial({
      // The back pass draws into tBack, so it must not also read from it.
      uniforms: { ...s, uBackPass: { value: 1 }, tBack: { value: null } }, vertexShader: gemVertex, fragmentShader: gemFragment
    })
    this.causticMaterial = new THREE.ShaderMaterial({
      uniforms: { uStrength: { value: 1 } },
      vertexShader: causticVertex,
      fragmentShader: causticFragment,
      blending: THREE.MultiplyBlending,
      premultipliedAlpha: true,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide
    })
    this.standardMaterials = GEM_TYPES.map((g) => {
      const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, metalness: 0, transmission: 1, ior: g.ior })
      m.name = g.key
      m.attenuationColor = new THREE.Color().setRGB(g.color[0], g.color[1], g.color[2], THREE.SRGBColorSpace)
      m.dispersion = g.dispersion * 20 / (g.ior - 1)
      return m
    })
    const pearl = GEM_TYPES.find(g => g.cabochon)!
    this.pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setRGB(pearl.color[0], pearl.color[1], pearl.color[2], THREE.SRGBColorSpace),
      roughness: 0.3,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 1,
      iridescenceIOR: 1.55,
      iridescenceThicknessMinimum: 180,
      iridescenceThicknessMaximum: 420,
      sheen: 0.6,
      sheenRoughness: 0.4,
      sheenColor: new THREE.Color(1.0, 0.82, 0.86)
    })
    this.pearlMaterial.name = 'pearl'
    this.backPearlMaterial = this.pearlMaterial.clone()
    this.backPearlMaterial.clippingPlanes = [this.backPlane]
  }

  private buildRoom () {
    // Table
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(4.6, 4.5, 0.22, 96, 1),
      new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.55, metalness: 0, envMapIntensity: 0.9 })
    )
    top.position.y = -0.11
    top.receiveShadow = true
    this.table.add(top)

    // A small brass ring so the globe has something to sit in.
    const brass = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.25, metalness: 1 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.065, 24, 96), brass)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.065
    ring.castShadow = true
    ring.receiveShadow = true
    this.table.add(ring)
    this.scene.add(this.table)

    // Globe
    this.tilt.position.set(0, GLOBE_Y, 0)
    this.tilt.rotation.z = -23.4 * Math.PI / 180
    this.tilt.add(this.globe)
    this.scene.add(this.tilt)
    this.backScene.add(this.backGlobe)
    this.causticScene.add(this.causticGlobe)
    this.backGlobe.matrixAutoUpdate = false
    this.causticGlobe.matrixAutoUpdate = false
    this.globe.rotation.y = 0.4

    this.orbMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffc558, roughness: 0.2, metalness: 1 })
    this.orbMaterial.name = 'orb'
    this.orb = new THREE.Mesh(new THREE.SphereGeometry(0.9985, 128, 80), this.orbMaterial)
    this.orb.renderOrder = -1
    this.globe.add(this.orb)
    this.tilt.add(this.lamp)

    // Lights. The key light throws the shadow and carries the caustic texture; all three
    // also appear inside the gem shader as small bright lamps.
    const key = new THREE.SpotLight(0xfff1dc, 130, 0, 0.26, 0.5, 2)
    key.position.set(3.6, 6.4, 2.6)
    key.target.position.set(0, GLOBE_Y - 0.5, 0)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 3
    key.shadow.camera.far = 14
    key.shadow.bias = -0.0004
    key.shadow.radius = 5
    key.map = this.causticTarget.texture
    this.keyLight = key
    this.scene.add(key, key.target)
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.5)
    fill.position.set(-4, 3, -2)
    this.scene.add(fill)

    const dirs = this.shared.uLightDir!.value as THREE.Vector3[]
    const cols = this.shared.uLightColor!.value as THREE.Color[]
    dirs[0]!.copy(key.position).sub(this.tilt.position).normalize()
    dirs[1]!.set(-0.62, 0.55, 0.56).normalize()
    dirs[2]!.set(-0.2, 0.8, -0.57).normalize()
    cols[0]!.setRGB(46, 42, 36)
    cols[1]!.setRGB(22, 27, 38)
    cols[2]!.setRGB(30, 26, 20)
  }

  // Cut the stones again and rebuild their meshes.
  rebuild () {
    const started = performance.now()
    const options = {} as Record<string, unknown>
    for (const k of LAYOUT_KEYS) { options[k] = this.params[k] }
    const layout = generateLayout(options as unknown as LayoutOptions, this.earth)
    this.layout = layout
    const elapsed = performance.now() - started

    for (const mesh of [this.gemMesh, this.backMesh, this.causticMesh, this.pearlMesh, this.backPearls]) {
      mesh?.removeFromParent()
    }
    this.gemMesh?.geometry.dispose()
    this.pearlMesh?.geometry.dispose()
    this.planeTexture?.dispose()

    // Faceted stones, grouped by type so the standard materials can be assigned per group.
    const faceted = layout.gems.filter(g => !g.ellipsoid).sort((a, b) => a.type - b.type)
    let triangles = 0
    for (const g of faceted) { for (const f of g.faces) { triangles += f.pts.length / 3 - 2 } }
    const position = new Float32Array(triangles * 9)
    const normal = new Float32Array(triangles * 9)
    const tint = new Float32Array(triangles * 9)
    const gemId = new Float32Array(triangles * 3)
    const data = new Float32Array(TEX_WIDTH * Math.max(1, faceted.length) * 4)
    const geometry = new THREE.BufferGeometry()
    const srgb = new THREE.Color()
    let v = 0
    let groupStart = 0
    let groupType = -1
    faceted.forEach((g, row) => {
      if (g.type !== groupType) {
        if (groupType >= 0) { geometry.addGroup(groupStart, v - groupStart, groupType) }
        groupStart = v; groupType = g.type
      }
      const spec = GEM_TYPES[g.type]!
      srgb.setRGB(spec.color[0], spec.color[1], spec.color[2], THREE.SRGBColorSpace)
      const o = row * TEX_WIDTH * 4
      data.set(g.planes, o)
      data.set([srgb.r, srgb.g, srgb.b, spec.ior], o + MAX_PLANES * 4)
      data.set([spec.dispersion, g.planes.length / 4, 0, 0], o + (MAX_PLANES + 1) * 4)
      for (const f of g.faces) {
        const p = f.pts
        const nx = g.planes[f.plane * 4]!; const ny = g.planes[f.plane * 4 + 1]!; const nz = g.planes[f.plane * 4 + 2]!
        for (let k = 1; k < p.length / 3 - 1; k++) {
          for (const idx of [0, k, k + 1]) {
            position[v * 3] = p[idx * 3]!; position[v * 3 + 1] = p[idx * 3 + 1]!; position[v * 3 + 2] = p[idx * 3 + 2]!
            normal[v * 3] = nx; normal[v * 3 + 1] = ny; normal[v * 3 + 2] = nz
            tint[v * 3] = spec.color[0]; tint[v * 3 + 1] = spec.color[1]; tint[v * 3 + 2] = spec.color[2]
            gemId[v] = row
            v++
          }
        }
      }
    })
    if (groupType >= 0) { geometry.addGroup(groupStart, v - groupStart, groupType) }
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
    geometry.setAttribute('tint', new THREE.BufferAttribute(tint, 3))
    geometry.setAttribute('gemId', new THREE.BufferAttribute(gemId, 1))
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.2)

    const texture = new THREE.DataTexture(data, TEX_WIDTH, Math.max(1, faceted.length), THREE.RGBAFormat, THREE.FloatType)
    texture.needsUpdate = true
    this.planeTexture = texture
    this.shared.tPlanes!.value = texture
    this.shared.uScale!.value = layout.scale

    for (const m of this.standardMaterials) {
      m.thickness = layout.scale * 1.6
      m.attenuationDistance = layout.scale * 2.2 / Math.max(0.05, this.params.saturation)
    }

    this.gemMesh = new THREE.Mesh(geometry, this.tracedMaterial)
    this.backMesh = new THREE.Mesh(geometry, this.backMaterial)
    this.causticMesh = new THREE.Mesh(geometry, this.causticMaterial)
    this.globe.add(this.gemMesh)
    this.backGlobe.add(this.backMesh)
    this.causticGlobe.add(this.causticMesh)

    // Pearls: one unit sphere per pearl, squashed into its ellipsoid.
    const pearls = layout.gems.filter(g => g.ellipsoid)
    const unit = new THREE.SphereGeometry(1, 28, 18)
    const up = unit.getAttribute('position')
    const ui = unit.getIndex()!
    const pp = new Float32Array(pearls.length * up.count * 3)
    const pn = new Float32Array(pearls.length * up.count * 3)
    const pi = new Uint32Array(pearls.length * ui.count)
    const vec = new THREE.Vector3()
    const m3 = new THREE.Matrix3()
    const nm = new THREE.Matrix3()
    pearls.forEach((g, i) => {
      const e = g.ellipsoid!
      m3.set(e.ax[0], e.ay[0], e.az[0], e.ax[1], e.ay[1], e.az[1], e.ax[2], e.ay[2], e.az[2])
      nm.copy(m3).invert().transpose()
      for (let k = 0; k < up.count; k++) {
        const o = (i * up.count + k) * 3
        vec.fromBufferAttribute(up, k)
        const unitNormal = vec.clone()
        vec.applyMatrix3(m3)
        pp[o] = vec.x + e.c[0]; pp[o + 1] = vec.y + e.c[1]; pp[o + 2] = vec.z + e.c[2]
        unitNormal.applyMatrix3(nm).normalize()
        pn[o] = unitNormal.x; pn[o + 1] = unitNormal.y; pn[o + 2] = unitNormal.z
      }
      for (let k = 0; k < ui.count; k++) { pi[i * ui.count + k] = ui.getX(k) + i * up.count }
    })
    unit.dispose()
    const pearlGeometry = new THREE.BufferGeometry()
    pearlGeometry.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    pearlGeometry.setAttribute('normal', new THREE.BufferAttribute(pn, 3))
    pearlGeometry.setIndex(new THREE.BufferAttribute(pi, 1))
    pearlGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.2)
    this.pearlMesh = new THREE.Mesh(pearlGeometry, this.pearlMaterial)
    this.pearlMesh.castShadow = true
    this.backPearls = new THREE.Mesh(pearlGeometry, this.backPearlMaterial)
    this.globe.add(this.pearlMesh)
    this.backGlobe.add(this.backPearls)

    this.applyParams()
    this.events.onReport?.(verifyLayout(layout), elapsed)
  }

  // ---- parameters

  async set (patch: Partial<GemGlobeParams>) {
    const before = this.params
    this.params = { ...before, ...patch }
    if (patch.orb && patch.orb !== before.orb && ORBS[patch.orb]) {
      this.params.orbColor = ORBS[patch.orb]!.color
      this.params.glow = ORBS[patch.orb]!.glow
    }
    if (patch.environment && patch.environment !== before.environment) {
      await this.loadEnvironment(patch.environment)
    }
    if (LAYOUT_KEYS.some(k => k in patch && patch[k] !== before[k])) {
      this.rebuild()
    } else {
      this.applyParams()
    }
  }

  private applyParams () {
    const p = this.params
    const s = this.shared
    s.uBounces!.value = Math.round(p.bounces)
    s.uRefraction!.value = p.refraction
    s.uFire!.value = p.fire
    s.uSaturation!.value = p.saturation
    s.uSparkle!.value = p.sparkle

    const orb = ORBS[p.orb] || ORBS.gold!
    const color = new THREE.Color(p.orbColor)
    const clear = orb.kind === 'clear' || orb.kind === 'none'
    const reflect = s.uBaseReflect!.value as THREE.Color
    const diffuse = s.uBaseDiffuse!.value as THREE.Color
    const transmit = s.uBaseTransmit!.value as THREE.Color
    const emit = s.uBaseEmit!.value as THREE.Color
    reflect.setScalar(0); diffuse.setScalar(0); transmit.setScalar(0)
    if (orb.kind === 'metal') {
      // Polished but not perfect: mostly a mirror, partly a soft glow of the metal's colour.
      // The stones are foil-backed, as jewellers did for centuries: mostly a neutral mirror
      // with a little of the metal's colour, so blue stones over gold do not turn muddy.
      const foil = color.clone().lerp(new THREE.Color(1, 1, 1), 0.7)
      reflect.copy(foil).multiplyScalar(0.8)
      diffuse.copy(foil).multiplyScalar(0.14)
    } else if (orb.kind === 'matte') {
      diffuse.copy(color).multiplyScalar(orb.albedo)
      // A dark, polished orb still mirrors the room; a pale matte one mostly scatters it.
      reflect.setScalar(0.04 + 0.3 * (1 - orb.roughness) * (1 - Math.max(color.r, color.g, color.b)))
    } else {
      transmit.copy(color).lerp(new THREE.Color(1, 1, 1), 0.5)
    }
    emit.copy(color).multiplyScalar(p.glow)
    s.uBaseIor!.value = orb.ior

    const m = this.orbMaterial
    m.color.copy(color)
    m.metalness = orb.kind === 'metal' ? 1 : 0
    m.roughness = orb.roughness
    m.emissive.copy(color)
    m.emissiveIntensity = p.glow
    m.transparent = orb.kind === 'clear'
    m.opacity = orb.kind === 'clear' ? 0.16 : 1
    m.depthWrite = orb.kind !== 'clear'
    m.clearcoat = orb.kind === 'matte' ? 0.6 : 0
    this.orb.visible = orb.kind !== 'none'
    this.orb.castShadow = !clear
    this.lamp.color.copy(color)
    this.lamp.intensity = p.glow * 3
    this.causticMaterial.uniforms.uStrength!.value = clear ? 1 : 0

    for (const sm of this.standardMaterials) {
      const spec = GEM_TYPES.find(g => g.key === sm.name)!
      sm.ior = 1 + (spec.ior - 1) * p.refraction
      sm.dispersion = spec.dispersion * 20 / (spec.ior - 1) * p.fire
      sm.attenuationDistance = (this.layout?.scale || 0.03) * 2.2 / Math.max(0.05, p.saturation)
    }
    if (this.gemMesh) {
      this.gemMesh.material = p.mode === 'traced' ? this.tracedMaterial : this.standardMaterials
      // Clear orbs let the key light through the stones; otherwise the stones shade the table.
      this.gemMesh.castShadow = !clear
    }

    this.table.visible = p.table
    this.scene.backgroundBlurriness = p.backgroundBlur
    this.scene.backgroundIntensity = 0.75
    this.scene.environmentIntensity = 0.85
    this.renderer.toneMappingExposure = p.exposure
    this.bloom.strength = p.bloom
    this.bloom.enabled = p.bloom > 0.01
  }

  // Inline, a vertical swipe scrolls the page and the wheel is left alone.
  // Full screen, the globe gets every gesture.
  setImmersive (on: boolean) {
    this.controls.enableZoom = on
    this.renderer.domElement.style.touchAction = on ? 'none' : 'pan-y'
  }

  // ---- rendering

  resize () {
    const w = Math.max(1, this.container.clientWidth)
    const h = Math.max(1, this.container.clientHeight)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setSize(w, h, false)
    this.composer.setPixelRatio(this.pixelRatio)
    this.composer.setSize(w, h)
    this.backTarget.setSize(Math.round(w * this.pixelRatio), Math.round(h * this.pixelRatio))
    this.camera.aspect = w / h
    // Keep the whole globe in view on tall, narrow screens.
    this.camera.fov = w < h ? Math.min(60, 34 * Math.pow(h / w, 0.75)) : 34
    this.camera.updateProjectionMatrix()
    if (!this.running) { this.render(0) }
  }

  start () {
    if (this.running || this.disposed) { return }
    this.running = true
    this.last = performance.now()
    const loop = (now: number) => {
      if (!this.running) { return }
      this.frame = requestAnimationFrame(loop)
      const dt = Math.min(0.1, (now - this.last) / 1000)
      this.last = now
      this.render(dt)
      this.measure(dt)
    }
    this.frame = requestAnimationFrame(loop)
  }

  stop () {
    this.running = false
    cancelAnimationFrame(this.frame)
  }

  // Drop the resolution when frames get slow, and bring it back when there is room.
  private measure (dt: number) {
    this.fpsFrames++
    this.fpsTime += dt
    if (this.fpsTime < 1) { return }
    const fps = this.fpsFrames / this.fpsTime
    this.fpsFrames = 0; this.fpsTime = 0
    if (fps < 28 && this.pixelRatio > 0.6) {
      if (++this.slowStreak >= 2) {
        this.pixelRatio = Math.max(0.6, this.pixelRatio * 0.8)
        this.slowStreak = 0
        this.resize()
      }
    } else {
      this.slowStreak = 0
      if (fps > 55 && this.pixelRatio < this.maxPixelRatio) {
        this.pixelRatio = Math.min(this.maxPixelRatio, this.pixelRatio * 1.12)
        this.resize()
      }
    }
    this.events.onFps?.(fps, this.pixelRatio)
  }

  render (dt: number) {
    if (!this.gemMesh || this.disposed) { return }
    const renderer = this.renderer
    this.globe.rotation.y += dt * this.params.spin
    this.controls.update()
    this.scene.updateMatrixWorld()
    this.camera.updateMatrixWorld()

    const world = this.globe.matrixWorld
    this.backGlobe.matrix.copy(world); this.backGlobe.matrixWorldNeedsUpdate = true
    this.causticGlobe.matrix.copy(world); this.causticGlobe.matrixWorldNeedsUpdate = true
    const s = this.shared
    ;(s.uLocalToWorld!.value as THREE.Matrix3).setFromMatrix4(world)
    ;(s.uCamLocal!.value as THREE.Vector3).copy(this.camera.position).applyMatrix4(world.clone().invert())
    ;(s.uMVP!.value as THREE.Matrix4).multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse).multiply(world)

    const traced = this.params.mode === 'traced'
    const seeThrough = (s.uBaseTransmit!.value as THREE.Color).g > 0
    const previous = renderer.getClearColor(new THREE.Color())
    const previousAlpha = renderer.getClearAlpha()

    if (traced && seeThrough) {
      // The far wall of stones, drawn on its own so the near stones can look through to it.
      const centre = this.tilt.position
      const towards = this.camera.position.clone().sub(centre).normalize()
      this.backPlane.setFromNormalAndCoplanarPoint(towards.negate(), centre)
      renderer.setRenderTarget(this.backTarget)
      renderer.setClearColor(this.black, 0)
      renderer.clear()
      renderer.render(this.backScene, this.camera)
    }

    // What the key light sees. The spotlight projects this onto whatever it lights.
    const shadowCamera = this.keyLight.shadow.camera
    this.keyLight.shadow.updateMatrices(this.keyLight)
    renderer.setRenderTarget(this.causticTarget)
    renderer.setClearColor(0xffffff, 1)
    renderer.clear()
    if (seeThrough) { renderer.render(this.causticScene, shadowCamera) }
    renderer.setRenderTarget(null)
    renderer.setClearColor(previous, previousAlpha)

    this.composer.render(dt)
  }

  // ---- output

  async screenshot (): Promise<Blob | null> {
    this.render(0)
    return await new Promise(resolve => this.renderer.domElement.toBlob(resolve, 'image/png'))
  }

  // The globe as a .glb file: stones with real glass-like materials, pearls and the orb.
  async exportGLB (): Promise<Blob> {
    const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js')
    const root = new THREE.Group()
    root.name = 'gem-globe'
    const gems = new THREE.Mesh(this.gemMesh!.geometry.clone(), this.standardMaterials)
    gems.geometry.deleteAttribute('gemId')
    gems.geometry.deleteAttribute('tint')
    gems.name = 'gems'
    const pearls = new THREE.Mesh(this.pearlMesh!.geometry, this.pearlMaterial)
    pearls.name = 'pearls'
    root.add(gems, pearls)
    if (this.orb.visible) {
      const orb = new THREE.Mesh(this.orb.geometry, this.orbMaterial)
      orb.name = 'orb'
      root.add(orb)
    }
    const buffer = await new GLTFExporter().parseAsync(root, { binary: true }) as ArrayBuffer
    gems.geometry.dispose()
    return new Blob([buffer], { type: 'model/gltf-binary' })
  }

  dispose () {
    this.disposed = true
    this.stop()
    this.observer?.disconnect()
    this.controls?.dispose()
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose()
    })
    for (const t of this.envCache.values()) { t.dispose() }
    this.planeTexture?.dispose()
    this.backTarget?.dispose()
    this.causticTarget?.dispose()
    this.composer?.dispose()
    this.renderer?.dispose()
    this.renderer?.domElement.remove()
  }
}
