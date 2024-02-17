import create from "./create"
import editTitle from "./editTitle"
import getAll from "./getAll"
import getGroups from "./getGroups"
import getNumbers from "./getNumbers"
import getOpenStatus from "./getOpenStatus"
import getTabs from "./getTabs"
import refreshSessionStatus from "./refreshSessionStatus"
import remove from "./remove"
import setAll from "./setAll"
import setAsMain from "./setAsMain"
import setGroups from "./setGroups"
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
  setAsMain,
  editTitle,
  setAll,
  getOpenStatus,
  setGroups,
  getGroups,
  getNumbers
}

export default sessionsStore