# AGENTS.md

> **Flow - Tab Manager**  
> Manifest V3 Browser Extension (Chrome & Firefox) built with the [Plasmo framework](https://docs.plasmo.com/), React 19, TypeScript, and SCSS.

This document outlines the architecture, code conventions, operational rules, and development workflows for AI coding agents and contributors working in this codebase.

---

## 1. Tech Stack & Environment

- **Core Framework**: [Plasmo](https://docs.plasmo.com/) (v0.90+) targeting Manifest V3 (MV3)
- **Language**: TypeScript (strict mode, extended from `plasmo/templates/tsconfig.base`)
- **Package Manager**: **`pnpm`** (do **not** use `npm` or `yarn`)
- **UI Library**: React 19 (`react`, `react-dom`)
- **Routing**: `react-router-dom` v7 (in-memory routing via `MemoryRouter` for popups and panels)
- **Animations**: `motion` (Framer Motion v12)
- **Icons**: `react-icons`
- **State & Storage**: `@plasmohq/storage` singleton via `~utils/storageManager` (`localStore`)
- **Cross-Browser Polyfill**: `webextension-polyfill` (`browser` polyfilled to `chrome`)

---

## 2. Essential Commands

Always use `pnpm` for script execution:

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Start Plasmo development server with hot-reloading (`plasmo dev --hoist`) |
| `pnpm build` | Production build for Chrome MV3 (`plasmo build --hoist`) |
| `pnpm firefox` | Production build for Firefox MV3 (`plasmo build --target=firefox-mv3 --hoist`) |
| `pnpm package` | Package production build into `.zip` artifact for Web Store submission |

### Loading the Extension in Browser:
- **Chrome / Chromium**: Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and point to:
  - Development: `./build/chrome-mv3-dev`
  - Production: `./build/chrome-mv3-prod`
- **Firefox**: Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and choose `manifest.json` under `./build/firefox-mv3-prod`.

---

## 3. Architecture & Separation of Concerns

The project follows a strict three-tier architecture with an asynchronous service worker backbone:

```
┌─────────────────────────────────────────────────────────┐
│              UI Layer (Popup, Tabs, Views)              │
│       React Components, Views, Hooks, SCSS Modules      │
└────────────────────────────┬────────────────────────────┘
                             │ calls actions / hooks
┌────────────────────────────▼────────────────────────────┐
│                      Actions Layer                      │
│       Business Logic Orchestration (session, window)    │
└──────────────┬───────────────────────────┬──────────────┘
               │ calls Chrome APIs         │ calls store methods
┌──────────────▼─────────────┐ ┌───────────▼──────────────┐
│        Chrome / Web        │ │       Store Layer        │
│       Extension APIs       │ │    Plasmo Storage Sync   │
└────────────────────────────┘ └──────────────────────────┘
```

### Layer Rules:

1. **UI Layer (`popup.tsx`, `tabs/`, `views/`, `components/`)**:
   - Responsible only for rendering and user input.
   - Reads data reactively via custom hooks (`useSessions`, `useSettings`, `useStorage`).
   - Dispatches user intent **only** by invoking functions from `~actions` or `actions.message`.
   - **NEVER** call `localStore.set` or `chrome.*` mutation APIs directly from UI components.

2. **Actions Layer (`actions/`)**:
   - The business logic orchestrator.
   - Divided by domain: `session`, `window`, `backup`, `message`, `background`.
   - Coordinates browser APIs (`chrome.tabs`, `chrome.windows`, `chrome.tabGroups`, etc.) and `store`.
   - **NEVER** write directly to storage here; always call `store.*` to mutate persistent state.
   - When actions need to survive popup closure, delegate execution to the background script via `actions.message.*`.

3. **Store Layer (`store/`)**:
   - The persistence boundary wrapping `@plasmohq/storage` (`localStore`).
   - Divided by domain: `sessions`, `settings`, `backups`, `window`.
   - Responsible for schema validation, default fallbacks, and storage integrity.
   - Triggers UI reactivity when data changes by incrementing/updating `StoreKeys.sessionsStatusId`.

4. **Background Service Worker (`background.ts`)**:
   - Listens to browser events (`chrome.tabs.*`, `chrome.windows.*`, `chrome.tabGroups.*`, `chrome.contextMenus.*`, `chrome.runtime.*`).
   - Runs in Manifest V3 service worker lifecycle (can be terminated when idle).
   - Any in-memory state (such as `gl: BgGlobalVar`) is ephemeral. Never rely on in-memory variables across service worker restarts.

---

## 4. Critical Architecture: Session Storage Partitioning

Sessions are stored partitioned into **three separate storage keys** in `localStore`:

1. `SessionsKeys.basic` (`basicSessions`): Static session metadata (`id`, `title`, `colorCode`, `main`, `groups`, `windowPos`).
2. `SessionsKeys.open` (`openSessions`): Runtime session state (`isOpen`, `sessionId`, `windowId`, `freeze`).
3. `SessionsKeys.tab` (`sessionsTabs`): Tab arrays (`sessionId`, `tabs`).

> [!IMPORTANT]
> **Why 3 keys?**  
> To eliminate race conditions between the background service worker (updating tabs/window states) and the popup/tabs UI (editing title, color, or order). Always maintain this partitioned storage model when updating session-related logic.
>
> Whenever modifying sessions in `store/sessions`, ensure `refreshSessionStatus()` is called to update `sessionsStatusId`, which triggers reactive re-renders across all active UI components using the `useSessions` hook.

---

## 5. Cross-Browser Compatibility (Chrome & Firefox)

Flow targets both Chrome and Firefox MV3. Agents must observe the following constraints:

- **Unsupported Firefox Permissions**:
  - `tabGroups`, `favicon`, and `system.display` are not supported in Firefox MV3.
  - `plasmo.config.ts` dynamically filters these permissions out for Firefox builds.
- **Defensive API Calls**:
  - Always guard calls to `chrome.tabGroups`:
    ```typescript
    if (chrome.tabGroups) {
      // Chrome-specific tab grouping logic
    }
    ```
  - Use `isFirefox()` from `~utils/isFirefox` when browser-specific branching is required.
- **Polyfill Consistency**:
  - Entry points polyfill global chrome using `webextension-polyfill`:
    ```typescript
    import browser from "webextension-polyfill"
    ;(globalThis as any).chrome = browser
    ```

---

## 6. Code Style & Conventions

All code must strictly align with project Prettier settings (`.prettierrc.cjs`) and existing patterns:

### Formatting Rules
- **Semicolons**: `false` (do not add trailing semicolons in TS/JS files).
- **Quotes**: `false` (use double quotes `"..."` for strings; single quotes only when nesting).
- **Trailing Comma**: `"none"` (no trailing commas in objects or arrays).
- **Indentation**: 2 spaces.
- **Line Width**: 80 characters.

### Import Paths & Ordering
Always use path aliases configured in `tsconfig.json`. **Never use multi-level relative paths like `../../../`**.

- Path alias: `~*` (maps to `./*`)
  - `~actions`
  - `~store`
  - `~utils/...`
  - `~components/...`
  - `~hooks/...`
  - `~views/...`

Import ordering convention:
1. External Plasmo packages (`@plasmohq/...`)
2. Library imports (`react`, `react-router-dom`, etc.)
3. Path-aliased modules (`~actions`, `~store`, `~utils/...`, etc.)
4. Relative imports (`./...`, `../...`)

### Modular File Structure
- **Actions**: Each action lives in its own file under `actions/<domain>/<actionName>.ts`, exporting a default function, re-exported in `actions/<domain>/actions.ts`, and aggregated in `actions/index.ts`.
- **Stores**: Each store operation lives in its own file under `store/<domain>/<operation>.ts`, re-exported in `store/<domain>/store.ts`, and aggregated in `store/index.ts`.
- **Components**: Component folders under `components/<ComponentName>/` containing:
  - `<ComponentName>.tsx`
  - `<ComponentName>.scss`
  - `index.tsx` (re-exporting default)

### Logging & Debugging
- **Never commit raw `console.log` statements.**
- Use the shared logger `logger` from `~utils/logger` (`logger.log`, `logger.warn`, `logger.error`), which automatically strips logs in production builds.

### Type Safety
- Add or update shared data contracts in `~utils/types.ts`.
- Avoid using `any`. Use proper Chrome types (`chrome.tabs.Tab`, `chrome.windows.Window`, etc.) and defined domain models.

---

## 7. Core Workflow & Operational Rules

All AI agents and contributors must adhere strictly to these principles:

1. **Plan $\rightarrow$ Review $\rightarrow$ Implement Flow**:
   - Always plan before modifying code.
   - For non-trivial tasks, provide a clear, concise implementation plan for user review.
   - Wait for approval before executing large or breaking changes.

2. **Incremental Steps & Regular Commits**:
   - Break tasks down into smaller, self-contained, verifiable steps.
   - Test and commit regularly as each step is completed rather than accumulating massive diffs at the end.

3. **Branching for Big Changes**:
   - For large features, major refactorings, or high-risk architectural changes, always create and switch to a new Git branch (e.g. `feature/<name>` or `refactor/<name>`) rather than committing directly onto the active branch.

4. **Leverage Existing Libraries (Avoid Re-inventing the Wheel)**:
   - Do **not** build complex solutions from scratch when well-maintained, mature libraries exist.
   - **Check existing dependencies first**: Inspect `package.json` to leverage already installed tools (e.g., `motion` for animations, `react-router-dom` for navigation, `react-icons` for icons, `@plasmohq/storage` for persistence, `uuid` for IDs, `webextension-polyfill` for cross-browser APIs).
   - If a new library is needed for a feature, explicitly recommend it with clear trade-offs and rationale before adding it.

5. **No Data Schema Changes Without Explicit Confirmation**:
   - **NEVER** alter or extend the data schema (`~utils/types.ts`, storage keys, or partitioned session structures) without explicit user confirmation.
   - Data stored in user browsers must remain backwards-compatible. Any unapproved schema change could cause permanent session or data loss for existing users.

---

## 8. Technical Guardrails

1. **Storage Integrity**: Never modify raw `localStore` keys directly from outside `store/`. Any new state schema must provide fallback values to avoid breaking existing user installations.
2. **Tab & Window Sync**: Be mindful of browser event lifecycles in `background.ts`. Operations that create, close, or reorder tabs trigger Chrome event listeners (`onCreated`, `onRemoved`, `onMoved`, `onUpdated`), which in turn call `refreshTabs` and `refreshUnsavedWindows`. Avoid creating cascading feedback loops.
3. **Verification**: Always run `pnpm build` or build validation before marking changes as complete.
4. **Git Hygiene**: Follow the repository's concise commit convention (e.g., `Simplify action and store exports;` or `Relocate groupTabs to window action;`).

