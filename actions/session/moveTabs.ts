import store from "~store";
import type { Session, Tab } from "~utils/types";

interface MoveTabsOptions {
  sourceSession?: Session;
  targetSession: Session | string;
  tabs: Tab | Tab[];
  mode?: "context" | "popup"
}

const moveTabs = async ({ sourceSession, targetSession, tabs, mode = "popup" }: MoveTabsOptions) => {

  if (typeof targetSession === 'string') {
    targetSession = (await store.sessions.getAll()).find(s => s.id === targetSession)
  }

  if (!(tabs instanceof Array)) {
    tabs = [tabs]
  }

  if (mode === "context") {
    if (targetSession.isOpen) {
      await chrome.tabs.move(tabs.map(t => t.id), { windowId: targetSession.windowId, index: -1 });
      await chrome.windows.update(targetSession.windowId, { focused: true });
    } else {
      await store.sessions.setTabs(targetSession.id, [...targetSession.tabs, ...tabs]);
      await chrome.tabs.remove(tabs.map(t => t.id));
    }

  }

  if (mode === "popup") {
    if (sourceSession.isOpen && targetSession.isOpen) {
      await chrome.tabs.move(tabs.map(t => t.id), { windowId: targetSession.windowId, index: -1 });
      await chrome.windows.update(targetSession.windowId, { focused: true });

    } else if (sourceSession.isOpen && !targetSession.isOpen) {
      await store.sessions.setTabs(targetSession.id, [...targetSession.tabs, ...tabs]);
      await chrome.tabs.remove(tabs.map(t => t.id));

    } else if (!sourceSession.isOpen && targetSession.isOpen) {
      tabs.forEach(async tab => {
        await chrome.tabs.create({ url: tab.url, active: false, windowId: targetSession.windowId });
      });
      await store.sessions.setTabs(sourceSession.id, sourceSession.tabs.filter(t => !tabs.some(tab => tab.id === t.id)));

    } else if (!sourceSession.isOpen && !targetSession.isOpen) {
      await store.sessions.setTabs(targetSession.id, [...targetSession.tabs, ...tabs]);
      await store.sessions.setTabs(sourceSession.id, sourceSession.tabs.filter(t => !tabs.some(tab => tab.id === t.id)));
    }
  }
}

export default moveTabs;  