import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DishCard } from '@/components/DishCard/DishCard'
import { MENU_ITEMS } from '@/data/menu'
import { trackMenuView } from '@/lib/analytics'
import styles from './MenuSection.module.css'

export function MenuSection() {
  const categories = [
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Mains' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' }
  ]
  const featuredItems = MENU_ITEMS.filter((item: any) => item.featured)
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id)
  const tabListRef = useRef<HTMLDivElement>(null)
  
  const activeCategoryItems = MENU_ITEMS.filter((item: any) => item.category === activeCategoryId)

  // Track viewing the menu once it's mounted
  useEffect(() => {
    trackMenuView()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!tabListRef.current) return

    const tabs = Array.from(tabListRef.current.querySelectorAll('button'))
    let newIndex = index

    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      newIndex = 0
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1
    } else {
      return // Unhandled key
    }

    e.preventDefault()
    tabs[newIndex].focus()
    setActiveCategoryId(categories[newIndex].id)
  }

  return (
    <section id="menu" aria-labelledby="menu-heading" className={styles.section}>
      <div className={styles.container}>
        <div className="luxury-text-reveal">
          <h2 id="menu-heading" className={styles.heading}>
            Signature Selection
          </h2>
        </div>

        {/* Featured Items Grid (Premium Cards) */}
        {featuredItems.length > 0 && (
          <div className={styles.featuredGrid} aria-label="Featured Dishes">
            {featuredItems.map((item: any) => (
              <DishCard key={item.id} item={item} variant="featured" />
            ))}
          </div>
        )}

        {/* Category Tabs (Glassmorphism Pills) */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Menu Categories"
          className={styles.tabStrip}
        >
          {categories.map((category: any, index: number) => {
            const isActive = activeCategoryId === category.id
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${category.id}`}
                id={`tab-${category.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
                onClick={() => setActiveCategoryId(category.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {category.name}
              </button>
            )
          })}
        </div>

        {/* Tab Panels */}
        {categories.map((category: any) => {
          const isActive = activeCategoryId === category.id
          if (!isActive) return null

          return (
            <div
              key={category.id}
              id={`panel-${category.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${category.id}`}
              tabIndex={0}
              className={styles.tabPanel}
            >
              {activeCategoryItems.map((item: any) => (
                <DishCard key={item.id} item={item} variant="compact" />
              ))}
            </div>
          )
        })}

        <div className={styles.ctaContainer}>
          <Link to="/visit" className={styles.ctaLink}>
             Plan Your Visit
          </Link>
        </div>
      </div>
    </section>
  )
}
