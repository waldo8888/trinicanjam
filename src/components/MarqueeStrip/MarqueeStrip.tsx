import styles from './MarqueeStrip.module.css'

interface MarqueeStripProps {
  text?: string
  separator?: string
  variant?: 'dark' | 'warm' | 'gold'
}

export function MarqueeStrip({ 
  text = 'Trinidadian · Jamaican · Caribbean Soul · Hamilton Table', 
  separator = ' ✦ ',
  variant = 'dark' 
}: MarqueeStripProps) {
  const content = `${text}${separator}`
  // Repeat enough to fill wide screens
  const repeated = Array(8).fill(content).join('')

  return (
    <div className={`${styles.marquee} ${styles[variant]}`} aria-hidden="true">
      <div className={styles.track}>
        <span className={styles.content}>{repeated}</span>
        <span className={styles.content}>{repeated}</span>
      </div>
    </div>
  )
}
