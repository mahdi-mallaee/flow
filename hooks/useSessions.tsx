import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import Store from "~store"
import { StoreKeys, type Session } from "~utils/types"

const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([])

  const [statusId] = useStorage({ instance: new Storage({ area: 'local' }), key: StoreKeys.sessionsStatusId }, '')

  useEffect(() => {
    Store.sessions.getAll()
      .then(response => {
        setSessions(response)
      })
  }, [statusId])

  return sessions
}

export default useSessions