// Turns the single-file Vite build into a bare page fragment (no <html>/<head>/<body>
// wrapper) so it can be published as a shareable claude.ai artifact.
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('dist-artifact/index.html', 'utf8')
const head = src.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? ''
const body = src.match(/<body>([\s\S]*?)<\/body>/)?.[1] ?? ''

const keep = [
  head.match(/<title>[\s\S]*?<\/title>/)?.[0],
  ...(head.match(/<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>/g) ?? []),
  ...(head.match(/<style[\s\S]*?<\/style>/g) ?? []),
  body.replace(/<script[\s\S]*?<\/script>/g, '').trim(),
  ...(head.match(/<script[\s\S]*?<\/script>/g) ?? []),
].filter(Boolean)

writeFileSync('dist-artifact/nichenotes.html', keep.join('\n') + '\n')
console.log(`dist-artifact/nichenotes.html  ${(Buffer.byteLength(keep.join('\n')) / 1024).toFixed(0)} kB`)
