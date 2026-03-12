// NOTE: Images are imported without explicit query params (e.g., ?w=800&format=webp)
// because vite.config.ts applies `defaultDirectives: 'w=800&format=webp'` globally via
// imagetools(). If defaultDirectives is ever removed from vite.config.ts, these imports
// will no longer produce WebP-optimised output at build time.
import photo1 from '@/assets/images/food-1.jpg'
import photo2 from '@/assets/images/food-2.jpg'
import photo3 from '@/assets/images/food-3.jpg'
import photo4 from '@/assets/images/food-4.jpg'
import photo5 from '@/assets/images/food-5.jpg'
import photo6 from '@/assets/images/food-6.jpg'
import styles from './FoodPhotographySection.module.css'

interface FoodPhoto {
  id: string
  src: string
  alt: string
  loading: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

const FOOD_PHOTOS: FoodPhoto[] = [
  {
    id: 'food-1',
    src: photo1,
    alt: 'Jerk chicken served with rice and peas at Trinicanjam Cuisine',
    loading: 'eager',
    fetchPriority: 'high',
  },
  {
    id: 'food-2',
    src: photo2,
    alt: 'Doubles — fried bara with curried channa, Trinidadian street food classic',
    loading: 'lazy',
  },
  {
    id: 'food-3',
    src: photo3,
    alt: 'Oxtail stew with butter beans, slow-braised Jamaican style',
    loading: 'lazy',
  },
  {
    id: 'food-4',
    src: photo4,
    alt: 'Curry chicken with roti, a Caribbean comfort food staple at Trinicanjam',
    loading: 'lazy',
  },
  {
    id: 'food-5',
    src: photo5,
    alt: 'Rum cake with coconut cream, a beloved Caribbean dessert',
    loading: 'lazy',
  },
  {
    id: 'food-6',
    src: photo6,
    alt: 'Beautifully plated Caribbean dishes at Trinicanjam Cuisine, Hamilton Ontario',
    loading: 'lazy',
  },
]

export function FoodPhotographySection() {
  return (
    <section aria-labelledby="food-photography-heading" className={styles.section}>
      <h2 id="food-photography-heading" className={styles.srOnly}>
        From Our Kitchen
      </h2>
      <div className={styles.grid}>
        {FOOD_PHOTOS.map((photo) => (
          <div key={photo.id} className={styles.cell}>
            <img
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              loading={photo.loading}
              fetchPriority={photo.fetchPriority}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
