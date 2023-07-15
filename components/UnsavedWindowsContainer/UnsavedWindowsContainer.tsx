import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { MdAdd } from "react-icons/md"
import createNewSession from "~actions/createNewSession"
import refreshUnsavedWindows from "~storage/refreshUnsavedWindows"
import type { Session } from "~utils/types"
import './UnsavedWindowsContainer.scss'

const UnsavedWindowsContainer = ({ sessions, setSessions }: { sessions: Session[], setSessions: Function }) => {
    const [unsavedWindows] = useStorage<chrome.windows.Window[]>({
        key: "unsaved-windows",
        instance: new Storage({
            area: "local"
        })
    }, [])

    const addAsSessionButtonClickHandler = async (window: chrome.windows.Window) => {
        const newSession = await createNewSession(window.id)
        await setSessions(current => { return [...current, newSession] })
        refreshUnsavedWindows([...sessions, newSession])
    }

    return (
        <>
            {unsavedWindows.length >= 1 &&
                <>
                    <div className="unsaved-windows-title">Unsaved Windows</div>

                    <div className="unsaved-windows-container">
                        {unsavedWindows.map(window => {
                            return <div key={window.id} className='unsaved-window'>
                                <div className="title">Unsaved Window ( {window.id} )</div>
                                <div className='add-as-session-button' onClick={() => { addAsSessionButtonClickHandler(window) }}>
                                    Add<MdAdd />
                                </div>
                            </div>
                        })}
                    </div></>
            }
        </>
    )
}

export default UnsavedWindowsContainer