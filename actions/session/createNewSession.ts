import { v4 } from "uuid";
import { type Session } from "../../utils/types";
import store from "~store";
import { WINDOWID_NONE } from "~utils/constants";
import actions from "~actions";

const createNewSession = async ({ windowId, title }: { windowId?: number, title?: string }): Promise<Session> => {
  const settings = await store.settings.getAll()
  const createWindow = settings.createWindowForNewSession
  let isSessionOpen = false

  if (windowId && windowId > 0) {
    isSessionOpen = true
  } else {
    if (createWindow) {
      windowId = await actions.window.create()
      isSessionOpen = true
    } else {
      windowId = WINDOWID_NONE
    }
  }
  const tabs = await actions.window.getTabs(windowId)

  const session: Session = {
    id: v4(),
    windowId: windowId,
    title: title || new Date().toLocaleString(),
    tabs,
    main: false,
    isOpen: isSessionOpen,
    colorCode: Math.floor(Math.random() * 5) + 1
  }

  await store.sessions.create(session)
  await actions.window.refreshUnsavedWindows()

  return session
}

export default createNewSession