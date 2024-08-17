import type { Fn } from '@cc-heart/utils/helper'

export const handleInvoke = (callback: Fn) => {
  return (...rest: any) => {
    if (typeof window !== 'undefined') {
      return callback(...rest)
    } else {
      const name = callback.name
      console.warn(
        `The current running environment does not support calling the ${name}`,
      )
    }
  }
}
