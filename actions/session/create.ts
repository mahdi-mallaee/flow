import { v4 } from "uuid";
import { type Session } from "../../utils/types";
import store from "~store";
import actions from "~actions";
import { NEW_TAB_URL } from "~utils/constants";

/**
 * Creates a new session with the specified window ID and title.
 *
 * @param {object} [options] - The options for creating the session.
 * @param {number} [options.windowId] - The ID of the window to associate with the session.
 * @param {string} [options.title] - The title of the session.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the session was created successfully, `false` otherwise.
 */
const create = async ({ windowId, title, updateWindow = false }: { windowId?: number, title?: string, updateWindow?: boolean }): Promise<boolean> => {

  if (!location.href.includes('background')) {
    const result = await actions.message.createSession({ windowId, title, updateWindow })
    return result
  }

  let isSessionOpen = false

  // check to wether create a new window if windowId is not provided or 
  // set the session's windowId to be the provided windowId
  if (actions.window.checkId(windowId)) {
    const result = await closeCurrentSession(windowId)
    if (updateWindow && !result) {
      windowId = await actions.window.create()
      if (actions.window.checkId(windowId)) {
        isSessionOpen = true
      }
    }
  } else {
    windowId = await actions.window.create()
    if (actions.window.checkId(windowId)) {
      isSessionOpen = true
    }
  }

  const tabs = updateWindow ?
    [{ groupId: -1, id: -1, index: 0, pinned: false, url: NEW_TAB_URL, windowId, title: '', iconUrl: "" }] :
    await actions.window.getTabs(windowId)

  const session: Session = {
    id: v4(),
    windowId: windowId,
    title: title || new Date().toLocaleString(),
    tabs,
    main: false,
    isOpen: isSessionOpen,
    colorCode: Math.floor(Math.random() * 5) + 1,
    groups: [],
    freeze: false
  }

  const result = await store.sessions.create(session)

  if (updateWindow) {
    // removing tabs in the current window to start a new session
    await actions.window.update(windowId, session.tabs, session.groups)
  }

  await actions.window.refreshUnsavedWindows()
  // await actions.session.openSessionsPage({ windowId: windowId })

  return result
}

const closeCurrentSession = async (windowId: number): Promise<boolean> => {
  const openStatus = await store.sessions.getOpenStatus()
  const session = openStatus.find(status => status.windowId === windowId)
  if (session) {
    await store.sessions.setOpenStatus(session.sessionId, { isOpen: false, windowId: -1 })
    return true
  }
  return false
  // returns false if there is not an open session with this window id meaning this window is not saved 
}

export default create