import { WINDOWID_NONE } from "~utils/constants"

/**
 * Checks if the provided window ID is valid.
 * 
 * @param id - The window ID to check.
 * @returns `true` if the window ID is valid, `false` otherwise.
 */
const checkId = (id: number): boolean => {
  if (typeof id !== 'number')
    return false

  if (id === WINDOWID_NONE)
    return false

  if (id < 0) {
    return false
  }

  return true
}

export default checkId