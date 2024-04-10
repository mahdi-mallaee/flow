import store from "~store"
import { SESSION_NUMBER_LIMIT } from "~utils/constants"

/**
 * Checks if user has reached the maximum number of sessions allowed.
 * @returns {boolean} `true` if the session limit has been reached, `false` otherwise.
 */

const checkNumberLimit = async (): Promise<boolean> => {
  const number = await store.sessions.getNumbers()
  if (number < SESSION_NUMBER_LIMIT) {
    return true
  } else {
    return false
  }
}

export default checkNumberLimit