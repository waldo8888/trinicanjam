import { describe, it, expect } from 'vitest'
import { MENU_ITEMS, MENU_CATEGORIES } from './menu'
import type { MenuCategory } from '@/types'

describe('MENU_ITEMS', () => {
  it('has at least 12 items', () => {
    expect(MENU_ITEMS.length).toBeGreaterThanOrEqual(12)
  })

  it('every item has a non-empty id', () => {
    MENU_ITEMS.forEach(item => {
      expect(item.id.trim().length).toBeGreaterThan(0)
    })
  })

  it('every item has a non-empty name', () => {
    MENU_ITEMS.forEach(item => {
      expect(item.name.trim().length).toBeGreaterThan(0)
    })
  })

  it('every item has a non-empty description', () => {
    MENU_ITEMS.forEach(item => {
      expect(item.description.trim().length).toBeGreaterThan(0)
    })
  })

  it('every item has a non-empty price', () => {
    MENU_ITEMS.forEach(item => {
      expect(item.price.trim().length).toBeGreaterThan(0)
    })
  })

  it('has at least 2 featured items', () => {
    const featuredCount = MENU_ITEMS.filter(item => item.featured === true).length
    expect(featuredCount).toBeGreaterThanOrEqual(2)
  })
})

describe('MENU_CATEGORIES', () => {
  it('has at least 4 categories', () => {
    expect(MENU_CATEGORIES.length).toBeGreaterThanOrEqual(4)
  })

  it('has no duplicate categories', () => {
    const uniqueCount = new Set(MENU_CATEGORIES).size
    expect(uniqueCount).toBe(MENU_CATEGORIES.length)
  })
})

describe('cross-validation', () => {
  it('every item category exists in MENU_CATEGORIES', () => {
    const categorySet = new Set<MenuCategory>(MENU_CATEGORIES)
    MENU_ITEMS.forEach(item => {
      expect(categorySet.has(item.category)).toBe(true)
    })
  })
})
