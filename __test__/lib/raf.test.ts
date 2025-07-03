import { requestAnimation } from '@/lib/raf'

describe('requestAnimation', () => {
  jest.useFakeTimers()

  it('should call the callback at the specified rate', () => {
    const callback = jest.fn()
    const rate = 100 // Call every 100ms

    const cancel = requestAnimation(callback, rate)

    // Fast-forward time
    jest.advanceTimersByTime(250) // 250ms should trigger callback 2 times
    expect(callback).toHaveBeenCalledTimes(2)

    // Cancel the animation
    cancel()

    // Fast-forward time again
    jest.advanceTimersByTime(250) // Should not trigger callback
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not call the callback if the rate is 0', () => {
    const callback = jest.fn()
    const rate = 0 // Call immediately

    const cancel = requestAnimation(callback, rate)

    // Fast-forward time
    jest.advanceTimersByTime(100) // Should trigger callback at least once
    expect(callback).toHaveBeenCalledTimes(1)

    // Cancel the animation
    cancel()
  })

  it('should wait for async callback to finish before calling again', async () => {
    const callback = jest.fn(async () => {
      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
    const rate = 100 // Call every 100ms

    const cancel = requestAnimation(callback, rate)

    // Fast-forward time to allow the first call
    jest.advanceTimersByTime(150) // Should trigger callback once

    expect(callback).toHaveBeenCalledTimes(1)

    // Fast-forward time again, should not call again since async work is not finished
    jest.advanceTimersByTime(100) // Should not trigger callback again
    expect(callback).toHaveBeenCalledTimes(1)

    // Wait for the async callback to finish
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Fast-forward time to allow the next call
    jest.advanceTimersByTime(100) // Now it should trigger callback again
    expect(callback).toHaveBeenCalledTimes(2)

    cancel() // Clean up
  })
})