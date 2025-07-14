import faviconURL from "~utils/faviconUrl"
import type { Tab } from "~utils/types"
import './TabItem.scss'

const TabItem = ({ tab, onClick, selected }: { tab: Tab, onClick: () => void, selected?: boolean }) => {
  return (
    <div
      className={selected ? "tab-item selected" : "tab-item"}
      onClick={onClick}>
      <img src={faviconURL(tab.url)} />
      <div className="tab-details-container">
        <div className="title">{tab.title || tab.url}</div>
        <div className="url">{tab.url}</div>
      </div>
    </div>
  )
}

export default TabItem