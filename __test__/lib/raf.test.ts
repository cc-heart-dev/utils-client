import { raf } from '@/lib/raf'

describe('raf timing accuracy', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number
    })
    jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id)
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('should call the callback roughly every 100ms', async () => {
    const callTimestamps: number[] = []

    const callback = jest.fn().mockImplementation(() => {
      callTimestamps.push(Date.now())
      return Promise.resolve()
    })

    raf(callback, 100)

    for (let i = 0; i < 1000; i += 16) {
      jest.advanceTimersByTime(16)
      await Promise.resolve()
    }

    expect(callTimestamps.length).toBeGreaterThanOrEqual(5)

    // ±10ms
    for (let i = 1; i < callTimestamps.length; i++) {
      const delta = callTimestamps[i] - callTimestamps[i - 1]
      expect(delta).toBeGreaterThanOrEqual(95)
    }
  })
})
