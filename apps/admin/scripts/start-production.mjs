import { spawn } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.join(__dirname, '..')
const port = String(process.env.PORT ?? '3002')

// Railway must set PORT; log so deploy logs show misconfig (e.g. wrong start cwd)
console.error(`[bonusbridge-admin] cwd=${appRoot} PORT=${port}`)

function resolveNextBin() {
  const fallback = path.join(appRoot, 'node_modules', 'next', 'dist', 'bin', 'next')
  if (fs.existsSync(fallback)) return fallback
  try {
    const require = createRequire(import.meta.url)
    return require.resolve('next/dist/bin/next')
  } catch (err) {
    console.error('[bonusbridge-admin] Next.js CLI not found. Run install+build from monorepo root.', err)
    process.exit(1)
  }
}

const nextBin = resolveNextBin()

const child = spawn(process.execPath, [nextBin, 'start', '-H', '0.0.0.0', '-p', port], {
  cwd: appRoot,
  env: process.env,
  stdio: 'inherit'
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
