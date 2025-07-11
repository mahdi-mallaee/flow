import store from "~store";
import type { Session, Tab } from "~utils/types";

const moveTabs = async (sourceSession: Session, targetSession: Session, tabs: Tab[]) => {
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

  } else {
    await store.sessions.setTabs(targetSession.id, [...targetSession.tabs, ...tabs]);
    await store.sessions.setTabs(sourceSession.id, sourceSession.tabs.filter(t => !tabs.some(tab => tab.id === t.id)));
  }
}

export default moveTabs;  