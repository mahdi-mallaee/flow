import { useEffect, useMemo, useState, type MouseEvent } from "react"
import { BiWindowOpen } from "react-icons/bi"
import {
  MdArrowBack,
  MdChevronRight,
  MdClose,
  MdExpandMore,
  MdLayersClear,
  MdOutlineDelete,
  MdPublic,
  MdTune
} from "react-icons/md"
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom"
import browser from "webextension-polyfill"
import actions from "~actions"
import BatchActionBar from "~components/BatchActionBar"
import Logo from "~components/Logo"
import Sidebar from "~components/Sidebar"
import TabCard from "~components/TabCard"
import TabSearchResults from "~components/tabSearchResults"
import ThemeProvider from "~components/ThemeProvider"
import Toolbar from "~components/Toolbar"
import useAlertMessage from "~hooks/useAlertMessage"
import useSessions from "~hooks/useSessions"
import store from "~store"
import type { Session, Tab, TabGroup, UnsavedWindow } from "~utils/types"
import AboutUsView from "~views/AboutUsView"
import AdditionalSettingsView from "~views/AdditionalSettingsView"
import BackupsView from "~views/BackupsView"
import DonationView from "~views/DonationView"
import PermissionsView from "~views/PermissionsView"
import SettingsView from "~views/SettingsView"
import "./sessions.scss"

;(globalThis as any).chrome = browser

const SessionsTabPage = () => {
  const sessions = useSessions()
  const { showAlert, renderAlert } = useAlertMessage()

  const [selectedSessionId, setSelectedSessionId] = useState<string>("")
  const [searchInput, setSearchInput] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false)
  const [selectedTabIds, setSelectedTabIds] = useState<number[]>([])
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<number[]>([])
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [draggedTab, setDraggedTab] = useState<Tab | null>(null)
  const [dragOverTabId, setDragOverTabId] = useState<number | null>(null)
  const [dragOverGroupId, setDragOverGroupId] = useState<number | null>(null)
  const [dragOverUngrouped, setDragOverUngrouped] = useState<boolean>(false)

  // Derive active session reactively
  const selectedSession = useMemo(() => {
    if (!sessions || sessions.length === 0) return undefined
    return sessions.find((s) => s.id === selectedSessionId) || sessions[0]
  }, [sessions, selectedSessionId])

  // Sync initial selected session on load
  useEffect(() => {
    if (!selectedSessionId && sessions.length > 0) {
      chrome.windows.getCurrent().then((window) => {
        if (actions.window.checkId(window.id)) {
          const matching = sessions.find((s) => s.windowId === window.id)
          setSelectedSessionId(matching ? matching.id : sessions[0].id)
        } else {
          setSelectedSessionId(sessions[0].id)
        }
      })
    }
  }, [sessions, selectedSessionId])

  // Clear selected tabs when changing active session
  useEffect(() => {
    setSelectedTabIds([])
  }, [selectedSessionId])

  // --- Session Handlers ---
  const handleSelectSession = (session: Session) => {
    setSelectedSessionId(session.id)
    setSearchInput("")
  }

  const handleCreateSession = async (title: string) => {
    const checkLimit = await actions.session.checkNumberLimit()
    if (!checkLimit) {
      showAlert({
        text: "You have reached the maximum session limit!",
        type: "warning"
      })
      return
    }

    const sessionTitle = title.trim() || new Date().toLocaleString()
    const duplicate = sessions.some(
      (s) => s.title.toLowerCase() === sessionTitle.toLowerCase()
    )
    if (duplicate) {
      showAlert({
        text: "A session with this name already exists",
        type: "warning"
      })
      return
    }

    const result = await actions.session.create({ title: sessionTitle })
    if (result) {
      showAlert({ text: "Session created successfully", type: "info" })
      const updated = await store.sessions.getAll()
      const created = updated.find((s) => s.title === sessionTitle)
      if (created) setSelectedSessionId(created.id)
    } else {
      showAlert({ text: "Failed to create session", type: "error" })
    }
  }

  const handleSaveUnsavedWindow = async (window: UnsavedWindow) => {
    const checkLimit = await actions.session.checkNumberLimit()
    if (!checkLimit) {
      showAlert({
        text: "You have reached the maximum session limit!",
        type: "warning"
      })
      return
    }

    const result = await actions.session.create({ windowId: window.id })
    if (result) {
      showAlert({ text: "Saved window as new session", type: "info" })
      await actions.window.refreshUnsavedWindows()
      await actions.session.refreshOpenSessions()
      const updated = await store.sessions.getAll()
      const created = updated.find((s) => s.windowId === window.id)
      if (created) setSelectedSessionId(created.id)
    } else {
      showAlert({ text: "Failed to save window as session", type: "error" })
    }
  }

  const handleRenameSession = async (id: string, newTitle: string) => {
    const duplicate = sessions.some(
      (s) => s.id !== id && s.title.toLowerCase() === newTitle.toLowerCase()
    )
    if (duplicate) {
      showAlert({
        text: "A session with this name already exists",
        type: "warning"
      })
      return
    }

    const result = await store.sessions.basicUpdate(id, { title: newTitle })
    if (result) {
      showAlert({ text: "Session renamed", type: "info" })
      actions.background.rebuildContextMenus()
    }
  }

  const handleColorChange = async (id: string, colorCode: number) => {
    await store.sessions.basicUpdate(id, { colorCode })
  }

  const handleToggleMain = async () => {
    if (!selectedSession) return
    await store.sessions.basicUpdate(selectedSession.id, {
      main: !selectedSession.main
    })
  }

  const handleToggleFreeze = async () => {
    if (!selectedSession) return
    const newFreeze = !selectedSession.freeze
    await store.sessions.setOpenStatus(selectedSession.id, {
      freeze: newFreeze
    })
    await actions.session.refreshTabs()
    showAlert({
      text: newFreeze
        ? "Session frozen (protected from auto-overwrites)"
        : "Session unfrozen",
      type: "info"
    })
  }

  const handleOpenSession = async (sessionToOpen?: Session) => {
    const target = sessionToOpen || selectedSession
    if (!target) return

    if (target.isOpen && actions.window.checkId(target.windowId)) {
      await chrome.windows.update(target.windowId, { focused: true })
    } else {
      await actions.session.open(target.id)
    }
  }

  const handleCloseSessionWindow = async () => {
    if (selectedSession?.isOpen && actions.window.checkId(selectedSession.windowId)) {
      await chrome.windows.remove(selectedSession.windowId)
    }
  }

  const handleDeleteSessionConfirm = async () => {
    if (!sessionToDelete) return
    const settings = await store.settings.getAll()

    if (settings.createBackupBeforeSessionDelete) {
      await actions.backup.create({
        status: "before deleting session",
        relatedItem: {
          title: sessionToDelete.title,
          type: "session"
        }
      })
    }

    await store.sessions.remove(sessionToDelete.id)
    actions.window.refreshUnsavedWindows()
    showAlert({
      text: `Deleted session "${sessionToDelete.title}"`,
      type: "info"
    })
    setSessionToDelete(null)

    if (selectedSessionId === sessionToDelete.id) {
      const remaining = sessions.filter((s) => s.id !== sessionToDelete.id)
      if (remaining.length > 0) setSelectedSessionId(remaining[0].id)
    }
  }

  // --- Tab Handlers ---
  const handleTabCardClick = async (tab: Tab) => {
    if (!selectedSession) return

    if (selectedSession.isOpen) {
      if (actions.window.checkId(selectedSession.windowId)) {
        await chrome.windows.update(selectedSession.windowId, { focused: true })
      }
      if (tab.id && tab.id > 0) {
        await chrome.tabs.update(tab.id, { active: true })
      }
    } else {
      await actions.session.open(
        selectedSession.id,
        false,
        undefined,
        tab.index
      )
    }
  }

  const handleCloseTab = async (tab: Tab, e: MouseEvent) => {
    e.stopPropagation()
    if (!selectedSession) return

    if (selectedSession.isOpen && tab.id && tab.id > 0) {
      await chrome.tabs.remove(tab.id)
    } else {
      const newTabs = selectedSession.tabs.filter((t) => t.id !== tab.id)
      await store.sessions.setTabs(selectedSession.id, newTabs)
    }
  }

  const handleToggleSelectTab = (tab: Tab) => {
    setSelectedTabIds((current) => {
      if (current.includes(tab.id)) {
        return current.filter((id) => id !== tab.id)
      } else {
        return [...current, tab.id]
      }
    })
  }

  const handleSelectAllTabs = () => {
    if (!selectedSession) return
    setSelectedTabIds(selectedSession.tabs.map((t) => t.id))
  }

  const handleClearSelection = () => {
    setSelectedTabIds([])
    setIsSelectMode(false)
  }

  const handleBatchDeleteTabs = async () => {
    if (!selectedSession || selectedTabIds.length === 0) return

    if (selectedSession.isOpen) {
      await chrome.tabs.remove(selectedTabIds)
    } else {
      const newTabs = selectedSession.tabs.filter(
        (t) => !selectedTabIds.includes(t.id)
      )
      await store.sessions.setTabs(selectedSession.id, newTabs)
    }

    showAlert({
      text: `Removed ${selectedTabIds.length} tab${
        selectedTabIds.length === 1 ? "" : "s"
      }`,
      type: "info"
    })
    setSelectedTabIds([])
  }

  const handleBatchOpenTabs = async () => {
    if (!selectedSession || selectedTabIds.length === 0) return

    const selectedTabs = selectedSession.tabs.filter((t) =>
      selectedTabIds.includes(t.id)
    )
    const settings = await store.settings.getAll()

    if (settings.openSessionInCurrentWindow) {
      for (const tab of selectedTabs) {
        await chrome.tabs.create({ url: tab.url, active: false })
      }
    } else {
      const windowId = await actions.window.create()
      if (actions.window.checkId(windowId)) {
        await actions.window.update(windowId, selectedTabs, [])
      }
    }
    setSelectedTabIds([])
  }

  const handleBatchMoveTabs = async (targetSessionId: string) => {
    if (!selectedSession || selectedTabIds.length === 0) return

    const movingTabs = selectedSession.tabs.filter((t) =>
      selectedTabIds.includes(t.id)
    )
    await actions.session.moveTabs({
      sourceSession: selectedSession,
      targetSession: targetSessionId,
      tabs: movingTabs
    })

    const targetSession = sessions.find((s) => s.id === targetSessionId)
    showAlert({
      text: `Moved ${movingTabs.length} tab${
        movingTabs.length === 1 ? "" : "s"
      } to "${targetSession?.title || "target session"}"`,
      type: "info"
    })
    setSelectedTabIds([])
  }

  const toggleGroupCollapse = (groupId: number) => {
    setCollapsedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  // --- Grouped Tabs Partitioning ---
  const groupedData = useMemo(() => {
    if (!selectedSession) return { groups: [], ungroupedTabs: [] }
    const sessionGroups = selectedSession.groups || []
    const tabs = selectedSession.tabs || []

    if (sessionGroups.length === 0) {
      return { groups: [], ungroupedTabs: tabs }
    }

    const groupMap = new Map<number, { group: TabGroup; tabs: Tab[] }>()
    sessionGroups.forEach((g) => {
      groupMap.set(g.id, { group: g, tabs: [] })
    })

    const ungrouped: Tab[] = []

    tabs.forEach((tab) => {
      if (tab.groupId && groupMap.has(tab.groupId)) {
        groupMap.get(tab.groupId)!.tabs.push(tab)
      } else {
        ungrouped.push(tab)
      }
    })

    return {
      groups: Array.from(groupMap.values()),
      ungroupedTabs: ungrouped
    }
  }, [selectedSession])

  // --- Drag and Drop Handlers ---
  const resetDragState = () => {
    setDraggedTab(null)
    setDragOverTabId(null)
    setDragOverGroupId(null)
    setDragOverUngrouped(false)
  }

  const handleReorderAndMoveTab = async (
    draggedTabId: number,
    target: { targetTabId?: number; targetGroupId?: number }
  ) => {
    if (!selectedSession) return
    const tabs = [...(selectedSession.tabs || [])]
    const draggedIndex = tabs.findIndex((t) => t.id === draggedTabId)
    if (draggedIndex === -1) return

    const draggedTabObj = { ...tabs[draggedIndex] }
    const originalGroupId = tabs[draggedIndex].groupId ?? -1
    let targetGroupId = originalGroupId
    let insertIndex = draggedIndex

    if (target.targetTabId !== undefined) {
      const originalTargetIndex = tabs.findIndex((t) => t.id === target.targetTabId)
      if (originalTargetIndex === -1 || originalTargetIndex === draggedIndex) return

      targetGroupId = tabs[originalTargetIndex].groupId ?? -1
      tabs.splice(draggedIndex, 1)

      const newTargetIndex = tabs.findIndex((t) => t.id === target.targetTabId)
      insertIndex = draggedIndex < originalTargetIndex ? newTargetIndex + 1 : newTargetIndex
      draggedTabObj.groupId = targetGroupId
      if (targetGroupId > 0) {
        draggedTabObj.pinned = false
      }
      tabs.splice(insertIndex, 0, draggedTabObj)
    } else if (target.targetGroupId !== undefined) {
      targetGroupId = target.targetGroupId
      draggedTabObj.groupId = targetGroupId
      tabs.splice(draggedIndex, 1)

      if (targetGroupId > 0) {
        draggedTabObj.pinned = false
        let lastGroupTabIndex = -1
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (tabs[i].groupId === targetGroupId) {
            lastGroupTabIndex = i
            break
          }
        }
        if (lastGroupTabIndex !== -1) {
          insertIndex = lastGroupTabIndex + 1
          tabs.splice(insertIndex, 0, draggedTabObj)
        } else {
          tabs.push(draggedTabObj)
          insertIndex = tabs.length - 1
        }
      } else {
        tabs.push(draggedTabObj)
        insertIndex = tabs.length - 1
      }
    }

    const updatedTabs = tabs.map((t, idx) => ({ ...t, index: idx }))
    await store.sessions.setTabs(selectedSession.id, updatedTabs)

    if (selectedSession.isOpen && actions.window.checkId(selectedSession.windowId)) {
      try {
        if (draggedTabObj.id && draggedTabObj.id > 0) {
          if (chrome.tabGroups && chrome.tabs.group && chrome.tabs.ungroup) {
            if (targetGroupId > 0 && targetGroupId !== originalGroupId) {
              if (draggedTabObj.pinned) {
                await chrome.tabs.update(draggedTabObj.id, { pinned: false })
              }
              await chrome.tabs.group({
                tabIds: [draggedTabObj.id],
                groupId: targetGroupId
              })
            } else if (targetGroupId <= 0 && originalGroupId > 0) {
              await chrome.tabs.ungroup([draggedTabObj.id])
            }
          }

          await chrome.tabs.move(draggedTabObj.id, { index: insertIndex })
        }
        await actions.session.refreshGroups()
      } catch (err) {
        // Defensive: ignore browser tab move/group failures
      }
    }
  }

  const handleTabDragStart = (e: React.DragEvent<HTMLDivElement>, tab: Tab) => {
    setDraggedTab(tab)
    e.dataTransfer.setData("text/plain", tab.id.toString())
    e.dataTransfer.effectAllowed = "move"
  }

  const handleTabDragEnd = () => {
    resetDragState()
  }

  const handleTabDragOver = (e: React.DragEvent<HTMLDivElement>, targetTab: Tab) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    if (draggedTab && draggedTab.id !== targetTab.id && dragOverTabId !== targetTab.id) {
      setDragOverTabId(targetTab.id)
    }
  }

  const handleTabDragLeave = (e: React.DragEvent<HTMLDivElement>, targetTab: Tab) => {
    if (dragOverTabId === targetTab.id) {
      setDragOverTabId(null)
    }
  }

  const handleTabDrop = async (e: React.DragEvent<HTMLDivElement>, targetTab: Tab) => {
    e.preventDefault()
    e.stopPropagation()
    const dragged = draggedTab
    resetDragState()
    if (!dragged || dragged.id === targetTab.id) return

    await handleReorderAndMoveTab(dragged.id, { targetTabId: targetTab.id })
  }

  const handleGroupDragOver = (e: React.DragEvent<HTMLDivElement>, groupId: number) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    if (dragOverGroupId !== groupId) {
      setDragOverGroupId(groupId)
    }
  }

  const handleGroupDragLeave = (e: React.DragEvent<HTMLDivElement>, groupId: number) => {
    if (dragOverGroupId === groupId) {
      setDragOverGroupId(null)
    }
  }

  const handleGroupDrop = async (e: React.DragEvent<HTMLDivElement>, groupId: number) => {
    e.preventDefault()
    e.stopPropagation()
    const dragged = draggedTab
    resetDragState()
    if (!dragged) return

    await handleReorderAndMoveTab(dragged.id, { targetGroupId: groupId })
  }

  const handleUngroupedDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    if (!dragOverUngrouped) {
      setDragOverUngrouped(true)
    }
  }

  const handleUngroupedDragLeave = () => {
    setDragOverUngrouped(false)
  }

  const handleUngroupedDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const dragged = draggedTab
    resetDragState()
    if (!dragged) return

    await handleReorderAndMoveTab(dragged.id, { targetGroupId: -1 })
  }

  return (
    <ThemeProvider>
      <div className="sessions-page">
        {renderAlert()}

        <Sidebar
          sessions={sessions}
          selectedSessionId={selectedSession?.id || ""}
          sessionClickHandler={handleSelectSession}
          createSessionHandler={handleCreateSession}
          deleteSessionHandler={(session) => setSessionToDelete(session)}
          openSessionHandler={handleOpenSession}
          saveUnsavedWindowHandler={handleSaveUnsavedWindow}
        />

        <div className="main">
          <div className="header">
            <div className="logo-section">
              <Logo />
              <div className="app-name">Flow</div>
              <span className="app-subtitle">Session Manager</span>
            </div>

            <div className="header-actions">
              <button
                className="header-icon-btn"
                title="Settings"
                onClick={() => setShowSettingsModal(true)}
              >
                <MdTune />
              </button>
            </div>
          </div>

          <Toolbar
            session={selectedSession}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onRenameSession={handleRenameSession}
            onColorChange={handleColorChange}
            onToggleMain={handleToggleMain}
            onToggleFreeze={handleToggleFreeze}
            onOpenSession={() => handleOpenSession()}
            onCloseSessionWindow={handleCloseSessionWindow}
            onDeleteSession={() =>
              selectedSession && setSessionToDelete(selectedSession)
            }
            isSelectMode={isSelectMode}
            onToggleSelectMode={() => setIsSelectMode((v) => !v)}
            viewMode={viewMode}
            onToggleViewMode={() =>
              setViewMode((m) => (m === "grid" ? "list" : "grid"))
            }
          />

          {searchInput ? (
            <TabSearchResults
              sessions={sessions}
              searchInput={searchInput}
              onSelectSession={handleSelectSession}
            />
          ) : (
            <div className="tab-manager-scroll-body">
              {selectedSession ? (
                selectedSession.tabs.length > 0 ? (
                  <div className="tabs-organization-view">
                    {/* Render Tab Groups */}
                    {groupedData.groups.map(({ group, tabs }) => {
                      const isCollapsed = collapsedGroupIds.includes(group.id)
                      return (
                        <div className="tab-group-container" key={group.id}>
                          <div
                            className={`group-header ${
                              dragOverGroupId === group.id ? "drag-over" : ""
                            }`}
                            onClick={() => toggleGroupCollapse(group.id)}
                            onDragOver={(e) => handleGroupDragOver(e, group.id)}
                            onDragLeave={(e) => handleGroupDragLeave(e, group.id)}
                            onDrop={(e) => handleGroupDrop(e, group.id)}
                            style={{
                              borderLeftColor: group.color || "var(--primary-color)"
                            }}
                          >
                            <span className="collapse-arrow">
                              {isCollapsed ? <MdChevronRight /> : <MdExpandMore />}
                            </span>
                            <span
                              className="group-color-dot"
                              style={{
                                backgroundColor: group.color || "var(--primary-color)"
                              }}
                            />
                            <span className="group-title">
                              {group.title || "Unnamed Group"}
                            </span>
                            <span className="group-count">({tabs.length})</span>
                          </div>

                          {!isCollapsed && (
                            <div
                              className={`tabs-container ${
                                viewMode === "list" ? "list-view" : ""
                              }`}
                            >
                              {tabs.map((tab, i) => (
                                <TabCard
                                  key={tab.id || i}
                                  tab={tab}
                                  groupName={group.title}
                                  groupColor={group.color}
                                  isSelected={selectedTabIds.includes(tab.id)}
                                  isSelectMode={
                                    isSelectMode || selectedTabIds.length > 0
                                  }
                                  isDragging={draggedTab?.id === tab.id}
                                  isDragOver={dragOverTabId === tab.id}
                                  onDragStart={handleTabDragStart}
                                  onDragEnd={handleTabDragEnd}
                                  onDragOver={handleTabDragOver}
                                  onDragLeave={handleTabDragLeave}
                                  onDrop={handleTabDrop}
                                  onToggleSelect={handleToggleSelectTab}
                                  onClickHandler={() => handleTabCardClick(tab)}
                                  onCloseHandler={handleCloseTab}
                                  viewMode={viewMode}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Render Ungroup Drop Zone when dragging a grouped tab */}
                    {draggedTab && draggedTab.groupId && draggedTab.groupId > 0 && (
                      <div
                        className={`ungroup-drop-zone ${
                          dragOverUngrouped ? "drag-over" : ""
                        }`}
                        onDragOver={handleUngroupedDragOver}
                        onDragLeave={handleUngroupedDragLeave}
                        onDrop={handleUngroupedDrop}
                      >
                        <MdLayersClear />
                        <span>Drop here to remove from group</span>
                      </div>
                    )}

                    {/* Render Ungrouped Tabs */}
                    {groupedData.ungroupedTabs.length > 0 && (
                      <div
                        className={`ungrouped-container ${
                          dragOverUngrouped ? "drag-over" : ""
                        }`}
                        onDragOver={handleUngroupedDragOver}
                        onDragLeave={handleUngroupedDragLeave}
                        onDrop={handleUngroupedDrop}
                      >
                        {groupedData.groups.length > 0 && (
                          <div className="ungrouped-header">
                            Ungrouped Tabs ({groupedData.ungroupedTabs.length})
                          </div>
                        )}
                        <div
                          className={`tabs-container ${
                            viewMode === "list" ? "list-view" : ""
                          }`}
                        >
                          {groupedData.ungroupedTabs.map((tab, i) => (
                            <TabCard
                              key={tab.id || i}
                              tab={tab}
                              isSelected={selectedTabIds.includes(tab.id)}
                              isSelectMode={
                                isSelectMode || selectedTabIds.length > 0
                              }
                              isDragging={draggedTab?.id === tab.id}
                              isDragOver={dragOverTabId === tab.id}
                              onDragStart={handleTabDragStart}
                              onDragEnd={handleTabDragEnd}
                              onDragOver={handleTabDragOver}
                              onDragLeave={handleTabDragLeave}
                              onDrop={handleTabDrop}
                              onToggleSelect={handleToggleSelectTab}
                              onClickHandler={() => handleTabCardClick(tab)}
                              onCloseHandler={handleCloseTab}
                              viewMode={viewMode}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-tabs-state">
                    <MdPublic className="empty-icon" />
                    <div className="empty-title">This session has no tabs</div>
                    <div className="empty-desc">
                      Open this session in a browser window to start adding tabs.
                    </div>
                    <button
                      className="open-empty-session-btn"
                      onClick={() => handleOpenSession()}
                    >
                      <BiWindowOpen />
                      <span>Open Window</span>
                    </button>
                  </div>
                )
              ) : (
                <div className="no-session-selected-state">
                  <div className="empty-title">No Sessions Found</div>
                  <div className="empty-desc">
                    Create your first session from the sidebar to get started.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Floating Batch Action Bar */}
          {selectedTabIds.length > 0 && selectedSession && (
            <BatchActionBar
              selectedTabs={selectedSession.tabs.filter((t) =>
                selectedTabIds.includes(t.id)
              )}
              totalTabsCount={selectedSession.tabs.length}
              allSessions={sessions}
              currentSessionId={selectedSession.id}
              onSelectAll={handleSelectAllTabs}
              onClearSelection={handleClearSelection}
              onDeleteSelected={handleBatchDeleteTabs}
              onOpenSelected={handleBatchOpenTabs}
              onMoveToSession={handleBatchMoveTabs}
            />
          )}
        </div>

        {/* Delete Session Confirmation Modal */}
        {sessionToDelete && (
          <div
            className="modal-backdrop"
            onClick={() => setSessionToDelete(null)}
          >
            <div
              className="modal-content delete-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <span className="modal-title">Delete Session</span>
                <button
                  className="modal-close-btn"
                  onClick={() => setSessionToDelete(null)}
                >
                  <MdClose />
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete session &quot;
                <strong>{sessionToDelete.title}</strong>&quot; containing{" "}
                <strong>{sessionToDelete.tabs.length}</strong> tab
                {sessionToDelete.tabs.length === 1 ? "" : "s"}?
              </div>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setSessionToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn danger"
                  onClick={handleDeleteSessionConfirm}
                >
                  <MdOutlineDelete />
                  <span>Delete Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div
            className="modal-backdrop"
            onClick={() => setShowSettingsModal(false)}
          >
            <div
              className="modal-content settings-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <MemoryRouter initialEntries={["/settings"]}>
                <SettingsModalContent
                  onClose={() => setShowSettingsModal(false)}
                />
              </MemoryRouter>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

const SettingsModalContent = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation()
  const nav = useNavigate()

  const isSubPage =
    location.pathname !== "/" && location.pathname !== "/settings"

  const getTitle = () => {
    switch (location.pathname) {
      case "/additional-settings":
        return "Additional Settings"
      case "/backups":
        return "Backups"
      case "/permissions":
        return "Permissions"
      case "/about-us":
        return "About Us"
      case "/donation":
        return "Donation"
      default:
        return "Settings"
    }
  }

  return (
    <>
      <div className="modal-header">
        <div className="modal-title-area">
          {isSubPage && (
            <button
              className="modal-back-btn"
              onClick={() => nav("/settings")}
              title="Back to Settings"
            >
              <MdArrowBack />
            </button>
          )}
          <span className="modal-title">{getTitle()}</span>
        </div>
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <MdClose />
        </button>
      </div>
      <div className="settings-modal-body">
        <Routes>
          <Route path="/" element={<SettingsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route
            path="/additional-settings"
            element={<AdditionalSettingsView />}
          />
          <Route path="/backups" element={<BackupsView />} />
          <Route path="/permissions" element={<PermissionsView />} />
          <Route path="/about-us" element={<AboutUsView />} />
          <Route path="/donation" element={<DonationView />} />
        </Routes>
      </div>
    </>
  )
}

export default SessionsTabPage