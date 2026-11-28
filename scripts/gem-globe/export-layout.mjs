// Runs the same layout code as the web page, checks it, and writes it out for Blender.
//
//   node --experimental-strip-types scripts/gem-globe/export-layout.mjs [--count 1800] [--seed 7]
//        [--variety 0.55] [--gap 0.03] [--height 0.8] [--irregularity 0.35] [--palette earth]
//        [--out /tmp/gem-globe/layout.json] [--map /tmp/gem-globe/map.svg]
//
// The JSON holds, for every stone, its type and its faces as polygons on a unit globe.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  DEFAULT_LAYOUT, GEM_TYPES, generateLayout, makeEarthSampler, vecToLatLon, verifyLayout
} from '../../app/utils/gemGlobe/layout.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}

const options = { ...DEFAULT_LAYOUT }
for (const key of ['count', 'seed', 'variety', 'gap', 'height', 'irregularity']) {
  options[key] = Number(arg(key, options[key]))
}
options.palette = arg('palette', options.palette)
const out = arg('out', '/tmp/gem-globe/layout.json')
const map = arg('map', '')

const load = async (file) => {
  const { data, info } = await sharp(resolve(root, 'public/static/gem-globe', file))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}
const color = await load('earth-color.jpg')
const water = await load('earth-water.png')
const earth = makeEarthSampler(color.data, color.width, color.height, water.data, water.width, water.height)

const started = performance.now()
const layout = generateLayout(options, earth)
const elapsed = performance.now() - started
const report = verifyLayout(layout)
console.log(`layout in ${elapsed.toFixed(0)} ms`)
console.log(report)

const round = x => Math.round(x * 1e6) / 1e6
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({
  options,
  scale: round(layout.scale),
  types: GEM_TYPES,
  report,
  gems: layout.gems.map(g => ({
    type: GEM_TYPES[g.type].key,
    center: g.center.map(round),
    faces: g.faces.map(f => f.pts.map(round)),
    ellipsoid: g.ellipsoid
      ? { c: g.ellipsoid.c.map(round), ax: g.ellipsoid.ax.map(round), ay: g.ellipsoid.ay.map(round), az: g.ellipsoid.az.map(round) }
      : undefined
  }))
}))
console.log(`wrote ${out}`)

if (map) {
  // A flat map of the stones: each base polygon, in its stone's colour.
  const W = 1600; const H = 800
  const hex = c => '#' + c.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('')
  const shapes = []
  for (const g of layout.gems) {
    const fill = hex(GEM_TYPES[g.type].color)
    let pts = []
    if (g.ellipsoid) {
      const { c, ax, ay } = g.ellipsoid
      for (let k = 0; k < 16; k++) {
        const a = k / 16 * Math.PI * 2
        pts.push([0, 1, 2].map(i => c[i] + ax[i] * Math.cos(a) + ay[i] * Math.sin(a)))
      }
    } else {
      const p = g.faces[0].pts
      for (let k = 0; k < p.length; k += 3) { pts.push([p[k], p[k + 1], p[k + 2]]) }
    }
    pts = pts.map((p) => {
      const l = Math.hypot(...p)
      return vecToLatLon(p.map(v => v / l))
    })
    const lons = pts.map(p => p[1])
    if (Math.max(...lons) - Math.min(...lons) > 180 || pts.some(p => Math.abs(p[0]) > 86)) { continue }
    const d = pts.map(([lat, lon]) => `${((lon + 180) / 360 * W).toFixed(1)},${((90 - lat) / 180 * H).toFixed(1)}`).join(' ')
    shapes.push(`<polygon points="${d}" fill="${fill}"/>`)
  }
  writeFileSync(map, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#14110f"/>${shapes.join('')}</svg>`)
  console.log(`wrote ${map}`)
}
