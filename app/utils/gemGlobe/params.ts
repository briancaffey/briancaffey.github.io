// Settings for the gem globe scene. Kept apart from scene.ts so the page can show the
// controls without loading three.js.

import { DEFAULT_LAYOUT } from './layout'
import type { LayoutOptions } from './layout'

export const GEM_BASE = '/static/gem-globe'

export interface OrbPreset {
  name: string
  color: string
  // metal: a mirror under the stones. clear: you can see through the globe. Otherwise matte.
  kind: 'metal' | 'matte' | 'clear' | 'none'
  roughness: number
  ior: number
  glow: number
  // How much room light a matte orb sends back up through the stones.
  albedo: number
}

export const ORBS: Record<string, OrbPreset> = {
  gold: { name: 'Gold', color: '#ffc558', kind: 'metal', roughness: 0.2, ior: 1, glow: 0, albedo: 0.5 },
  platinum: { name: 'Platinum', color: '#e9e9f0', kind: 'metal', roughness: 0.15, ior: 1, glow: 0, albedo: 0.5 },
  porcelain: { name: 'Porcelain', color: '#f4efe4', kind: 'matte', roughness: 0.45, ior: 1, glow: 0, albedo: 0.42 },
  obsidian: { name: 'Obsidian', color: '#08080a', kind: 'matte', roughness: 0.08, ior: 1, glow: 0, albedo: 0.5 },
  glass: { name: 'Solid glass', color: '#e6f6f4', kind: 'clear', roughness: 0, ior: 1.5, glow: 0, albedo: 0.5 },
  hollow: { name: 'Hollow', color: '#ffffff', kind: 'none', roughness: 0, ior: 1, glow: 0, albedo: 0.5 },
  lantern: { name: 'Lantern', color: '#ffb45a', kind: 'matte', roughness: 0.6, ior: 1, glow: 1.1, albedo: 0.12 }
}

export const ENVIRONMENTS: Record<string, { name: string, file: string }> = {
  lounge: { name: 'Wooden lounge', file: 'env/wooden_lounge_1k.hdr' },
  loft: { name: 'Studio loft', file: 'env/photo_studio_loft_hall_1k.hdr' }
}

export interface GemGlobeParams extends LayoutOptions {
  // 'traced' follows light through every stone in a custom shader.
  // 'standard' uses three.js's built-in physical material, for comparison and for export.
  mode: 'traced' | 'standard'
  bounces: number
  refraction: number
  fire: number
  saturation: number
  sparkle: number
  orb: string
  orbColor: string
  glow: number
  environment: string
  backgroundBlur: number
  exposure: number
  bloom: number
  spin: number
  table: boolean
}

export const DEFAULT_PARAMS: GemGlobeParams = {
  ...DEFAULT_LAYOUT,
  mode: 'traced',
  bounces: 5,
  refraction: 1,
  fire: 1,
  saturation: 1,
  sparkle: 1,
  orb: 'gold',
  orbColor: ORBS.gold!.color,
  glow: 0,
  environment: 'lounge',
  backgroundBlur: 0.18,
  exposure: 0.85,
  bloom: 0.14,
  spin: 0.12,
  table: true
}
