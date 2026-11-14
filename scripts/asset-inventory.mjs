// Inventory of public/static (#32): what is there, how big it is, which
// article uses it, and what nothing references.
//
//   node scripts/asset-inventory.mjs            # markdown report on stdout
//   node scripts/asset-inventory.mjs --json     # machine-readable
//
// A file counts as referenced when its /static/... path appears in content,
// app code, nuxt.config or public/*.xml, or when it sits in a folder whose
// .html page is referenced (static demo pages load their siblings relatively).
// Read-only: it never moves or deletes anything.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, dirname, extname } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const STATIC = join(ROOT, 'public/static')
const IMAGE = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])
const BIG = 2 * 1024 * 1024 // 2 MiB
const WIDE = 2400 // px; @nuxt/image serves cards at 400px and articles at ~800px

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])

const files = walk(STATIC).map(abs => ({
  path: '/' + relative(join(ROOT, 'public'), abs).split('\\').join('/'),
  abs,
  size: statSync(abs).size,
  ext: extname(abs).toLowerCase()
}))

// Every place that can point at /static.
const sources = [
  ...walk(join(ROOT, 'content')).filter(f => /\.(md|ya?ml)$/.test(f)),
  ...walk(join(ROOT, 'app')).filter(f => /\.(vue|ts|js|json)$/.test(f)),
  join(ROOT, 'nuxt.config.ts'),
  ...readdirSync(join(ROOT, 'public')).filter(f => f.endsWith('.xml')).map(f => join(ROOT, 'public', f))
]
const refRe = /\/static\/[^\s"'()<>`\]]+/g
const refsBySource = new Map()
for (const src of sources) {
  const text = readFileSync(src, 'utf8')
  const refs = new Set((text.match(refRe) || []).map(r => decodeURI(r.replace(/[.,;:]+$/, ''))))
  refsBySource.set(relative(ROOT, src), refs)
}
const allRefs = new Set([...refsBySource.values()].flatMap(s => [...s]))

// Folders of referenced demo pages: everything inside them is in use.
const liveDirs = [...allRefs].filter(r => r.endsWith('.html')).map(r => dirname(r) + '/')
const isReferenced = f => allRefs.has(f.path) || liveDirs.some(d => f.path.startsWith(d))

for (const f of files) {
  f.referenced = isReferenced(f)
  f.users = [...refsBySource].filter(([, refs]) => refs.has(f.path)).map(([src]) => src)
}

// Image dimensions (sharp ships with @nuxt/image).
for (const f of files.filter(f => IMAGE.has(f.ext))) {
  try {
    const meta = await sharp(f.abs).metadata()
    f.width = meta.width
    f.height = meta.height
  } catch { /* unreadable image: leave dimensions blank */ }
}

const mb = n => (n / 1024 / 1024).toFixed(1) + ' MB'
const total = files.reduce((s, f) => s + f.size, 0)
const unreferenced = files.filter(f => !f.referenced).sort((a, b) => b.size - a.size)
const big = files.filter(f => f.size >= BIG).sort((a, b) => b.size - a.size)
const wide = files.filter(f => f.width && f.width > WIDE).sort((a, b) => b.width - a.width)

// Per article: the assets it references.
const articles = [...refsBySource]
  .filter(([src]) => src.startsWith('content/') && src.endsWith('.md'))
  .map(([src, refs]) => {
    const own = files.filter(f => refs.has(f.path))
    return { article: src.replace(/^content\//, '').replace(/\.md$/, ''), count: own.length, size: own.reduce((s, f) => s + f.size, 0) }
  })
  .filter(a => a.count)
  .sort((a, b) => b.size - a.size)

const byExt = Object.entries(files.reduce((acc, f) => {
  acc[f.ext || '(none)'] ??= { count: 0, size: 0 }
  acc[f.ext || '(none)'].count++
  acc[f.ext || '(none)'].size += f.size
  return acc
}, {})).sort((a, b) => b[1].size - a[1].size)

const asJson = process.argv.includes('--json')
if (asJson) {
  // No process.exit() here: it would cut off stdout before a large report flushes.
  console.log(JSON.stringify({ total, files, articles }, null, 2))
}

if (!asJson) printMarkdown()

function printMarkdown() {
  const row = (...c) => `| ${c.join(' | ')} |`
  const out = []
  out.push(`## public/static inventory (${new Date().toISOString().slice(0, 10)})`, '')
  out.push(`**${files.length} files, ${mb(total)}.** ${unreferenced.length} files (${mb(unreferenced.reduce((s, f) => s + f.size, 0))}) are not referenced anywhere; ${big.length} are ≥ 2 MB; ${wide.length} images are wider than ${WIDE}px.`, '')
  out.push('### By type', '', row('type', 'files', 'size'), row('---', '---:', '---:'))
  for (const [ext, v] of byExt) out.push(row(ext, v.count, mb(v.size)))
  out.push('', '### Heaviest articles', '', row('article', 'assets', 'size'), row('---', '---:', '---:'))
  for (const a of articles.slice(0, 15)) out.push(row(a.article, a.count, mb(a.size)))
  out.push('', `### Unreferenced files (${unreferenced.length})`, '', row('file', 'size'), row('---', '---:'))
  for (const f of unreferenced.slice(0, 40)) out.push(row('`' + f.path + '`', mb(f.size)))
  if (unreferenced.length > 40) out.push(row(`… ${unreferenced.length - 40} more`, mb(unreferenced.slice(40).reduce((s, f) => s + f.size, 0))))
  out.push('', `### Files ≥ 2 MB (${big.length})`, '', row('file', 'size', 'dimensions', 'used by'), row('---', '---:', '---', '---'))
  for (const f of big.slice(0, 30)) {
    out.push(row('`' + f.path + '`', mb(f.size), f.width ? `${f.width}×${f.height}` : '', f.referenced ? (f.users[0]?.replace(/^content\//, '') ?? 'demo page') : '**unreferenced**'))
  }
  console.log(out.join('\n'))
}
