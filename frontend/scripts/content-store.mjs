import fs from 'node:fs'
import path from 'node:path'

// Úložiště dat ve frontend/content. Soubor se přepíše jen při změně obsahu;
// `updatedAt` tak znamená „kdy se data naposledy změnila“, ne „kdy běžel skript“.
export function createContentStore(dir, { transactional = false } = {}) {
  const pending = new Map()

  function read(relativePath) {
    if (pending.has(relativePath)) return pending.get(relativePath)
    const file = path.join(dir, relativePath)
    if (!fs.existsSync(file)) return null
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  }

  function persist(relativePath, data) {
    const file = path.join(dir, relativePath)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const temporaryFile = `${file}.tmp-${process.pid}`
    fs.writeFileSync(temporaryFile, `${JSON.stringify(data, null, 2)}\n`)
    fs.renameSync(temporaryFile, file)
  }

  function writeIfChanged(relativePath, data, now = new Date()) {
    const existing = read(relativePath)
    if (existing) {
      const { updatedAt, ...rest } = existing
      if (JSON.stringify(rest) === JSON.stringify(data)) return false
    }

    const next = { ...data, updatedAt: now.toISOString() }
    if (transactional) pending.set(relativePath, next)
    else persist(relativePath, next)
    return true
  }

  function commit() {
    for (const [relativePath, data] of pending) persist(relativePath, data)
    pending.clear()
  }

  function rollback() {
    pending.clear()
  }

  return { read, writeIfChanged, commit, rollback }
}
