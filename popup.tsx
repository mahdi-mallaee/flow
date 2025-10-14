// popup/index.tsx (Plasmo entry)
import "./index.scss"
import { useEffect, useState } from "react"
import browser from "webextension-polyfill"
import Store from "~store"
(globalThis as any).chrome = browser
import IndexPopup from "~views/IndexPopup"

export default function PopupBootstrap() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    Store.getInstance().init()
      .then(() => mounted && setReady(true))
      .catch((err) => {
        console.error("Failed to initialize Store before rendering popup:", err)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) return null

  return <IndexPopup />
}
