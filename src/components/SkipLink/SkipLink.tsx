import type { MouseEvent } from 'react'
import styles from './SkipLink.module.css'

export const MAIN_CONTENT_ID = 'main-content'
const MAIN_CONTENT_HASH = `#${MAIN_CONTENT_ID}`

export function SkipLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const mainElement = document.getElementById(MAIN_CONTENT_ID)

    if (!(mainElement instanceof HTMLElement)) {
      return
    }

    event.preventDefault()
    window.history.replaceState(null, '', MAIN_CONTENT_HASH)
    mainElement.focus()
  }

  return (
    <a href={MAIN_CONTENT_HASH} className={styles.skipLink} onClick={handleClick}>
      Skip to main content
    </a>
  )
}