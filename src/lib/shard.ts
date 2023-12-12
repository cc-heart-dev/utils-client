import { func } from '../types/helper'

export const handleInvoke = (callback: func) => {
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
