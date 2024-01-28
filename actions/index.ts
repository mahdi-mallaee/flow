import createNewBackup from "./backup/createNewBackup"
import downloadBackup from "./backup/downloadBackup"
import uploadBackup from "./backup/uploadBackup"
import openSession from "./session/openSession"
import refreshTabs from "./session/refreshTabs"
import refreshOpenSessions from "./session/refreshOpenSessions"
import openFirstSession from "./session/openFirstSession"
import createNewWindow from "./window/createNewWindow"
import discardOpenedTab from "./window/discardOpenedTab"
import getTabsByWindowId from "./window/getTabsByWindowId"
import refreshUnsavedWindows from "./window/refreshUnsavedWindows"
import isWindowUnsaved from "./window/isWindowUnsaved"
import refreshLastClosedWindow from "./window/refreshLastClosedWindow"
import doesWindowIncludesTab from "./window/doesWindowIncludesTab"
import createNewSession from "./session/createNewSession"
import runIntervalBakcups from "./backup/runIntervalBackups"

const actions = {
  backup: {
    create: createNewBackup,
    download: downloadBackup,
    upload: uploadBackup,
    runInterval: runIntervalBakcups
  },
  session: {
    create: createNewSession,
    open: openSession,
    refreshTabs,
    refreshOpens: refreshOpenSessions,
    openFirst: openFirstSession
  },
  window: {
    create: createNewWindow,
    discardOpenedTab: discardOpenedTab,
    getTabs: getTabsByWindowId,
    refreshUnsavedWindows: refreshUnsavedWindows,
    isUnsaved: isWindowUnsaved,
    refreshLastClosedWindow: refreshLastClosedWindow,
    includesTab: doesWindowIncludesTab
  }
}
export default actions