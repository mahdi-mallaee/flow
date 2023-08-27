import { v4 } from "uuid";
import { StoreKeys, type Session, type Settings, type Tab, DefaultSettings } from "../utils/types";
import createNewWindow from "./createNewWindow";
import getTabsByWindowId from "./getTabsByWindowId";
import { Storage } from "@plasmohq/storage";
import Store from "~store";

const createNewSession = async (windowId?: number, urls?: string[], title?: string): Promise<Session> => {
  const store = new Storage({ area: 'local' })
  const settings: Settings = await store.get(StoreKeys.settings) || DefaultSettings
  const createWindow = settings.createWindowForNewSession
  let tabs: Tab[] = []
  let isSessionOpen = false

  if (windowId && windowId > 0) {
    tabs = await getTabsByWindowId(windowId) || []
    isSessionOpen = true
  } else {
    if (createWindow) {
      windowId = await createNewWindow(urls || [])
      isSessionOpen = true
    } else {
      windowId = -1
    }
  }

  const session: Session = {
    id: v4(),
    windowId: windowId,
    title: title || new Date().toLocaleString(),
    tabs,
    main: false,
    isOpen: isSessionOpen,
    colorCode: Math.floor(Math.random() * 5) + 1
  }

  Store.sessions.create(session)

  return session
}

export default createNewSession