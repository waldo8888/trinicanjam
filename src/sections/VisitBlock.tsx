import { useEffect } from 'react'
import { trackDirectionsClick, trackHoursView, trackPhoneClick } from '@/lib/analytics'
import styles from './VisitBlock.module.css'

interface HoursRow {
  day: string
  dayIndex: number
  hours: string
}

const OPENING_HOURS: HoursRow[] = [
  { day: 'Tuesday', dayIndex: 2, hours: '11:00 AM - 9:00 PM' },
  { day: 'Wednesday', dayIndex: 3, hours: '11:00 AM - 9:00 PM' },
  { day: 'Thursday', dayIndex: 4, hours: '11:00 AM - 9:00 PM' },
  { day: 'Friday', dayIndex: 5, hours: '11:00 AM - 10:00 PM' },
  { day: 'Saturday', dayIndex: 6, hours: '11:00 AM - 10:00 PM' },
  { day: 'Sunday', dayIndex: 0, hours: '12:00 PM - 8:00 PM' },
  { day: 'Monday', dayIndex: 1, hours: 'Closed' },
]

export function VisitBlock() {
  const todayIndex = new Date().getDay()

  useEffect(() => {
    trackHoursView()
  }, [])

  return (
    <section id="visit" aria-labelledby="visit-heading" className={styles.section}>
      <h2 id="visit-heading" className={styles.heading}>Find Us</h2>

      <div className={styles.content}>
        <address className={styles.address}>
          <strong>Trinicanjam Cuisine</strong>
          <br />
          123 King Street East
          <br />
          Hamilton, ON L8N 1A1
          <br />
          <span className={styles.neighbourhood}>Lower City, Hamilton</span>
        </address>

        <table className={styles.hoursTable}>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Hours</th>
            </tr>
          </thead>
          <tbody>
            {OPENING_HOURS.map(({ day, dayIndex, hours }) => {
              const isToday = dayIndex === todayIndex

              return (
                <tr
                  key={day}
                  data-testid={`hours-row-${dayIndex}`}
                  className={isToday ? styles.todayRow : undefined}
                >
                  <td>{day}</td>
                  <td>{hours}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <p className={styles.phone}>
          Call us:{' '}
          <a
            href="tel:+19055551234"
            className={styles.phoneLink}
            onClick={trackPhoneClick}
          >
            (905) 555-1234
          </a>
        </p>

        <div className={styles.ctas}>
          <a
            href="https://maps.google.com/?q=Trinicanjam+Cuisine+Hamilton+Ontario"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
            onClick={trackDirectionsClick}
          >
            Get Directions
          </a>
          <a href="/#menu" className={styles.ctaOutlined}>
            View Menu
          </a>
        </div>
      </div>
    </section>
  )
}
