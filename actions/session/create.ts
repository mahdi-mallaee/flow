import { v4 } from "uuid";
import { type Session } from "../../utils/types";
import store from "~store";
import { WINDOWID_NONE } from "~utils/constants";
import actions from "~actions";

/**
 * Creates a new session with the specified window ID and title.
 *
 * @param {object} [options] - The options for creating the session.
 * @param {number} [options.windowId] - The ID of the window to associate with the session.
 * @param {string} [options.title] - The title of the session.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the session was created successfully, `false` otherwise.
 */
const create = async ({ windowId, title }: { windowId?: number, title?: string }): Promise<boolean> => {

  if (!location.href.includes('background')) {
    actions.message.createSession({ windowId, title })
    return
  }
  
  const settings = await store.settings.getAll()
  const createWindow = settings.createWindowForNewSession
  let isSessionOpen = false

  // check to wether create a new window if windowId is not provided or 
  // set the session's windowId to be the provided windowId
  if (actions.window.checkId(windowId)) {
    isSessionOpen = true
  } else {
    if (createWindow) {
      windowId = await actions.window.create()
      if (actions.window.checkId(windowId)) {
        isSessionOpen = true
      }
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
    colorCode: Math.floor(Math.random() * 5) + 1,
    groups: []
  }

  const result = await store.sessions.create(session)
  await actions.window.refreshUnsavedWindows()

  return result
}

export default create