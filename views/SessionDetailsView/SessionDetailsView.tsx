import useSessions from "~hooks/useSessions"
import './SessionDetailsView.scss'
import { useParams } from "~node_modules/react-router/dist"

const SessionDetailsView = () => {
  const { id } = useParams()
  const session = useSessions().find(s => s.id == id)

  return (
    <div className="search-view">
      <div className='view-title session-title '>
        {session?.title}
      </div>

      {session?.tabs?.map(t => {
        return <div key={t.id || t.index}>{t.title}</div>
      })}

    </div>
  )
}

export default SessionDetailsView