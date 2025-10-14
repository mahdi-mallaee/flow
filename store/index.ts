import backupStore from "./backups/store"
import sessionsStore from "./sessions/store"
import windowsStore from "./window/store"
import settingsStore from "./settings/store"
import { Storage as PlasmoStorage } from "@plasmohq/storage"
import type { StorageArea } from "~utils/types"

class Store {
  area: StorageArea = "local"
  private store!: PlasmoStorage
  private static instance: Store | null = null
  private inited = false

  private constructor() { }

  async init() {
    if (this.inited) return

    const settings = await Store.settings.getAll()
    if (settings?.storageArea) this.area = settings.storageArea

    this.store = new PlasmoStorage({ area: this.area })
    this.inited = true
  }

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store()
    }
    return Store.instance
  }

  static getStore() {
    if (!Store.getInstance().inited) {
      Store.getInstance().init()
      return
    }

    return Store.getInstance().store

  }

  static async setArea(area: StorageArea) {
    if (area === Store.getInstance().area) return
    await Store.settings.set({ storageArea: area })
    chrome.runtime.reload()
  }

  static sessions = sessionsStore
  static settings = settingsStore
  static backups = backupStore
  static windows = windowsStore
}



export default Store
