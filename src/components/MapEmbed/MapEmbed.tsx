import styles from './MapEmbed.module.css'

export function MapEmbed() {
  const key = import.meta.env.VITE_MAPS_EMBED_KEY
  const keyBackedMapSrc = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=Trinicanjam+Cuisine+Hamilton+Ontario`
  const fallbackMapSrc = 'https://www.google.com/maps?q=Trinicanjam+Cuisine+Hamilton+Ontario&z=15&output=embed'
  const mapSrc = key ? keyBackedMapSrc : fallbackMapSrc

  return (
    <figure className={styles.figure}>
      <iframe
        className={styles.iframe}
        src={mapSrc}
        width="100%"
        height="350"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Trinicanjam Cuisine location map"
      />
      <figcaption className={styles.caption}>Trinicanjam Cuisine — Hamilton, Ontario</figcaption>
    </figure>
  )
}