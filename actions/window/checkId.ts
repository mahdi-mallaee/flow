import { WINDOWID_NONE } from "~utils/constants"

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