import { MdOutlineDelete, MdOutlineEdit, MdOutlinePushPin, MdSearch } from "react-icons/md"
import './Toolbar.scss'

const Toolbar = (
  { title, setSearchInput }:
    { title: string, setSearchInput: React.Dispatch<React.SetStateAction<string>> }
) => {
  return (
    <div className="toolbar">
      <div className="searchbar">
        <MdSearch />
        <input type="text" placeholder="Search in items ..." onChange={e => setSearchInput(e.target.value)} />
      </div>
      <div className="session-menu">
        <div className="title">{title}</div>
        <div className="buttons">
          <div className="toolbar-button edit-title">
            <MdOutlineEdit />
          </div>
          <div className="toolbar-button set-main-session">
            <MdOutlinePushPin />
            <span>main</span>
          </div>
          <div className="toolbar-button delete-session">
            <MdOutlineDelete />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Toolbar