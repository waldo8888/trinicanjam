import { useState } from 'react'
import { trackInstagramClick } from '@/lib/analytics'
import styles from './SocialProofGrid.module.css'

// MVP: static curated images — live API can replace this array in a future sprint
// Placeholder photography will be replaced with final curated brand imagery before go-live.
const instagramImages = [
  { src: '/assets/images/instagram/ig-1.jpg', alt: 'Chef plating a Caribbean entree with fresh herbs at Trinicanjam Cuisine' },
  { src: '/assets/images/instagram/ig-2.jpg', alt: 'Close-up of a Trinidadian street-food plate served at Trinicanjam Cuisine' },
  { src: '/assets/images/instagram/ig-3.jpg', alt: 'Kitchen prep of fresh ingredients before dinner service at Trinicanjam Cuisine' },
  { src: '/assets/images/instagram/ig-4.jpg', alt: 'Dining room table set for service inside Trinicanjam Cuisine' },
  { src: '/assets/images/instagram/ig-5.jpg', alt: 'Signature Caribbean main plated for guests at Trinicanjam Cuisine' },
  { src: '/assets/images/instagram/ig-6.jpg', alt: 'House dessert plated with garnish at Trinicanjam Cuisine' },
]

export function SocialProofGrid() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={styles.container}>
      {!loaded ? (
        <div
          role="status"
          className={[styles.grid, styles.skeletonGrid].join(' ')}
          aria-busy="true"
          aria-label="Loading Instagram photos"
        >
          {instagramImages.map(({ src }) => (
            <div key={src} className={styles.skeleton} />
          ))}
        </div>
      ) : null}

      <section
        aria-label="Instagram feed"
        className={[styles.grid, !loaded ? styles.feedPending : ''].join(' ').trim()}
      >
        {instagramImages.map(({ src, alt }, index) => (
          <a
            key={src}
            href="https://instagram.com/trinicanjam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Instagram"
            className={styles.tile}
            onClick={trackInstagramClick}
          >
            <img
              src={src}
              alt={alt}
              width={400}
              height={400}
              loading="lazy"
              className={styles.image}
              onLoad={index === 0 ? () => setLoaded(true) : undefined}
            />
          </a>
        ))}
      </section>
    </div>
  )
}