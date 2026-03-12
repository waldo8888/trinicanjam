import type { MenuItem } from '@/types'
import styles from './DishCard.module.css'

interface DishCardProps {
  item: MenuItem
  variant?: 'compact' | 'featured'
}

export function DishCard({ item, variant = 'compact' }: DishCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <article
      className={[styles.card, isFeatured ? styles.cardFeatured : ''].join(' ').trim()}
      data-variant={variant}
    >
      {item.imageSrc ? (
        <img
          src={item.imageSrc}
          alt=""
          width={isFeatured ? 800 : 400}
          height={isFeatured ? 450 : 300}
          loading="lazy"
          className={styles.image}
        />
      ) : (
        <div
          className={isFeatured ? styles.imagePlaceholderFeatured : styles.imagePlaceholder}
          aria-hidden="true"
        />
      )}
      <div className={styles.body}>
        <h3 className={[styles.name, isFeatured ? styles.nameFeatured : ''].join(' ').trim()}>
          {item.name}
        </h3>
        <span className={styles.price}>{item.price}</span>
        <p className={[styles.description, isFeatured ? styles.descriptionFeatured : ''].join(' ').trim()}>
          {item.description}
        </p>
      </div>
    </article>
  )
}
