type Callback = () => Promise<void> | void

/**
 * Executes a callback function at a specified rate using requestAnimationFrame.
 * The callback can return either a promise or a void.
 *
 * @param {Callback} callback - The function to be executed. It can return a promise or void.
 * @param {number} rate - The minimum time (in milliseconds) to wait between executions of the callback.
 * @returns {() => void} A function that cancels the animation frame when called.
 */
export function raf(callback: Callback, rate: number): () => void {
  let lastTime = 0
  let animationFrameId: number | null = null
  let isRunning = false

  const loop = async () => {
    const currentTime = Date.now()
    if (currentTime - lastTime >= rate) {
      if (!isRunning) {
        isRunning = true
        try {
          // Wait for the callback to finish if it's a Promise
          await callback()
          lastTime = Date.now()
        } catch (error) {
          console.error(`requestAnimationFrame invoke callback error`, error)
        } finally {
          isRunning = false
        }
      }
    }
    animationFrameId = requestAnimationFrame(loop)
  }

  animationFrameId = requestAnimationFrame(loop)

  // Return a cancellation function
  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}
