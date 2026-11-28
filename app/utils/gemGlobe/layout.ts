// Geometry for the gem globe: where every stone sits and how it is cut.
//
// This file has no dependencies and touches no DOM, so the same code runs in the browser
// (for the three.js scene) and in Node (scripts/gem-globe/export-layout.mjs, which feeds Blender).
//
// The globe is a unit sphere. Every stone is a convex solid described two ways at once:
// as a list of planes (the fragment shader traces light through those) and as the polygons
// those planes leave behind (the mesh). Both come from the same clipping step, so they agree.

export type Vec3 = [number, number, number]

// ---------------------------------------------------------------- random numbers

export function mulberry32 (seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------------------------------------------------------------- gem table

export interface GemType {
  key: string
  name: string
  // Colour of white light after crossing one stone, sRGB 0..1.
  color: Vec3
  // Refractive index and dispersion (n_F - n_C style spread used by the shader and by glTF).
  ior: number
  dispersion: number
  // Pearls are smooth and opaque; everything else is faceted and clear.
  cabochon?: boolean
}

export const GEM_TYPES: GemType[] = [
  { key: 'diamond', name: 'Diamond', color: [0.97, 0.98, 1.0], ior: 2.417, dispersion: 0.044 },
  { key: 'ruby', name: 'Ruby', color: [0.86, 0.035, 0.13], ior: 1.77, dispersion: 0.018 },
  { key: 'sapphire', name: 'Sapphire', color: [0.04, 0.3, 0.86], ior: 1.77, dispersion: 0.018 },
  { key: 'tanzanite', name: 'Tanzanite', color: [0.3, 0.22, 0.86], ior: 1.69, dispersion: 0.021 },
  { key: 'aquamarine', name: 'Aquamarine', color: [0.42, 0.86, 0.93], ior: 1.58, dispersion: 0.014 },
  { key: 'topaz', name: 'Blue topaz', color: [0.16, 0.58, 0.92], ior: 1.62, dispersion: 0.014 },
  { key: 'emerald', name: 'Emerald', color: [0.02, 0.6, 0.27], ior: 1.58, dispersion: 0.014 },
  { key: 'tsavorite', name: 'Tsavorite', color: [0.14, 0.78, 0.2], ior: 1.74, dispersion: 0.028 },
  { key: 'peridot', name: 'Peridot', color: [0.62, 0.82, 0.14], ior: 1.67, dispersion: 0.02 },
  { key: 'citrine', name: 'Citrine', color: [0.99, 0.76, 0.14], ior: 1.55, dispersion: 0.013 },
  { key: 'imperial', name: 'Imperial topaz', color: [0.99, 0.5, 0.13], ior: 1.63, dispersion: 0.014 },
  { key: 'garnet', name: 'Hessonite garnet', color: [0.74, 0.25, 0.07], ior: 1.75, dispersion: 0.027 },
  { key: 'amethyst', name: 'Amethyst', color: [0.6, 0.28, 0.86], ior: 1.55, dispersion: 0.013 },
  { key: 'pearl', name: 'Pearl', color: [0.86, 0.82, 0.76], ior: 1.6, dispersion: 0, cabochon: true }
]

const T = Object.fromEntries(GEM_TYPES.map((g, i) => [g.key, i])) as Record<string, number>

// What kind of place a stone covers.
export const BIOMES = ['deep ocean', 'shallow sea', 'ice', 'forest', 'grassland', 'desert', 'highland', 'city'] as const
const DEEP = 0; const SHALLOW = 1; const ICE = 2; const FOREST = 3; const GRASS = 4; const DESERT = 5; const ROCK = 6; const CITY = 7

type Mix = [string, number][]

// A palette says which stones each kind of place is set with, and in what proportions.
export const PALETTES: Record<string, { name: string, mix: Mix[] }> = {
  earth: {
    name: 'Earth',
    mix: [
      [['sapphire', 0.84], ['tanzanite', 0.16]],
      [['aquamarine', 0.5], ['topaz', 0.42], ['pearl', 0.08]],
      [['diamond', 0.72], ['pearl', 0.28]],
      [['emerald', 0.75], ['tsavorite', 0.25]],
      [['peridot', 0.7], ['tsavorite', 0.3]],
      [['citrine', 0.6], ['imperial', 0.4]],
      [['garnet', 0.55], ['imperial', 0.25], ['citrine', 0.2]],
      [['ruby', 1]]
    ]
  },
  rubies: {
    name: 'Rubies and pearls',
    mix: [
      [['ruby', 1]], [['ruby', 0.8], ['garnet', 0.2]], [['pearl', 0.7], ['diamond', 0.3]],
      [['pearl', 0.75], ['diamond', 0.25]], [['pearl', 0.75], ['diamond', 0.25]], [['pearl', 0.6], ['diamond', 0.4]],
      [['pearl', 0.6], ['diamond', 0.4]], [['diamond', 1]]
    ]
  },
  ice: {
    name: 'Diamonds and sapphires',
    mix: [
      [['sapphire', 1]], [['topaz', 0.6], ['sapphire', 0.4]], [['diamond', 1]], [['diamond', 1]],
      [['diamond', 1]], [['diamond', 1]], [['diamond', 1]], [['ruby', 1]]
    ]
  },
  treasure: {
    name: 'Treasure chest',
    mix: Array.from({ length: 8 }, () => GEM_TYPES.map(g => [g.key, g.cabochon ? 0.6 : 1] as [string, number]))
  }
}

function pick (mix: Mix, r: number): number {
  let total = 0
  for (const m of mix) { total += m[1] }
  let x = r * total
  for (const m of mix) {
    x -= m[1]
    if (x <= 0) { return T[m[0]]! }
  }
  return T[mix[mix.length - 1]![0]]!
}

// ---------------------------------------------------------------- the Earth

// Large cities, [latitude, longitude]. Each one is set with a single small ruby.
export const CITIES: [number, number][] = [
  [35.68, 139.69], [28.61, 77.21], [31.23, 121.47], [-23.55, -46.63], [19.43, -99.13], [30.04, 31.24],
  [19.08, 72.88], [39.9, 116.4], [23.81, 90.41], [34.69, 135.5], [40.71, -74.01], [24.86, 67.01],
  [-34.6, -58.38], [29.56, 106.55], [41.01, 28.98], [22.57, 88.36], [14.6, 120.98], [6.52, 3.38],
  [-22.91, -43.17], [39.13, 117.2], [-4.33, 15.31], [23.13, 113.26], [34.05, -118.24], [55.76, 37.62],
  [22.54, 114.06], [31.55, 74.34], [12.97, 77.59], [48.86, 2.35], [4.71, -74.07], [-6.21, 106.85],
  [13.08, 80.27], [-12.05, -77.04], [13.76, 100.5], [37.57, 126.98], [35.18, 136.91], [17.39, 78.49],
  [51.51, -0.13], [35.69, 51.39], [41.88, -87.63], [30.57, 104.07], [32.06, 118.8], [30.59, 114.31],
  [10.82, 106.63], [-8.84, 13.23], [23.02, 72.57], [3.14, 101.69], [34.26, 108.94], [22.32, 114.17],
  [24.71, 46.68], [33.31, 44.37], [-33.45, -70.67], [40.42, -3.7], [43.65, -79.38], [-6.79, 39.21],
  [1.35, 103.82], [15.5, 32.56], [-26.2, 28.05], [59.93, 30.34], [5.36, -4.01], [31.2, 29.92],
  [-37.81, 144.96], [-33.87, 151.21], [52.52, 13.4], [41.9, 12.5], [50.45, 30.52], [25.2, 55.27],
  [33.59, -7.62], [-1.29, 36.82], [9.03, 38.74], [36.75, 3.06], [14.69, -17.45], [5.6, -0.19],
  [-33.92, 18.42], [-25.97, 32.57], [-18.88, 47.51], [12.0, 8.52], [29.76, -95.37], [25.76, -80.19],
  [47.61, -122.33], [37.77, -122.42], [45.5, -73.57], [49.28, -123.12], [33.75, -84.39], [39.74, -104.99],
  [61.22, -149.9], [21.31, -157.86], [10.49, -66.88], [-0.18, -78.47], [-16.5, -68.15], [-15.79, -47.88],
  [-3.12, -60.02], [-12.97, -38.5], [-34.9, -56.16], [64.15, -21.94], [59.33, 18.07], [60.17, 24.94],
  [52.23, 21.01], [47.5, 19.04], [37.98, 23.73], [38.72, -9.14], [41.3, 69.24], [43.24, 76.89],
  [55.03, 82.92], [56.84, 60.61], [43.12, 131.89], [47.92, 106.92], [27.72, 85.32], [6.93, 79.85],
  [16.84, 96.17], [21.03, 105.85], [25.03, 121.57], [-31.95, 115.86], [-36.85, 174.76], [-41.29, 174.78],
  [-9.44, 147.18], [64.84, -147.72], [69.65, 18.96], [62.03, 129.73]
]

export interface EarthSample { r: number, g: number, b: number, water: boolean }
export type EarthSampler = (lat: number, lon: number) => EarthSample

// Build a sampler from two equirectangular RGBA images: a colour map and a water mask.
export function makeEarthSampler (
  color: ArrayLike<number>, cw: number, ch: number,
  water: ArrayLike<number>, ww: number, wh: number
): EarthSampler {
  return (lat, lon) => {
    const u = ((lon + 180) / 360 % 1 + 1) % 1
    const v = Math.min(0.9999, Math.max(0, (90 - lat) / 180))
    const ci = (Math.floor(v * ch) * cw + Math.floor(u * cw)) * 4
    const wi = (Math.floor(v * wh) * ww + Math.floor(u * ww)) * 4
    return { r: color[ci]!, g: color[ci + 1]!, b: color[ci + 2]!, water: water[wi]! > 127 }
  }
}

export function classify (s: EarthSample, lat: number): number {
  const lum = (s.r + s.g + s.b) / 3
  const lo = Math.min(s.r, s.g, s.b)
  const hi = Math.max(s.r, s.g, s.b)
  const white = lum > 150 && hi - lo < 60
  if (lat < -62 && (!s.water || white)) { return ICE }
  if (s.water) {
    if (white && Math.abs(lat) > 55) { return ICE }
    return s.g > 62 || lum > 70 ? SHALLOW : DEEP
  }
  if (white || (lum > 125 && hi - lo < 40 && Math.abs(lat) > 58)) { return ICE }
  if (s.g >= s.r * 0.98) { return lum < 72 ? FOREST : GRASS }
  if (lum > 118) { return DESERT }
  return s.g > s.r * 0.86 ? GRASS : ROCK
}

// ---------------------------------------------------------------- vector helpers

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

export function latLonToVec (lat: number, lon: number): Vec3 {
  const p = lat * Math.PI / 180
  const l = lon * Math.PI / 180
  // +Y is north; longitude 0 faces +Z so the texture seam sits at the back.
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)]
}

export function vecToLatLon (v: Vec3): [number, number] {
  return [Math.asin(Math.max(-1, Math.min(1, v[1]))) * 180 / Math.PI, Math.atan2(v[0], v[2]) * 180 / Math.PI]
}

function tangentFrame (c: Vec3, spin: number): [Vec3, Vec3] {
  const up: Vec3 = Math.abs(c[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
  const a = norm(cross(up, c))
  const b = cross(c, a)
  const cs = Math.cos(spin); const sn = Math.sin(spin)
  return [
    [a[0] * cs + b[0] * sn, a[1] * cs + b[1] * sn, a[2] * cs + b[2] * sn],
    [b[0] * cs - a[0] * sn, b[1] * cs - a[1] * sn, b[2] * cs - a[2] * sn]
  ]
}

// ---------------------------------------------------------------- spatial hash on the sphere

class Grid {
  private cells = new Map<number, number[]>()
  private h: number
  private pts: Vec3[]
  constructor (pts: Vec3[], h: number) { this.h = h; this.pts = pts }
  private key (i: number, j: number, k: number) { return (i + 512) * 1048576 + (j + 512) * 1024 + (k + 512) }
  add (index: number) {
    const p = this.pts[index]!
    const key = this.key(Math.floor(p[0] / this.h), Math.floor(p[1] / this.h), Math.floor(p[2] / this.h))
    const cell = this.cells.get(key)
    if (cell) { cell.push(index) } else { this.cells.set(key, [index]) }
  }

  // Every stored point within chord distance `radius` of p.
  query (p: Vec3, radius: number, out: number[]) {
    out.length = 0
    const h = this.h
    const r2 = radius * radius
    const i0 = Math.floor((p[0] - radius) / h); const i1 = Math.floor((p[0] + radius) / h)
    const j0 = Math.floor((p[1] - radius) / h); const j1 = Math.floor((p[1] + radius) / h)
    const k0 = Math.floor((p[2] - radius) / h); const k1 = Math.floor((p[2] + radius) / h)
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        for (let k = k0; k <= k1; k++) {
          const cell = this.cells.get(this.key(i, j, k))
          if (!cell) { continue }
          for (const n of cell) {
            const q = this.pts[n]!
            const dx = q[0] - p[0]; const dy = q[1] - p[1]; const dz = q[2] - p[2]
            if (dx * dx + dy * dy + dz * dz <= r2) { out.push(n) }
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------- convex clipping

// Clip a convex polygon (flat [u, v, ...]) to a*u + b*v + c >= 0. `labels[k]` names the
// neighbour that owns the edge leaving vertex k, so afterwards we know who each side touches.
function clip2D (poly: number[], labels: number[], a: number, b: number, c: number, label: number): boolean {
  const n = poly.length / 2
  let anyOut = false
  const side: number[] = new Array(n)
  for (let k = 0; k < n; k++) {
    side[k] = a * poly[2 * k]! + b * poly[2 * k + 1]! + c
    if (side[k]! < 0) { anyOut = true }
  }
  if (!anyOut) { return false }
  const out: number[] = []
  const outLabels: number[] = []
  for (let k = 0; k < n; k++) {
    const m = (k + 1) % n
    const sk = side[k]!; const sm = side[m]!
    if (sk >= 0) {
      out.push(poly[2 * k]!, poly[2 * k + 1]!)
      outLabels.push(labels[k]!)
      if (sm < 0) {
        const t = sk / (sk - sm)
        out.push(poly[2 * k]! + t * (poly[2 * m]! - poly[2 * k]!), poly[2 * k + 1]! + t * (poly[2 * m + 1]! - poly[2 * k + 1]!))
        outLabels.push(label)
      }
    } else if (sm >= 0) {
      const t = sk / (sk - sm)
      out.push(poly[2 * k]! + t * (poly[2 * m]! - poly[2 * k]!), poly[2 * k + 1]! + t * (poly[2 * m + 1]! - poly[2 * k + 1]!))
      outLabels.push(labels[k]!)
    }
  }
  poly.length = 0; labels.length = 0
  for (const x of out) { poly.push(x) }
  for (const x of outLabels) { labels.push(x) }
  return true
}

interface Face { plane: number, pts: number[] }

// Keep the part of a convex solid where n.p <= d. The cut leaves a new face on the plane.
function clipSolid (faces: Face[], nx: number, ny: number, nz: number, d: number, plane: number, eps: number): Face[] {
  const result: Face[] = []
  const cut: number[] = []
  let touched = false
  for (const face of faces) {
    const p = face.pts
    const n = p.length / 3
    const side: number[] = new Array(n)
    let out = 0
    for (let k = 0; k < n; k++) {
      side[k] = nx * p[3 * k]! + ny * p[3 * k + 1]! + nz * p[3 * k + 2]! - d
      if (side[k]! > eps) { out++ }
    }
    if (out === 0) { result.push(face); continue }
    touched = true
    if (out === n) { continue }
    const q: number[] = []
    for (let k = 0; k < n; k++) {
      const m = (k + 1) % n
      const sk = side[k]!; const sm = side[m]!
      const kin = sk <= eps; const min = sm <= eps
      if (kin) { q.push(p[3 * k]!, p[3 * k + 1]!, p[3 * k + 2]!) }
      if (kin !== min) {
        const t = sk / (sk - sm)
        const x = p[3 * k]! + t * (p[3 * m]! - p[3 * k]!)
        const y = p[3 * k + 1]! + t * (p[3 * m + 1]! - p[3 * k + 1]!)
        const z = p[3 * k + 2]! + t * (p[3 * m + 2]! - p[3 * k + 2]!)
        q.push(x, y, z)
        cut.push(x, y, z)
      }
    }
    if (q.length >= 9) { result.push({ plane: face.plane, pts: q }) }
  }
  if (!touched) { return faces }
  // Order the cut points into the new face, counter-clockwise seen from outside.
  const pts: Vec3[] = []
  for (let k = 0; k < cut.length; k += 3) {
    const c: Vec3 = [cut[k]!, cut[k + 1]!, cut[k + 2]!]
    if (!pts.some(o => Math.abs(o[0] - c[0]) + Math.abs(o[1] - c[1]) + Math.abs(o[2] - c[2]) < eps * 4)) { pts.push(c) }
  }
  if (pts.length >= 3) {
    const centre: Vec3 = [0, 0, 0]
    for (const c of pts) { centre[0] += c[0] / pts.length; centre[1] += c[1] / pts.length; centre[2] += c[2] / pts.length }
    const nrm: Vec3 = [nx, ny, nz]
    const ax = norm(cross(Math.abs(nx) < 0.8 ? [1, 0, 0] : [0, 1, 0], nrm))
    const ay = cross(nrm, ax)
    const angle = (c: Vec3) => {
      const r: Vec3 = [c[0] - centre[0], c[1] - centre[1], c[2] - centre[2]]
      return Math.atan2(dot(r, ay), dot(r, ax))
    }
    pts.sort((a, b) => angle(a) - angle(b))
    const flat: number[] = []
    for (const c of pts) { flat.push(c[0], c[1], c[2]) }
    result.push({ plane, pts: flat })
  }
  return result
}

// ---------------------------------------------------------------- layout

export interface LayoutOptions {
  // Roughly how many stones cover the globe.
  count: number
  seed: number
  // 0 = all about the same size, 1 = a wide mix of large and small.
  variety: number
  // Space between neighbouring stones, as a fraction of a typical stone's width.
  gap: number
  // How tall the stones stand, as a fraction of their half-width.
  height: number
  // 0 = crisp symmetric cuts, 1 = rough, uneven, hand-cut stones.
  irregularity: number
  palette: string
}

export const DEFAULT_LAYOUT: LayoutOptions = {
  count: 1800, seed: 7, variety: 0.55, gap: 0.03, height: 0.8, irregularity: 0.35, palette: 'earth'
}

export interface Gem {
  type: number
  biome: number
  // Unit vector from the globe's centre to the middle of the stone's base.
  center: Vec3
  // Radius of the largest circle that fits in the base, and how tall the stone stands.
  inradius: number
  height: number
  // Faceted stones: planes as [nx, ny, nz, d] with the stone on the side n.p <= d.
  // Plane 0 is always the flat base that rests on the orb.
  planes: number[]
  faces: Face[]
  // Pearls: centre and three scaled axes of an ellipsoid.
  ellipsoid?: { c: Vec3, ax: Vec3, ay: Vec3, az: Vec3 }
  // Indices of the stones this one shares a wall with.
  neighbours: number[]
}

export interface Layout {
  options: LayoutOptions
  gems: Gem[]
  // Typical stone half-width; the shader scales colour absorption by it.
  scale: number
  maxPlanes: number
}

export const MAX_PLANES = 40

export function generateLayout (options: LayoutOptions, earth: EarthSampler | null): Layout {
  const rng = mulberry32(options.seed * 7919 + 13)
  const count = Math.max(40, Math.min(6000, Math.round(options.count)))
  const variety = Math.max(0, Math.min(1, options.variety))
  // Angular radius of an average stone, tuned so the dart throwing below lands near `count`.
  const rho0 = Math.sqrt(1.6 / count)
  const palette = (PALETTES[options.palette] || PALETTES.earth!).mix

  const biomeAt = (c: Vec3): number => {
    if (!earth) { return Math.floor(rng() * 7) }
    const [lat, lon] = vecToLatLon(c)
    return classify(earth(lat, lon), lat)
  }

  // ---- 1. Throw darts. Each site is a spherical cap; caps may touch but not overlap.
  const sites: Vec3[] = []
  const radii: number[] = []
  const biomes: number[] = []
  const pinned: boolean[] = []
  const hmax = rho0 * (1 + variety) * 1.3
  const grid = new Grid(sites, hmax * 2)
  const near: number[] = []
  const fits = (c: Vec3, r: number) => {
    grid.query(c, r + hmax, near)
    for (const j of near) {
      const q = sites[j]!
      const reach = r + radii[j]!
      const dx = q[0] - c[0]; const dy = q[1] - c[1]; const dz = q[2] - c[2]
      if (dx * dx + dy * dy + dz * dz < reach * reach) { return false }
    }
    return true
  }
  const place = (c: Vec3, r: number, biome: number, pin: boolean) => {
    sites.push(c); radii.push(r); biomes.push(biome); pinned.push(pin)
    grid.add(sites.length - 1)
  }

  if (earth && count >= 300) {
    for (const [lat, lon] of CITIES) {
      const c = latLonToVec(lat, lon)
      // Checked at full size so two rubies never sit side by side, stored small so they stay small.
      if (fits(c, rho0 * 1.15)) { place(c, rho0 * 0.6, CITY, true) }
    }
  }
  // Largest stones first, then smaller ones into the spaces left over.
  const levels = 14
  for (let level = 0; level < levels && sites.length < count * 1.25; level++) {
    const f = level / (levels - 1)
    const m = (1 + 0.85 * variety) * Math.pow((1 - 0.5 * variety) / (1 + 0.85 * variety), f)
    let misses = 0
    const patience = 60 + count * 0.5
    while (misses < patience && sites.length < count * 1.25) {
      const z = rng() * 2 - 1
      const a = rng() * Math.PI * 2
      const s = Math.sqrt(1 - z * z)
      const c: Vec3 = [s * Math.cos(a), z, s * Math.sin(a)]
      const biome = biomeAt(c)
      // Land carries more detail than open water, so it gets smaller stones.
      const local = earth ? (biome === DEEP ? 1.22 : biome === SHALLOW ? 0.95 : 0.8) : 1
      const r = rho0 * m * local * (1 + (rng() - 0.5) * 0.3 * variety)
      if (fits(c, r)) { place(c, r, biome, false); misses = 0 } else { misses++ }
    }
  }

  const n = sites.length
  const frames: [Vec3, Vec3][] = sites.map(c => tangentFrame(c, rng() * Math.PI * 2))

  // ---- 2. Power cells. With a_i = c_i / cos(rho_i), the boundary between two stones is the
  // plane x.(a_i - a_j) = 0 through the centre of the globe, so every cell is a convex cone
  // and, projected on its own tangent plane, a convex polygon.
  const cellPoly: number[][] = new Array(n)
  const cellLabels: number[][] = new Array(n)
  const weighted = (i: number): Vec3 => {
    const k = 1 / Math.cos(radii[i]!)
    const c = sites[i]!
    return [c[0] * k, c[1] * k, c[2] * k]
  }
  const computeCells = () => {
    const g = new Grid(sites, hmax * 2)
    for (let i = 0; i < n; i++) { g.add(i) }
    const found: number[] = []
    for (let i = 0; i < n; i++) {
      const c = sites[i]!
      const [e1, e2] = frames[i]!
      const ai = weighted(i)
      let reach = hmax * 3
      for (;;) {
        const big = Math.min(reach, 1.2)
        const poly = [-big, -big, big, -big, big, big, -big, big]
        const labels = [-1, -1, -1, -1]
        g.query(c, reach, found)
        for (const j of found) {
          if (j === i) { continue }
          const aj = weighted(j)
          const b: Vec3 = [ai[0] - aj[0], ai[1] - aj[1], ai[2] - aj[2]]
          clip2D(poly, labels, dot(b, e1), dot(b, e2), dot(b, c), j)
          if (poly.length < 6) { break }
        }
        let far = 0
        for (let k = 0; k < poly.length; k += 2) { far = Math.max(far, Math.hypot(poly[k]!, poly[k + 1]!)) }
        // A site further than about twice the cell's extent cannot cut it. Widen until that holds.
        if (far * 2.3 + hmax < reach || reach > 2.5 || poly.length < 6) {
          cellPoly[i] = poly; cellLabels[i] = labels
          break
        }
        reach *= 1.8
      }
    }
  }

  // Two rounds of Lloyd relaxation: nudge each site towards the middle of its cell. This
  // removes slivers while leaving the sizes and shapes uneven.
  for (let round = 0; round < 2; round++) {
    computeCells()
    for (let i = 0; i < n; i++) {
      if (pinned[i]) { continue }
      const poly = cellPoly[i]!
      if (poly.length < 6) { continue }
      let area = 0; let cu = 0; let cv = 0
      for (let k = 0; k < poly.length; k += 2) {
        const m = (k + 2) % poly.length
        const w = poly[k]! * poly[m + 1]! - poly[m]! * poly[k + 1]!
        area += w; cu += (poly[k]! + poly[m]!) * w; cv += (poly[k + 1]! + poly[m + 1]!) * w
      }
      if (Math.abs(area) < 1e-12) { continue }
      cu /= 3 * area; cv /= 3 * area
      const c = sites[i]!; const [e1, e2] = frames[i]!
      const k = 0.7
      sites[i] = norm([c[0] + k * (cu * e1[0] + cv * e2[0]), c[1] + k * (cu * e1[1] + cv * e2[1]), c[2] + k * (cu * e1[2] + cv * e2[2])])
      frames[i] = tangentFrame(sites[i]!, rng() * Math.PI * 2)
    }
  }
  computeCells()

  // ---- 3. Cut one stone inside each cell.
  const gap = Math.max(0, options.gap) * rho0 * 2
  const irr = Math.max(0, Math.min(1, options.irregularity))
  const gems: Gem[] = []
  const indexOf: number[] = new Array(n).fill(-1)

  for (let i = 0; i < n; i++) {
    const poly = cellPoly[i]!; const labels = cellLabels[i]!
    if (poly.length < 6 || labels.includes(-1)) { continue }
    const c = sites[i]!; const [e1, e2] = frames[i]!
    const ai = weighted(i)
    const eps = rho0 * 1e-6

    // Local coordinates: (u, v) on the tangent plane, w straight up out of the globe.
    // Start from a slab and cut it with one wall per neighbour. Each wall is the boundary
    // plane moved in by half the gap, so two neighbours' walls are parallel and `gap` apart.
    const top = rho0 * 6
    const B = 1.5
    let solid: Face[] = [
      { plane: 0, pts: [-B, -B, 0, -B, B, 0, B, B, 0, B, -B, 0] },
      { plane: 1, pts: [-B, -B, top, B, -B, top, B, B, top, -B, B, top] },
      { plane: -1, pts: [-B, -B, 0, B, -B, 0, B, -B, top, -B, -B, top] },
      { plane: -1, pts: [B, -B, 0, B, B, 0, B, B, top, B, -B, top] },
      { plane: -1, pts: [B, B, 0, -B, B, 0, -B, B, top, B, B, top] },
      { plane: -1, pts: [-B, B, 0, -B, -B, 0, -B, -B, top, -B, B, top] }
    ]
    // Local planes as [nx, ny, nz, d]; 0 is the base and 1 the table.
    const planes: number[][] = [[0, 0, -1, 0], [0, 0, 1, top]]
    const owner: number[] = [-1, -1]
    const seen = new Set<number>()
    for (const j of labels) {
      if (seen.has(j)) { continue }
      seen.add(j)
      const aj = weighted(j)
      const b = norm([ai[0] - aj[0], ai[1] - aj[1], ai[2] - aj[2]])
      const bc = dot(b, c)
      const pl = [-dot(b, e1), -dot(b, e2), -bc, bc - gap / 2]
      planes.push(pl); owner.push(j)
      solid = clipSolid(solid, pl[0]!, pl[1]!, pl[2]!, pl[3]!, planes.length - 1, eps)
    }
    const base = solid.find(f => f.plane === 0)
    if (!base || base.pts.length < 9 || solid.some(f => f.plane === -1)) { continue }

    // The base polygon, its centre, and the largest circle that fits around that centre.
    const bp = base.pts
    const bn = bp.length / 3
    let area = 0; let cu = 0; let cv = 0
    for (let k = 0; k < bn; k++) {
      const m = (k + 1) % bn
      const w = bp[3 * k]! * bp[3 * m + 1]! - bp[3 * m]! * bp[3 * k + 1]!
      area += w; cu += (bp[3 * k]! + bp[3 * m]!) * w; cv += (bp[3 * k + 1]! + bp[3 * m + 1]!) * w
    }
    if (Math.abs(area) < rho0 * rho0 * 0.02) { continue }
    cu /= 3 * area; cv /= 3 * area
    const orient = area < 0 ? 1 : -1 // the base faces down, so its winding is reversed
    const edges: { mx: number, my: number, dist: number, px: number, py: number }[] = []
    let inradius = Infinity
    for (let k = 0; k < bn; k++) {
      const m = (k + 1) % bn
      const ex = bp[3 * m]! - bp[3 * k]!; const ey = bp[3 * m + 1]! - bp[3 * k + 1]!
      const len = Math.hypot(ex, ey)
      if (len < eps * 10) { continue }
      const mx = orient * -ey / len; const my = orient * ex / len
      const px = (bp[3 * k]! + bp[3 * m]!) / 2; const py = (bp[3 * k + 1]! + bp[3 * m + 1]!) / 2
      const dist = (px - cu) * mx + (py - cv) * my
      inradius = Math.min(inradius, dist)
      edges.push({ mx, my, dist, px, py })
    }
    if (!(inradius > rho0 * 0.05)) { continue }

    const biome = biomes[i]!
    const type = pick(palette[biome]!, rng())
    const spec = GEM_TYPES[type]!
    const toWorld = (u: number, v: number, w: number): Vec3 => [
      c[0] * (1 + w) + u * e1[0] + v * e2[0],
      c[1] * (1 + w) + u * e1[1] + v * e2[1],
      c[2] * (1 + w) + u * e1[2] + v * e2[2]
    ]
    const neighbours = [...seen]

    if (spec.cabochon) {
      // A pearl: the largest ellipse that fits the base, along the base's long axis,
      // grown into an ellipsoid resting on the orb.
      let sxx = 0; let syy = 0; let sxy = 0
      for (let k = 0; k < bn; k++) {
        const x = bp[3 * k]! - cu; const y = bp[3 * k + 1]! - cv
        sxx += x * x; syy += y * y; sxy += x * y
      }
      const phi = 0.5 * Math.atan2(2 * sxy, sxx - syy)
      const l1 = (sxx + syy) / 2 + Math.hypot((sxx - syy) / 2, sxy)
      const l2 = Math.max(1e-12, (sxx + syy) / 2 - Math.hypot((sxx - syy) / 2, sxy))
      const ratio = Math.min(1.45, Math.sqrt(l1 / l2))
      const cs = Math.cos(phi); const sn = Math.sin(phi)
      let s = Infinity
      for (const e of edges) {
        const na = e.mx * cs + e.my * sn; const nb = -e.mx * sn + e.my * cs
        s = Math.min(s, e.dist / Math.hypot(ratio * na, nb))
      }
      const a = s * ratio; const b = s
      const rz = b * (0.72 + 0.2 * rng())
      const o = toWorld(cu, cv, rz)
      const ax = toWorld(cu + a * cs, cv + a * sn, rz)
      const ay = toWorld(cu - b * sn, cv + b * cs, rz)
      gems.push({
        type, biome, center: c, inradius, height: rz * 2, planes: [], faces: [], neighbours,
        ellipsoid: {
          c: o,
          ax: [ax[0] - o[0], ax[1] - o[1], ax[2] - o[2]],
          ay: [ay[0] - o[0], ay[1] - o[1], ay[2] - o[2]],
          az: [c[0] * rz, c[1] * rz, c[2] * rz]
        }
      })
      indexOf[i] = gems.length - 1
      continue
    }

    // Faceted stone. Flat base, a short girdle, then a crown of sloping facets up to a table.
    const H = Math.min(inradius * 1.5, inradius * options.height * (0.85 + 0.4 * rng()))
    const girdle = H * (0.14 + 0.16 * rng())
    const table = 0.36 + 0.3 * rng()
    const stepCut = rng() < 0.28
    const cutPlane = (pl: number[]) => {
      planes.push(pl); owner.push(-1)
      solid = clipSolid(solid, pl[0]!, pl[1]!, pl[2]!, pl[3]!, planes.length - 1, eps)
    }
    const jitter = () => (rng() - 0.5) * 0.5 * irr
    const facet = (mx: number, my: number, rise: number, run: number, px: number, py: number, pz: number) => {
      const nrm = norm([mx * rise + jitter() * rise, my * rise + jitter() * rise, run])
      cutPlane([nrm[0], nrm[1], nrm[2], nrm[0] * px + nrm[1] * py + nrm[2] * pz])
    }
    planes[1] = [0, 0, 1, H]
    solid = clipSolid(solid, 0, 0, 1, H, 1, eps)

    const slopes: number[] = []
    for (const e of edges) {
      const inset = (1 - table) * inradius * (0.8 + 0.4 * rng())
      const g = girdle * (1 + jitter())
      slopes.push((H - g) / inset)
      if (stepCut) {
        // Two tiers: steep near the girdle, shallow near the table.
        const mid = g + (H - g) * 0.55
        facet(e.mx, e.my, (mid - g) * 2.6, inset, e.px, e.py, g)
        facet(e.mx, e.my, H - mid, inset * 0.72, e.px - e.mx * inset * 0.28, e.py - e.my * inset * 0.28, mid)
      } else {
        facet(e.mx, e.my, H - g, inset, e.px, e.py, g)
      }
    }
    if (!stepCut && planes.length + edges.length <= MAX_PLANES) {
      // Star facets: one across each corner, shallower than the ridge it removes.
      for (let k = 0; k < bn; k++) {
        const x = bp[3 * k]! - cu; const y = bp[3 * k + 1]! - cv
        const r = Math.hypot(x, y)
        if (r < eps) { continue }
        const slope = slopes[k % slopes.length]! * (0.5 + 0.3 * rng()) * (inradius / r)
        facet(x / r, y / r, slope, 1, bp[3 * k]!, bp[3 * k + 1]!, girdle * (0.5 + 0.5 * rng()))
      }
    }
    // Rough stones get a few extra cuts at odd angles.
    const extra = Math.floor(irr * 4 * rng())
    for (let k = 0; k < extra && planes.length < MAX_PLANES; k++) {
      const a = rng() * Math.PI * 2
      const tilt = 0.25 + 0.6 * rng()
      const nrm = norm([Math.cos(a) * tilt, Math.sin(a) * tilt, 1])
      const reach = inradius * (0.35 + 0.4 * rng())
      cutPlane([nrm[0], nrm[1], nrm[2], nrm[0] * (cu + Math.cos(a) * reach) + nrm[1] * (cv + Math.sin(a) * reach) + nrm[2] * H * (0.75 + 0.2 * rng())])
    }

    // Drop planes that no longer bound the stone, renumber the rest, move to globe coordinates.
    const used = new Map<number, number>()
    const outPlanes: number[] = []
    const outFaces: Face[] = []
    solid.sort((a, b) => a.plane - b.plane)
    if (solid.length < 4 || solid[0]!.plane !== 0) { continue }
    const wallNeighbours: number[] = []
    for (const f of solid) {
      if (f.pts.length < 9) { continue }
      let id = used.get(f.plane)
      if (id === undefined) {
        id = used.size
        used.set(f.plane, id)
        const pl = planes[f.plane]!
        const wn: Vec3 = [
          pl[0]! * e1[0] + pl[1]! * e2[0] + pl[2]! * c[0],
          pl[0]! * e1[1] + pl[1]! * e2[1] + pl[2]! * c[1],
          pl[0]! * e1[2] + pl[1]! * e2[2] + pl[2]! * c[2]
        ]
        outPlanes.push(wn[0], wn[1], wn[2], pl[3]! + dot(wn, c))
        if (owner[f.plane]! >= 0) { wallNeighbours.push(owner[f.plane]!) }
      }
      const pts: number[] = []
      for (let k = 0; k < f.pts.length; k += 3) {
        const p = toWorld(f.pts[k]!, f.pts[k + 1]!, f.pts[k + 2]!)
        pts.push(p[0], p[1], p[2])
      }
      // Make every face wind counter-clockwise seen from outside.
      const pn: Vec3 = [outPlanes[id * 4]!, outPlanes[id * 4 + 1]!, outPlanes[id * 4 + 2]!]
      const a: Vec3 = [pts[3]! - pts[0]!, pts[4]! - pts[1]!, pts[5]! - pts[2]!]
      const b: Vec3 = [pts[6]! - pts[0]!, pts[7]! - pts[1]!, pts[8]! - pts[2]!]
      if (dot(cross(a, b), pn) < 0) {
        const rev: number[] = []
        for (let k = pts.length - 3; k >= 0; k -= 3) { rev.push(pts[k]!, pts[k + 1]!, pts[k + 2]!) }
        outFaces.push({ plane: id, pts: rev })
      } else {
        outFaces.push({ plane: id, pts })
      }
    }
    if (used.size > MAX_PLANES) { continue }
    gems.push({ type, biome, center: c, inradius, height: H, planes: outPlanes, faces: outFaces, neighbours: wallNeighbours })
    indexOf[i] = gems.length - 1
  }

  // Neighbour lists were written with site numbers; switch them to gem numbers.
  for (const g of gems) {
    g.neighbours = g.neighbours.map(j => indexOf[j]!).filter(j => j >= 0)
  }
  let maxPlanes = 0
  for (const g of gems) { maxPlanes = Math.max(maxPlanes, g.planes.length / 4) }
  return { options, gems, scale: rho0, maxPlanes }
}

// ---------------------------------------------------------------- checking the result

export interface LayoutReport {
  gems: number
  byType: Record<string, number>
  pairsChecked: number
  // Deepest any stone reaches into a neighbour (should be 0) and into the orb (should be 0).
  worstOverlap: number
  worstSink: number
  // Narrowest and widest space between two neighbouring walls.
  minClearance: number
  // Tallest stone relative to its own width; below 1 means every stone lies on its widest face.
  tallest: number
  meanFacets: number
}

function gemVertices (g: Gem): number[] {
  if (!g.ellipsoid) {
    const out: number[] = []
    for (const f of g.faces) { for (const x of f.pts) { out.push(x) } }
    return out
  }
  // Sample the pearl's surface.
  const { c, ax, ay, az } = g.ellipsoid
  const out: number[] = []
  for (let i = 0; i <= 8; i++) {
    const th = Math.PI * i / 8
    for (let j = 0; j < 16; j++) {
      const ph = Math.PI * 2 * j / 16
      const x = Math.sin(th) * Math.cos(ph); const y = Math.sin(th) * Math.sin(ph); const z = Math.cos(th)
      out.push(c[0] + ax[0] * x + ay[0] * y + az[0] * z, c[1] + ax[1] * x + ay[1] * y + az[1] * z, c[2] + ax[2] * x + ay[2] * y + az[2] * z)
    }
  }
  return out
}

// Measure, rather than assume, that no two stones intersect. Two convex solids are disjoint
// when some plane has one entirely on each side; for neighbours we look for that plane among
// the faces of either stone and record how far the other one clears it.
export function verifyLayout (layout: Layout): LayoutReport {
  const { gems } = layout
  const verts = gems.map(gemVertices)
  const report: LayoutReport = {
    gems: gems.length, byType: {}, pairsChecked: 0, worstOverlap: 0, worstSink: 0, minClearance: Infinity, tallest: 0, meanFacets: 0
  }
  let facets = 0; let faceted = 0
  const separation = (a: number, b: number): number => {
    // Largest distance by which all of b's vertices sit outside one of a's planes.
    const p = gems[a]!.planes
    const v = verts[b]!
    let best = -Infinity
    for (let k = 0; k < p.length; k += 4) {
      let least = Infinity
      for (let m = 0; m < v.length; m += 3) {
        least = Math.min(least, p[k]! * v[m]! + p[k + 1]! * v[m + 1]! + p[k + 2]! * v[m + 2]! - p[k + 3]!)
      }
      best = Math.max(best, least)
    }
    return best
  }
  gems.forEach((g, i) => {
    const name = GEM_TYPES[g.type]!.key
    report.byType[name] = (report.byType[name] || 0) + 1
    report.tallest = Math.max(report.tallest, g.height / (2 * g.inradius))
    if (!g.ellipsoid) { facets += g.planes.length / 4; faceted++ }
    const v = verts[i]!
    for (let m = 0; m < v.length; m += 3) {
      report.worstSink = Math.max(report.worstSink, 1 - Math.hypot(v[m]!, v[m + 1]!, v[m + 2]!))
    }
    for (const j of g.neighbours) {
      if (j <= i) { continue }
      const sep = Math.max(separation(i, j), separation(j, i))
      if (sep === -Infinity) { continue } // two pearls: checked through their cells' walls instead
      report.pairsChecked++
      report.worstOverlap = Math.max(report.worstOverlap, -sep)
      report.minClearance = Math.min(report.minClearance, sep)
    }
  })
  report.meanFacets = faceted ? facets / faceted : 0
  return report
}
