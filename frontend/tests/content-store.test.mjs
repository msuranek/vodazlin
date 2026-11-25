import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { createContentStore } from '../scripts/content-store.mjs'

let dir
beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vodazlin-content-')) })
afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }) })

test('zapíše nový soubor s datem aktualizace', () => {
  const store = createContentStore(dir)
  expect(store.writeIfChanged('quality/2026-Q3.json', { a: 1 }, new Date('2026-11-01T00:00:00Z'))).toBe(true)
  expect(store.read('quality/2026-Q3.json')).toEqual({ a: 1, updatedAt: '2026-11-01T00:00:00.000Z' })
})

test('při stejném obsahu soubor ani datum nemění', () => {
  const store = createContentStore(dir)
  store.writeIfChanged('pricing/2026.json', { a: 1 }, new Date('2026-11-01T00:00:00Z'))
  expect(store.writeIfChanged('pricing/2026.json', { a: 1 }, new Date('2026-12-01T00:00:00Z'))).toBe(false)
  expect(store.read('pricing/2026.json').updatedAt).toBe('2026-11-01T00:00:00.000Z')
})

test('při změně obsahu posune datum', () => {
  const store = createContentStore(dir)
  store.writeIfChanged('pricing/2026.json', { a: 1 }, new Date('2026-11-01T00:00:00Z'))
  expect(store.writeIfChanged('pricing/2026.json', { a: 2 }, new Date('2026-12-01T00:00:00Z'))).toBe(true)
  expect(store.read('pricing/2026.json')).toEqual({ a: 2, updatedAt: '2026-12-01T00:00:00.000Z' })
})

test('transakce zapíše změny až při commit', () => {
  const store = createContentStore(dir, { transactional: true })
  store.writeIfChanged('quality/2026-Q3.json', { a: 1 }, new Date('2026-11-01T00:00:00Z'))

  expect(store.read('quality/2026-Q3.json')).toEqual({ a: 1, updatedAt: '2026-11-01T00:00:00.000Z' })
  expect(fs.existsSync(path.join(dir, 'quality/2026-Q3.json'))).toBe(false)

  store.commit()
  expect(JSON.parse(fs.readFileSync(path.join(dir, 'quality/2026-Q3.json'), 'utf-8'))).toEqual({
    a: 1,
    updatedAt: '2026-11-01T00:00:00.000Z',
  })
})

test('rollback zahodí všechny rozpracované změny', () => {
  const initial = createContentStore(dir)
  initial.writeIfChanged('pricing/2026.json', { a: 1 }, new Date('2026-11-01T00:00:00Z'))

  const transaction = createContentStore(dir, { transactional: true })
  transaction.writeIfChanged('pricing/2026.json', { a: 2 }, new Date('2026-12-01T00:00:00Z'))
  transaction.writeIfChanged('documents.json', { a: 3 }, new Date('2026-12-01T00:00:00Z'))
  transaction.rollback()

  expect(initial.read('pricing/2026.json')).toEqual({ a: 1, updatedAt: '2026-11-01T00:00:00.000Z' })
  expect(initial.read('documents.json')).toBeNull()
})
