import { v4 } from "uuid";
import type { Session } from "../utils/types";
import createNewWindow from "./createNewWindow";
import getTabsByWindowId from "./getTabsByWindowId";

const createNewSession = async (windowId?: number, urls?: string[], title?: string): Promise<Session> => {
  if (!(windowId && windowId > 1)) {
    windowId = await createNewWindow(urls || [])
  }

  const tabs = await getTabsByWindowId(windowId)

  const session = {
    id: v4(),
    windowId: windowId,
    title: title || new Date().toUTCString(),
    tabs,
    main: false,
    isOpen: true
  }

  return session
}

export default createNewSession