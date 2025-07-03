type Callback = () => Promise<void> | void

export function requestAnimation(callback: Callback, rate: number): () => void {
  let lastTime = 0
  let animationFrameId: number | null = null
  let isRunning = false

  const loop = async (currentTime: number) => {
    if (currentTime - lastTime >= rate) {
      lastTime = currentTime
      if (!isRunning) {
        isRunning = true
        try {
          await callback() // Wait for the callback to finish if it's a Promise
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
