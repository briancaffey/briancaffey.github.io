#!/usr/bin/env python3
"""Restyle the contact-page portrait with FLUX.3 Klein running on the home cluster.

Every variant is a real image-to-image pass through
`nvcr.io/nim/black-forest-labs/flux-3-image-klein`, not a local pixel filter.

Two ways to reach the model:

  # 1. the inference.club gateway (OpenAI-compatible /v1/images/edits)
  export INFERENCE_CLUB_API_KEY=...            # Dashboard -> Settings -> Token
  python3 scripts/generate_profile_styles.py --endpoint https://club.lan/v1

  # 2. straight at the NIM (default) -- from the workstation, port-forward first:
  kubectl -n inference-club port-forward svc/flux3-klein-nim 18000:8000
  python3 scripts/generate_profile_styles.py

Writes <slug>.webp (960x721) and <slug>.thumb.webp (240x180) per style into
public/static/contact/filters/, plus an `original` pair from the source photo.
"""

import argparse
import base64
import io
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "static", "JBC_PA.jpg")
OUT_DIR = os.path.join(ROOT, "public", "static", "contact", "filters")

# ~1.5 MP, 4:3, the size the NIM asks for ("around 2 MP").
IN_W, IN_H = 1408, 1056
OUT_W, OUT_H = 960, 721
THUMB_W = 240

# Frames every prompt. The medium has to win over the photograph, so this leads
# with "redraw everything" and only pins the composition -- an earlier version
# asked to preserve his likeness and the model kept handing back lightly
# retouched photos.
LEAD = (
    "Completely redraw this entire photograph -- the man, his white wired"
    " earphones, the cracked Liberty Bell and the background behind them -- as "
)
KEEP = (
    " Every part of the image must be rendered in this medium, with nothing left"
    " looking photographic. Keep the same composition and camera angle: the man's"
    " head and shoulders fill the right side, the bell hangs on the left, and he"
    " is smiling faintly at the camera."
)

STYLES = [
    ("cartoon", "Cartoon",
     "a bold 2D cartoon illustration, where his face is drawn with thick black ink outlines, flat cel-shaded skin and simplified features, "
     "and the bell is a flat grey shape with one hard-edged highlight."),
    ("anime", "Anime Cel",
     "a 1990s Studio Ghibli anime cel, where his face is drawn with thin crisp black line art, large simplified eyes and completely flat "
     "unshaded skin split by one hard-edged shadow, no photographic texture anywhere, over a soft hand-painted background."),
    ("comic", "Comic Book",
     "a vintage American superhero comic book panel printed on newsprint, where his face is drawn with thick black brush-ink outlines and bold "
     "spot blacks, his skin is one flat colour broken only by large visible Ben-Day halftone dots, and the bell is a flat cyan shape under a "
     "heavy black outline, with slightly off-register colour plates."),
    ("pixar", "3D Animation",
     "a glossy stylised 3D animated feature film, where he becomes a cartoon character with oversized expressive eyes and smooth "
     "subsurface-scattering skin under soft global illumination, and the bell is a clean shaded 3D model."),
    ("claymation", "Claymation",
     "a stop-motion plasticine clay animation, where his head and jacket are modelled in clay with visible thumbprints and seams, his eyes are "
     "small glossy beads, and the bell is sculpted grey clay on a handmade set."),
    ("lego", "LEGO Bricks",
     "a scene rebuilt entirely out of LEGO, where he is a minifigure with a printed face and claw hands and the bell is assembled from grey "
     "bricks, everything in glossy moulded ABS plastic with visible studs."),
    ("oil", "Oil Painting",
     "a thick impasto oil painting on canvas, where his face is built from loaded directional brushstrokes of broken colour, the paint standing "
     "proud of the surface and the canvas weave showing through."),
    ("watercolor", "Watercolour",
     "a loose wet-on-wet watercolour on rough cold-press paper, where his face is suggested with a few transparent washes that bloom and run at "
     "the edges, bare white paper left for the highlights."),
    ("impressionist", "Impressionist",
     "a French Impressionist oil sketch, where his face dissolves into short dabs of complementary colour with no hard edges, and the bell is a "
     "mass of dappled violet and ochre strokes."),
    ("renaissance", "Old Master",
     "a 1640 Dutch master oil painting on a cracked wooden panel, where his face is built entirely from thick visible brushstrokes and "
     "hard-edged impasto highlights in ochre and lead white with no photographic detail at all, his jacket is a dark period doublet with a "
     "white linen collar, the background is near-black, and heavy craquelure runs across the whole surface."),
    ("ukiyoe", "Ukiyo-e",
     "a Japanese ukiyo-e woodblock print by Hokusai, where his face is reduced to a few confident flat black brush outlines over unshaded cream "
     "skin, the bell is a flat block of indigo, and the whole sheet shows woodgrain and washi paper fibres."),
    ("woodcut", "Woodcut",
     "a black and white woodcut relief print, where his face is carved entirely from bold parallel gouge marks and cross-hatching with no grey "
     "tones at all, printed in black ink on rough paper."),
    ("sketch", "Pencil Sketch",
     "a graphite pencil portrait study in a sketchbook, where his face is built from confident construction lines and cross-hatched shadows "
     "smudged with a finger, on bare white paper."),
    ("charcoal", "Charcoal",
     "a bold charcoal drawing on toned grey paper, where his face is blocked in with rich smudged blacks and white chalk highlights, every "
     "stroke left loose and visible."),
    ("stainedglass", "Stained Glass",
     "a leaded stained-glass cathedral window, where his face, hair and jacket are each built from flat panes of coloured glass separated by "
     "thick black lead cames, the bell is amber glass, and the whole panel is backlit and glowing with no photographic skin anywhere."),
    ("mosaic", "Roman Mosaic",
     "an ancient Roman floor mosaic, where his face is assembled from hundreds of small irregular stone tesserae in muted earth tones with "
     "visible grout between every tile."),
    ("artdeco", "Art Deco Poster",
     "a 1930s Art Deco travel poster, where his face is simplified into flat geometric planes of gold and teal with airbrushed gradients and a "
     "strong symmetrical outline."),
    ("popart", "Pop Art",
     "an Andy Warhol silkscreen print, where his face is posterised into flat blocks of clashing fluorescent colour over a hard black key line, "
     "with visible off-register printing."),
    ("streetart", "Street Art",
     "a large spray-painted stencil mural on a weathered brick wall, where his face is a high-contrast two-layer stencil with paint drips and "
     "overspray, the brick texture showing through everything."),
    ("papercut", "Papercut",
     "a layered cut-paper diorama, where his face and the bell are each assembled from stacked sheets of coloured paper with clean knife-cut "
     "edges and soft drop shadows between the layers."),
    ("embroidery", "Embroidery",
     "an embroidered patch on felt, where his face is stitched in coloured thread with visible satin-stitch direction and raised texture, "
     "inside a thick merrowed border."),
    ("bronze", "Bronze Statue",
     "a cast bronze memorial sculpture, where he and the bell are both solid metal with green verdigris patina and polished highlights on the "
     "raised surfaces, photographed outdoors."),
    ("cyberpunk", "Cyberpunk",
     "a rain-slick cyberpunk night scene, where his face is lit from below by magenta and cyan neon signage with wet reflections and volumetric "
     "haze, and the bell glows under the neon."),
    ("lowpoly", "Low Poly",
     "a faceted low-polygon 3D render, where his face is reduced to flat triangular facets with hard shading edges and no smooth curves "
     "anywhere, in a muted pastel palette."),
]



def encode_source():
    src = Image.open(SRC).convert("RGB").resize((IN_W, IN_H), Image.LANCZOS)
    buf = io.BytesIO()
    src.save(buf, "PNG")
    return src, base64.b64encode(buf.getvalue()).decode()


def post(url, body, api_key, timeout=900):
    data = json.dumps(body).encode()
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    req = urllib.request.Request(url, data=data, headers=headers)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE  # club.lan uses an internal CA
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
        return json.load(r)


def restyle(endpoint, api_key, b64, prompt, seed, steps):
    """Returns a PIL image. Uses the gateway's OpenAI shape when a key is set."""
    if api_key:
        out = post(f"{endpoint}/images/edits", {
            "prompt": prompt,
            "image": f"data:image/png;base64,{b64}",
            "response_format": "b64_json",
            "seed": seed,
            "steps": steps,
            "resize_response_image": True,
        }, api_key)
        payload = out["data"][0]["b64_json"]
    else:
        out = post(f"{endpoint}/infer", {
            "prompt": prompt,
            "image": f"data:image/png;base64,{b64}",
            "mode": "i2i",
            "seed": seed,
            "steps": steps,
            "resize_response_image": True,
        }, None)
        payload = out["artifacts"][0]["base64"]
    if "," in payload[:64]:
        payload = payload.split(",", 1)[1]
    return Image.open(io.BytesIO(base64.b64decode(payload))).convert("RGB")


def save(img, slug):
    os.makedirs(OUT_DIR, exist_ok=True)
    full = img.resize((OUT_W, OUT_H), Image.LANCZOS)
    full.save(os.path.join(OUT_DIR, slug + ".webp"), "WEBP", quality=82, method=5)
    thumb = img.resize((THUMB_W, int(THUMB_W * OUT_H / OUT_W)), Image.LANCZOS)
    thumb.save(os.path.join(OUT_DIR, slug + ".thumb.webp"), "WEBP", quality=74, method=5)
    return os.path.getsize(os.path.join(OUT_DIR, slug + ".webp"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--endpoint", default=os.environ.get("FLUX_ENDPOINT", "http://127.0.0.1:18000/v1"))
    ap.add_argument("--steps", type=int, default=35)
    ap.add_argument("--seed", type=int, default=20261114)
    ap.add_argument("--only", default="", help="comma-separated slugs to regenerate")
    args = ap.parse_args()

    api_key = os.environ.get("INFERENCE_CLUB_API_KEY")
    endpoint = args.endpoint.rstrip("/")
    print(f"endpoint {endpoint}  auth={'bearer' if api_key else 'none (direct NIM)'}  steps={args.steps}")

    src, b64 = encode_source()
    wanted = {s.strip() for s in args.only.split(",") if s.strip()}

    if not wanted:
        print(f"{'original':<14} {save(src, 'original')/1024:7.1f} KB")

    failures = []
    for i, (slug, name, desc) in enumerate(STYLES, 1):
        if wanted and slug not in wanted:
            continue
        prompt = f"{LEAD}{desc}{KEEP}"
        t0 = time.time()
        try:
            img = restyle(endpoint, api_key, b64, prompt, args.seed + i, args.steps)
        except urllib.error.HTTPError as e:
            failures.append((slug, f"HTTP {e.code} {e.read()[:200].decode(errors='replace')}"))
            print(f"{slug:<14} FAILED  {failures[-1][1]}")
            continue
        except Exception as e:  # noqa: BLE001 - report and keep going
            failures.append((slug, repr(e)))
            print(f"{slug:<14} FAILED  {e!r}")
            continue
        size = save(img, slug)
        print(f"{slug:<14} {size/1024:7.1f} KB  {time.time()-t0:5.1f}s  {name}")

    if failures:
        print(f"\n{len(failures)} failed:", ", ".join(s for s, _ in failures))
        sys.exit(1)
    print(f"\n{len(STYLES) if not wanted else len(wanted)} styles via FLUX.3 Klein")


if __name__ == "__main__":
    main()
