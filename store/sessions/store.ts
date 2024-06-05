import basicUpdate from "./basicUpdate"
import create from "./create"
import getAll from "./getAll"
import getGroups from "./getGroups"
import getNumbers from "./getNumbers"
import getOpenStatus from "./getOpenStatus"
import getTabs from "./getTabs"
import refreshSessionStatus from "./refreshSessionStatus"
import remove from "./remove"
import setAll from "./setAll"
import setOpenStatus from "./setOpenStatus"
import setTabs from "./setTabs"
import setWindowId from "./setWindowId"

const sessionsStore = {
  setTabs,
  getTabs,
  create,
  getAll,
  setOpenStatus,
  refreshSessionStatus,
  remove,
  setWindowId,
  setAll,
  getOpenStatus,
  getGroups,
  getNumbers,
  basicUpdate
}

export default sessionsStore