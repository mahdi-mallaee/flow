import store from "~store"
import { SESSION_NUMBER_LIMIT } from "~utils/constants"

const checkNumberLimit = async (): Promise<boolean> => {
  const number = await store.sessions.getNumbers()
  if (number < SESSION_NUMBER_LIMIT) {
    return true
  } else {
    return false
  }
}

export default checkNumberLimit