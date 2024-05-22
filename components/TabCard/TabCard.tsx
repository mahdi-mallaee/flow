import type { Tab } from "~utils/types"

import './TabCard.scss'
import type React from "react"
import type { ReactNode } from "react"

const TabCard = (
  { tab, title, url, onClickHandler }:
    { tab: Tab, title?: ReactNode, url?: ReactNode, onClickHandler: () => void }
) => {

  return (
    <div className="tab-card" onClick={onClickHandler}>
      <img src={tab.iconUrl || ''} />
      <div className="info">
        <div className="title">{title || tab.title || tab.url || ''}</div>
        <div className="url">{url || tab.url || ''}</div>
      </div>
    </div>
  )
}

export default TabCard