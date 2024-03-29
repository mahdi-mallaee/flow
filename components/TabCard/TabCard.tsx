import type { Tab } from "~utils/types"

import './TabCard.scss'

const TabCard = ({ tab }: { tab: Tab }) => {
  return (
    <div className="tab-card">
      <img src={tab.iconUrl} />
      <div className="info">
        <div className="title">{tab.title || tab.url}</div>
        <div className="url">{tab.url}</div>
      </div>
    </div>
  )
}

export default TabCard