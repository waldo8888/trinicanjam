import { trackInstagramClick } from '@/lib/analytics'
import { businessInfo, instagramPosts } from '@/data/siteContent'
import styles from './SocialProofGrid.module.css'

export function SocialProofGrid() {
  return (
    <section id="social" aria-labelledby="social-proof-heading" className={styles.container}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Follow along</p>
        <h3 id="social-proof-heading" className={styles.heading}>
          {businessInfo.instagramHandle}
        </h3>
        <a
          href={businessInfo.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primaryLink}
          onClick={trackInstagramClick}
        >
          View on Instagram
        </a>
      </div>

      <div className={styles.grid}>
        {instagramPosts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
            onClick={trackInstagramClick}
          >
            <div className={styles.media}>
              <img
                src={post.imageSrc}
                alt={post.alt}
                width={640}
                height={640}
                loading="lazy"
                className={styles.image}
              />
            </div>
            <div className={styles.hoverOverlay}>
              <span className={styles.cardLabel}>{post.subtitle}</span>
              <h4 className={styles.cardTitle}>{post.title}</h4>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
