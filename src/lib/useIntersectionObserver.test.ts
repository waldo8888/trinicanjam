// src/lib/useIntersectionObserver.test.ts
import { renderHook, act } from '@testing-library/react'
import { useIntersectionObserver } from './useIntersectionObserver'

describe('useIntersectionObserver', () => {
  let capturedCallback: IntersectionObserverCallback
  const disconnectMock = vi.fn()
  const observeMock = vi.fn()

  beforeEach(() => {
    disconnectMock.mockReset()
    observeMock.mockReset()
    vi.mocked(window.IntersectionObserver).mockImplementation((callback) => {
      capturedCallback = callback
      return {
        observe: observeMock,
        unobserve: vi.fn(),
        disconnect: disconnectMock,
        takeRecords: vi.fn(() => []),
        root: null,
        rootMargin: '',
        thresholds: [],
      } as unknown as IntersectionObserver
    })
  })

  it('returns false initially', () => {
    const ref = { current: document.createElement('div') }

    const { result } = renderHook(() => useIntersectionObserver(ref))

    expect(result.current).toBe(false)
  })

  it('returns true after IntersectionObserver fires with isIntersecting: true', () => {
    const ref = { current: document.createElement('div') }

    const { result } = renderHook(() => useIntersectionObserver(ref))

    act(() => {
      capturedCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    expect(result.current).toBe(true)
  })

  it('calls observer.disconnect() on unmount', () => {
    const ref = { current: document.createElement('div') }

    const { unmount } = renderHook(() => useIntersectionObserver(ref))
    unmount()

    expect(disconnectMock).toHaveBeenCalled()
  })
})
