import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink'

describe('SkipLink', () => {
  it('renders the skip link with the main content anchor href', () => {
    render(<SkipLink />)

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      `#${MAIN_CONTENT_ID}`,
    )
  })

  it('moves focus to the main landmark when activated', () => {
    render(
      <>
        <SkipLink />
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>
          <button type="button">First action</button>
        </main>
      </>,
    )

    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    const main = document.getElementById(MAIN_CONTENT_ID)

    fireEvent.click(skipLink)

    expect(main).toHaveFocus()
    expect(window.location.hash).toBe(`#${MAIN_CONTENT_ID}`)
  })

  it('supports keyboard users moving from the skip link into main content controls', async () => {
    const user = userEvent.setup()

    render(
      <>
        <SkipLink />
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>
          <button type="button">First action</button>
        </main>
      </>,
    )

    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    const main = document.getElementById(MAIN_CONTENT_ID)
    const firstAction = screen.getByRole('button', { name: /first action/i })

    await user.tab()
    expect(skipLink).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(main).toHaveFocus()

    await user.tab()
    expect(firstAction).toHaveFocus()
  })
})