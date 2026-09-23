# Manual Testing Checklist: Flow Extension

This checklist guides manual quality assurance across Chrome MV3 and Firefox MV3 for all core flows, background lifecycles, and recent optimizations.

---

## 1. Extension Loading & Service Worker Lifecycle

### 1.1 Fresh Installation & Startup
- [ ] **Load Unpacked (Chrome)**:
  - Navigate to `chrome://extensions`, enable *Developer mode*, and click *Load unpacked*.
  - Select `build/chrome-mv3-dev` (or `build/chrome-mv3-prod`).
  - Verify extension loads with zero background console errors.
  - Verify the welcome/landing page opens on initial install.
- [ ] **Load Temporary Add-on (Firefox)**:
  - Navigate to `about:debugging#/runtime/this-firefox` and click *Load Temporary Add-on...*.
  - Select `build/firefox-mv3-prod/manifest.json`.
  - Verify the service worker starts without `chrome.tabGroups is undefined` errors.
- [ ] **Context Menus**:
  - Right-click any web page or tab.
  - Verify the "Move to session..." context menu entries appear.
  - Verify no duplicate entries appear after browser restart or extension reload.
- [ ] **Browser Restart & First Session**:
  - Close all browser windows and relaunch the browser.
  - Verify that the designated "Main" session (or default session) reopens if configured.
  - Check background console: verify no unhandled promise rejections on startup.

---

## 2. Tab & Session Tracking (Coalesced `refreshTabs`)

### 2.1 Tab Creation, Closing & Movement
- [ ] **Rapid Tab Opening**:
  - Open 10–15 tabs in quick succession (`Ctrl+T` held down).
  - Open Flow popup/sidepanel: verify all tabs are captured with their accurate count, URLs, and icons.
  - Verify in DevTools that storage writes were coalesced into minimal passes rather than 15 separate sequential writes.
- [ ] **Rapid Tab Closing**:
  - Close 5 tabs rapidly (`Ctrl+W` repeatedly).
  - Verify session tab list updates immediately with zero missing or ghost tabs.
- [ ] **Tab Reordering & Pinning**:
  - Drag a tab to a new position.
  - Pin and unpin a tab.
  - Verify tab order and pinned state reflect accurately in the Flow session view.

### 2.2 Title & Attribute Filtering (Starvation Test)
- [ ] **Dynamic Title Updates (Music / Chat)**:
  - Open a tab with dynamic titles (e.g., YouTube video playing, Spotify web player, or a chat app with unread counter).
  - Let it play/update for 30–60 seconds while interacting with other tabs.
  - Verify Flow persists session state normally and does **not** experience save freezes or timer starvation.
- [ ] **Interim Loading Titles**:
  - Open heavy websites (e.g., Reddit, Twitter/X, News sites).
  - Verify tabs show their final resolved title and favicon once loaded, without flickering interim states.

### 2.3 Session Window Actions
- [ ] **Open Session in New Window**:
  - Click on a closed session in the popup.
  - Verify a new window opens containing all tabs in that session.
  - If tab groups exist, verify groups are restored with matching titles and colors (on Chrome).
- [ ] **Session Freeze**:
  - Click the snowflake (freeze) icon on an active session.
  - Open new tabs in that window or close existing ones.
  - Verify the frozen session's stored tab list remains unchanged.
  - Unfreeze the session and verify it synchronizes with current window state.
- [ ] **Window Position Restore**:
  - Enable *Save window positions* in *Additional Settings* (grant *Display* permission when prompted).
  - Move/resize a session window to a distinct position (e.g. half-screen).
  - Close the session window and reopen it.
  - Verify the window restores to the exact same screen coordinates and dimensions.

---

## 3. Unsaved Windows Management

- [ ] **Detection of New Windows**:
  - Open a brand-new regular browser window (`Ctrl+N`).
  - Open Flow popup in that window or another window.
  - Verify "Unsaved Windows" section displays `Unsaved Window (<windowId>)` with accurate tab count.
  - Verify the current active window is visually highlighted (e.g. with `.current` border).
- [ ] **Add Window as Session**:
  - Click the **Add +** button on the unsaved window card.
  - Verify the window converts into a saved session.
  - Verify it moves out of "Unsaved Windows" and into "Sessions" with default color and title.
- [ ] **Window Close Cleanup**:
  - Close an unsaved window.
  - Verify its entry disappears from "Unsaved Windows" without stale ghost entries remaining.

---

## 4. Backups & Storage Architecture

### 4.1 Manual Backup Creation
- [ ] **Create Backup**:
  - Go to *Backups* view.
  - Click **Create new backup**, type a title (or press Enter for default timestamp).
  - Verify the new backup card appears immediately at the top of the list.
- [ ] **Backup Limit Enforcement**:
  - Verify the informational notice states the limit (e.g. 5 backups).
  - Create backups past the limit and verify the oldest backup is cleanly rotated out.

### 4.2 Backup Upload & Validation
- [ ] **Valid Flow Backup Upload**:
  - Download an existing backup to JSON.
  - Click *Upload A Local Backup* and select the JSON file.
  - Verify the success message *"Backup uploaded successfully"* appears.
  - Verify the uploaded backup appears in the backup list.
- [ ] **Corrupt / Invalid File Upload**:
  - Create a dummy `.json` file containing `{ "foo": "bar" }` or arbitrary text.
  - Upload the file.
  - Verify an error alert appears: *"Your backup file has a problem"* and no corrupted entry is created in storage.

### 4.3 Backup Restore & Download
- [ ] **Download Backup**:
  - Click the download icon on a backup card.
  - Verify a `.json` file downloads.
  - Verify in DevTools memory/network that the created object URL is revoked cleanly.
- [ ] **Load / Restore Backup**:
  - Click **Load** on a backup card.
  - Confirm the restore dialog.
  - Verify sessions from the backup are imported and visible in the Sessions tab.

### 4.4 Automated Alarms (MV3)
- [ ] **Auto-Backup Interval Setting**:
  - Go to *Settings* $\to$ *Backups*.
  - Change the auto-backup interval to a non-zero value (e.g., 10 minutes).
  - In `chrome://extensions`, inspect the background service worker console.
  - Run in console: `chrome.alarms.getAll(console.log)`
  - Verify an alarm named `"flow-auto-backup"` exists with `periodInMinutes: 10`.
  - Set the interval to `Never` / `0` and verify `chrome.alarms.getAll(console.log)` shows the alarm was cleared.

### 4.5 Bulk Deletion
- [ ] **Delete All Backups**:
  - Click **Delete All Backups**.
  - Verify confirmation prompt appears: *"This action is irreversible. Are you sure?"*.
  - Click checkmark $\checkmark$ to confirm.
  - Verify all backup cards are removed smoothly with exit animation.

---

## 5. UI Views, Layouts & Interactions

### 5.1 Side Panel (`tabs/sidepanel.tsx`)
- [ ] **Side Panel View**:
  - Open Chrome Side Panel and switch to Flow (or open `chrome-extension://<id>/tabs/sidepanel.html`).
  - Verify that the bottom of the sidepanel contains **no stray "2" character** (regression check).
  - Switch tabs between `Tabs`, `Sessions`, and `Settings`.
  - In `Tabs` mode, right-click a tab item to trigger context menu. Verify menu repositions near click and closes on outside click or window blur.

### 5.2 Search View
- [ ] **Empty Search State**:
  - Click the Search icon in the header.
  - Verify input is focused.
  - Verify that **"Could not find anything!" is NOT displayed** while the search input is still empty (regression check).
- [ ] **Active Search**:
  - Type a query matching existing tab titles or URLs.
  - Verify matching sessions and tabs render correctly.
  - Click a search result: verify the browser focuses/switches to the corresponding window and tab.
- [ ] **No Results State**:
  - Type a random string (e.g. `xyz123nonsense`).
  - Verify `"Could not find anything!"` appears.

### 5.3 Session Details View
- [ ] **Multi-Tab Selection**:
  - Open a session card $\to$ click the tabs icon to enter *Session Details*.
  - Click individual tabs to toggle selection.
  - Click toolbar count to "Select all" / "Deselect all".
- [ ] **Bulk Actions**:
  - Test *Delete selected tabs*.
  - Test *Open selected tabs* (verify opens either in current window or new window according to settings).
  - Test *Move to another session*: click move icon $\to$ select target session $\to$ verify tabs transfer successfully.

### 5.4 Settings & Permissions View
- [ ] **Settings Toggles**:
  - Toggle *Theme* (Light, Dark, Magical Purple, Deep Blue, OS Default): verify styles update instantly across views.
  - Toggle *Window size* dropdown (Normal, Minimized, Maximized): verify label reads *"Choose the default size to open windows"* (spelling fix).
  - Toggle *Show session badge*: verify extension action badge reflects session initial or `N` for unsaved window.
- [ ] **Optional Permissions View**:
  - Go to *Permissions*.
  - Check description under *History*: verify reads *"cleaning up history after each session opening"* (spelling fix).
  - Toggle *History* permission: verify native browser prompt appears and toggle reflects granted/denied state.
  - Toggle *Downloads* permission: verify native browser prompt appears and toggle reflects state.

---

## 6. Cross-Browser Matrix

| Test Area | Google Chrome (MV3) | Mozilla Firefox (MV3) |
|---|:---:|:---:|
| **Tab Groups** | Groups restore with colors & titles | Tab group calls safely bypassed without errors |
| **Window Positions** | Restores coordinates via `system.display` | Gracefully bypassed if API unsupported |
| **Local File Upload** | Direct file input `<input type="file">` | Pop-up file upload window (`tabs/upload.html`) |
| **Alarms Auto-Backup** | Triggers via `chrome.alarms` | Triggers via `browser.alarms` |
| **Badge Colors / Text** | Sets text and background color | Sets text and background color |
| **Side Panel** | Supported via Chrome Side Panel | Supported via dedicated panel/tab |

---

## 7. Regression & Stress Scenarios

- [ ] **Rapid Multi-Window Stress**:
  - Open 4 browser windows with 5 tabs each.
  - In Flow, convert all 4 into sessions in rapid sequence.
  - Close 2 windows and reopen them from Flow.
  - Verify all 4 sessions remain distinct and correctly populated in storage.
- [ ] **Service Worker Inactivity & Wakeup**:
  - In `chrome://extensions`, observe the service worker entering "Inactive" (after ~30s of idle).
  - Click extension icon or create a new tab.
  - Verify the service worker awakens immediately, processes the event, and updates state without missing tabs.
