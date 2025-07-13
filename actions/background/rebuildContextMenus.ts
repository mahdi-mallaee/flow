import store from "~store";
import type { Session } from "~utils/types";

const PARENT_ID = "move-to-session";

async function rebuildContextMenus() {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: PARENT_ID,
    title: "Move to session",
    contexts: ["all"]
  });

  const sessions: Session[] = await store.sessions.getAll()

  sessions.forEach((session: Session) => {
    chrome.contextMenus.create({
      id: `move-${session.id}`,
      parentId: PARENT_ID,
      title: session.title,
      contexts: ["all"]
    });
  });
}

export default rebuildContextMenus