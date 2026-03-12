import styles from './MapEmbed.module.css'

export function MapEmbed() {
  const key = import.meta.env.VITE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${key}&q=Trinicanjam+Cuisine+Hamilton+Ontario`

  return (
    <figure className={styles.figure}>
      {key ? (
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
      ) : (
        <div className={styles.placeholder}>Map loading…</div>
      )}
      <figcaption className={styles.caption}>Trinicanjam Cuisine — Hamilton, Ontario</figcaption>
    </figure>
  )
}