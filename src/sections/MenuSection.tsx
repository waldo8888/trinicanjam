import { startTransition, useState, useEffect, useRef, type KeyboardEvent } from 'react'
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
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    trackMenuView()
  }, [])

  const updateActiveCategory = (category: MenuCategory) => {
    startTransition(() => {
      setActiveCategory(category)
    })
  }

  const setActiveTab = (category: MenuCategory) => {
    updateActiveCategory(category)
    tabRefs.current[category]?.focus()
  }

  const handleTabKeyDown = (category: MenuCategory) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = MENU_CATEGORIES.indexOf(category)

    if (currentIndex === -1) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % MENU_CATEGORIES.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + MENU_CATEGORIES.length) % MENU_CATEGORIES.length
    } else {
      return
    }

    event.preventDefault()
    setActiveTab(MENU_CATEGORIES[nextIndex])
  }

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
                id={`menu-tab-${category}`}
            role="tab"
            aria-selected={activeCategory === category}
                aria-controls={`menu-panel-${category}`}
                tabIndex={activeCategory === category ? 0 : -1}
                ref={(element) => {
                  tabRefs.current[category] = element
                }}
            className={[styles.tab, activeCategory === category ? styles.tabActive : ''].join(' ')}
                onClick={() => updateActiveCategory(category)}
                onKeyDown={handleTabKeyDown(category)}
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>

          <div
            id={`menu-panel-${activeCategory}`}
            role="tabpanel"
            aria-labelledby={`menu-tab-${activeCategory}`}
            className={styles.panel}
          >
            <div className={styles.grid}>
              {filteredItems.map(item => (
                <DishCard
                  key={item.id}
                  item={item}
                  variant={item.featured ? 'featured' : 'compact'}
                />
              ))}
            </div>
      </div>

      <div className={styles.visitCta}>
        <a href="/#visit" className={styles.visitCtaLink}>
          Plan Your Visit →
        </a>
      </div>
    </section>
  )
}
