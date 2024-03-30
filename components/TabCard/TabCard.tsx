import type { Session, Tab } from "~utils/types"

import './TabCard.scss'
import actions from "~actions"

const TabCard = ({ tab, session }: { tab: Tab, session: Session }) => {

  const tabCardClickHandler = async () => {
    if (session.isOpen) {
      chrome.windows.update(tab.windowId, { focused: true, })
      chrome.tabs.update(tab.id, { active: true, })
    } else {
      const newSession = await actions.session.open(session.id, tab.index)
      chrome.windows.update(newSession.windowId, { focused: true, })
      chrome.tabs.update(newSession.tabs[tab.index].id, { active: true, })
    }
  }
  return (
    <div className="tab-card" onClick={tabCardClickHandler}>
      <img src={tab.iconUrl} />
      <div className="info">
        <div className="title">{tab.title || tab.url}</div>
        <div className="url">{tab.url}</div>
      </div>
    </div>
  )
}

export default TabCard