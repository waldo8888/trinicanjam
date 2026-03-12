import { forwardRef } from 'react'
import type { MenuItem } from '@/types'
import styles from './DishCard.module.css'

interface DishCardProps {
  item: MenuItem
  variant?: 'compact' | 'featured'
}

export const DishCard = forwardRef<HTMLDivElement, DishCardProps>(
  ({ item, variant = 'compact' }, ref) => {
    const isFeatured = variant === 'featured'

    return (
      <article
        ref={ref}
        className={`${styles.card} ${isFeatured ? styles.featuredCard : ''}`}
      >
        {isFeatured && (
          <div className={styles.imageContainer}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className={styles.image}
                loading="lazy"
              />
            ) : (
              <div className={styles.placeholder} aria-hidden="true">
                <span className={styles.placeholderIcon}>🍽️</span>
              </div>
            )}
            <div className={styles.featuredBadge}>Signature</div>
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.headerRow}>
            <h3 className={styles.name}>{item.name}</h3>
            <span className={styles.price}>${item.price}</span>
          </div>
          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}
        </div>
      </article>
    )
  }
)

DishCard.displayName = 'DishCard'
