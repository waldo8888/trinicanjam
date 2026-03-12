import styles from './MapEmbed.module.css'

export function MapEmbed({ location = "Trinicanjam Cuisine Hamilton Ontario" }: { location?: string }) {
  const key = import.meta.env.VITE_MAPS_EMBED_KEY
  const encodedLocation = encodeURIComponent(location)
  const keyBackedMapSrc = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodedLocation}`
  const fallbackMapSrc = `https://www.google.com/maps?q=${encodedLocation}&z=15&output=embed`
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