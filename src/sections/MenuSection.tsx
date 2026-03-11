import { useState, useEffect } from 'react'
import { MENU_ITEMS, MENU_CATEGORIES } from '@/data/menu'
import { DishCard } from '@/components/DishCard/DishCard'
import { trackMenuView } from '@/lib/analytics'
import styles from './MenuSection.module.css'
import type { MenuCategory } from '@/types'

function formatCategory(category: MenuCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(MENU_CATEGORIES[0])

  useEffect(() => {
    trackMenuView()
  }, [])

  const filteredItems = MENU_ITEMS
    .filter(item => item.category === activeCategory)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      data-zone="warm"
      className={styles.section}
    >
      <h2 id="menu-heading" className={styles.heading}>Our Menu</h2>

      <div role="tablist" aria-label="Menu categories" className={styles.tabStrip}>
        {MENU_CATEGORIES.map(category => (
          <button
            key={category}
            role="tab"
            aria-selected={activeCategory === category}
            className={[styles.tab, activeCategory === category ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveCategory(category)}
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredItems.map(item => (
          <DishCard
            key={item.id}
            item={item}
            variant={item.featured ? 'featured' : 'compact'}
          />
        ))}
      </div>
    </section>
  )
}
