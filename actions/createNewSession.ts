import { v4 } from "uuid";
import type { Session, Settings, Tab } from "../utils/types";
import createNewWindow from "./createNewWindow";
import getTabsByWindowId from "./getTabsByWindowId";
import { Storage } from "@plasmohq/storage";

const createNewSession = async (windowId?: number, urls?: string[], title?: string): Promise<Session> => {
  const store = new Storage({ area: 'local' })
  const settings: Settings = await store.get('settings')
  const createWindow = settings.createWindowForNewSession
  windowId = -1
  let tabs: Tab[] = []

  if (createWindow && !(windowId && windowId > 1)) {
    windowId = await createNewWindow(urls || [])
    tabs = await getTabsByWindowId(windowId) || []
  }

  const session: Session = {
    id: v4(),
    windowId: windowId,
    title: title || new Date().toUTCString(),
    tabs,
    main: false,
    isOpen: createWindow,
    colorCode: Math.floor(Math.random() * 5) + 1
  }

  return session
}

export default createNewSession