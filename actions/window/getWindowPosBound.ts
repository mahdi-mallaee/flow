import type { WindowPosition } from "~utils/types";

const getWindowPosBound = async (windowPos: WindowPosition): Promise<WindowPosition> => {
  let screen = (await chrome.system.display.getInfo())[0]?.bounds

  if (windowPos && windowPos.top && windowPos.left && windowPos.height && windowPos.width && screen) {
    if (windowPos.top < 0) {
      windowPos.top = 0
    }
    if (windowPos.left + windowPos.width > screen.width) {
      windowPos.left = screen.width - windowPos.width
    }
    if (windowPos.left < 0) {
      windowPos.left = 0
    }
    if (windowPos.top + windowPos.height > screen.height) {
      windowPos.top = screen.height - windowPos.height
    }
  }
  return windowPos
}

export default getWindowPosBound