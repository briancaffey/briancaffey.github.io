// Data for the 3D models embedded in the Pokédex article.
// Files live in public/static/pokedex-3d: models/<code>-<style>.glb and images/<code>-<style>.webp.

export const POKEDEX_BASE = '/static/pokedex-3d'

export interface PokedexStyle {
  name: string
  // What the image model was asked for. Empty for the two styles that are not restyles.
  prompt: string
  note?: string
}

const KEEP = 'Keep the same character, pose, silhouette and proportions. Single full-body figure, centered, plain white background, soft even studio lighting, no text.'

export const POKEDEX_STYLES: Record<string, PokedexStyle> = {
  base: { name: 'Original artwork', prompt: '', note: 'The Pokédex artwork, sent to the 3D model as it is.' },
  legacy: { name: '2025 restyle', prompt: 'in 3D style with white background', note: 'The 2025 pipeline: restyled with FLUX.1 Kontext, then modelled with Hunyuan3D 2.1.' },
  clay: { name: 'Clay', prompt: `Re-render this character as a handmade stop-motion claymation figure sculpted from matte modeling clay, with visible fingerprints and soft tool marks. ${KEEP}` },
  glass: { name: 'Stained glass', prompt: `Re-render this character as a three-dimensional stained glass sculpture: translucent colored glass panels joined by dark lead came lines, light glowing through the glass. ${KEEP}` },
  wood: { name: 'Carved wood', prompt: `Re-render this character as a hand-carved wooden figurine: visible wood grain and chisel marks, lightly stained in the character's colors. ${KEEP}` },
  origami: { name: 'Origami', prompt: `Re-render this character as a folded paper origami sculpture: crisp creases, flat colored paper facets. ${KEEP}` },
  chrome: { name: 'Chrome', prompt: `Re-render this character as a polished chrome metal statue: mirror-like reflective liquid metal surface with subtle tinted reflections of the character's colors. ${KEEP}` },
  knit: { name: 'Crochet', prompt: `Re-render this character as a crocheted amigurumi plush toy: chunky knitted yarn texture, visible stitches, soft stuffed shape. ${KEEP}` },
  bronze: { name: 'Bronze', prompt: `Re-render this character as an aged cast bronze statue with green verdigris patina in the recesses. ${KEEP}` },
  bricks: { name: 'Toy bricks', prompt: `Re-render this character as a toy built from small plastic building bricks: blocky stepped surfaces with studs, glossy plastic in the character's colors. ${KEEP}` }
}

export const POKEDEX_NAMES: Record<string, string> = {
  '001': 'Bulbasaur',
  '006': 'Charizard',
  '007': 'Squirtle',
  '025': 'Pikachu',
  '039': 'Jigglypuff',
  '054': 'Psyduck',
  '059': 'Arcanine',
  '094': 'Gengar',
  '104': 'Cubone',
  '133': 'Eevee',
  '143': 'Snorlax',
  '149': 'Dragonite',
  '150': 'Mewtwo',
  '197': 'Umbreon',
  '445': 'Garchomp',
  '448': 'Lucario'
}

export const pokedexModel = (code: string, style: string) => `${POKEDEX_BASE}/models/${code}-${style}.glb`
export const pokedexImage = (code: string, style: string) => `${POKEDEX_BASE}/images/${code}-${style}.webp`

// <model-viewer> is loaded once, on the first page that shows a model.
let viewerReady: Promise<void> | null = null

export function loadPokedexViewer (): Promise<void> {
  if (import.meta.server) { return Promise.resolve() }
  if (viewerReady) { return viewerReady }
  viewerReady = new Promise((resolve, reject) => {
    if (customElements.get('model-viewer')) { return resolve() }
    // The models are meshopt-compressed; the viewer fetches this decoder when it meets the first one.
    const scope = self as unknown as { ModelViewerElement?: Record<string, unknown> }
    scope.ModelViewerElement = {
      ...(scope.ModelViewerElement || {}),
      meshoptDecoderLocation: `${POKEDEX_BASE}/vendor/meshopt_decoder.js`
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = `${POKEDEX_BASE}/vendor/model-viewer.min.js`
    script.onload = () => resolve()
    script.onerror = () => { viewerReady = null; reject(new Error('The 3D viewer could not be loaded')) }
    document.head.appendChild(script)
  })
  return viewerReady
}
