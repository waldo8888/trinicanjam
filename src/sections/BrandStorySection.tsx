import styles from './BrandStorySection.module.css'

export function BrandStorySection() {
  return (
    <section aria-labelledby="brand-story-heading" className={styles.section}>
      <h2 id="brand-story-heading" className={styles.heading}>
        Our Story
      </h2>
      <div className={styles.body}>
        <p>
          Born from the vibrant kitchens of Trinidad and Jamaica, Trinicanjam Cuisine brings the
          warmth of the Caribbean to Hamilton's culinary landscape. Every dish is a journey
          — from the crispy, saffron-laced doubles of Port-of-Spain street corners to the
          slow-braised oxtail that has nourished generations of Jamaican families. We are two
          islands, one table, and an unending celebration of flavour.
        </p>
        <p>
          We are a family affair, built over decades of Sunday dinners, spice-market mornings, and
          the unwavering belief that the best food is always made for someone you love. Trinicanjam
          is our Hamilton home, and it is yours too. Whether you are chasing the flavours of your
          childhood or discovering Caribbean cuisine for the first time — come as you are.
          The table is always set.
        </p>
      </div>
    </section>
  )
}
