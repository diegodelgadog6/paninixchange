// Deterministic pseudo-random helpers — shared across the mock data layer so that
// generated state (album seed, collector inventories, etc.) is stable across reloads.
// Pure functions; no app logic lives here.

// Small seedable PRNG. Returns a function that yields floats in [0, 1).
export function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hashes a string into a 32-bit integer seed (e.g. to seed mulberry32 from an id).
export function hashStringSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
