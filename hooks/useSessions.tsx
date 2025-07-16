import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import store from "~store"
import { StoreKeys, type Session } from "~utils/types"

/*
  statusId changes after setting something in storage related to sessions as
  sessions are in three different parts so useEffect detects the statusId change
  and this hook refreshes sessions for usage in UI
*/

const useSessions = (onSessionChange?: (sessions: Session[]) => void) => {
  const [sessions, setSessions] = useState<Session[]>([])

  const [statusId] = useStorage({ instance: new Storage({ area: 'local' }), key: StoreKeys.sessionsStatusId }, '')

  useEffect(() => {
    store.sessions.getAll()
      .then(response => {
        setSessions(response)
        if (onSessionChange) {
          onSessionChange(response)
        }
      })
  }, [statusId])

  return sessions
}

export default useSessions