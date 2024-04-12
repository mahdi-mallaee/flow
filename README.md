## Hey there!

### ***Flow*** is a chrome extension for keeping your tabs and windows clean.

### In this file I explain:
- how to start the project 
- what it can do 
- how it's made
- what's the logic behind
- Contribution & License

---

### Starting the project
first clone the project
> git clone https://github.com/mahdi-mallaee/future-tabs.git

then install the packages
> pnpm i

dev server command
> npm run dev

building an unpacked chrome extenstion
> npm run build

extension should be loaded in chrome dev mode afterward by clicking on load unpacked button and selecting on of the below directories in extensions page

> ./build/chrome-mv3-dev

> ./build/chrome-mv3-prod

---

### What it can do ( Features )
- making a new session that reperesnts a window in chrome and saving tabs automaticly
- opening the session will create a new chrome window and open saved tabs
- showing open windows as unsaved window for saving them as a new session
- automatic or manual backups
- main session that will open no matter last closed window and also detecting the opened session on startup

---

### How it's made
I used plasmo for hot reloading and also it's storage api for data sync between background and popup scripts and it's other cool features like out of pocket react and typescript support and automatic manifest builds.

For UI i used react and react-router for navigation and framer-motion for animations.

---

### What's the logic behind
first of all background and popup scripts run as different instances.

most of data is saved in local storage so scripts lifecycle doesn't wipe our data.

most important thing that is saved is sessions but for being able to prevent different instances of code to manipulate outdated data, sessions are saved in three parts basicSessions, sessionsOpenStatus and sessionsTabs.

other data are saved normally as their scheme is saved in **types** file.

in popup there is the UI and buttons and all that and after playing with those if something needs to happen it wall call one of the **actions** and their name should tell you what they do. in action file we work with two other api first one is chrome api for manipulating chrome tabs and windows and other one is store api in **store** directory so that means an action doesn't change local storage directly and store api does that. action only works with browser directly and if it needs to save something it calls store api.

all files in **store** directory work directly with local storage for getting and setting data.they make sure data is in correct format and it's not like undefined. as we know sessions are saved in different parts so funtions related to sessions make sure action files get correctly what they requested. also after each store manipulation related to sessions, sessionsStatusId will change and UI will be refreshed with new data. 

data is synced across all instances with plasmo storage api and custom hooks in **hooks** directory.

background script runs after tabs and windows events like onCreated and onRemoved and other ones to refresh saved data.

refreshTabs and refreshUnsavedWindows actions make sure that saved data is updated and fresh so sudden events like browser closing and computer shut downs dont wipe the data.

refreshTabs gets all the tabs from all open windows and save them in their session and refreshUnsavedWindows get all open windows and by comparing their ids to sessions window ids sets usnaved windows.

---

### Chrome Description

webstore link : https://chromewebstore.google.com/detail/flow-tab-manager/ddmmamibgihlgejeklfopeebcnobmfeb

Flow is your ultimate solution for managing tabs and windows in Chrome. Whether you’re a power user or just someone who wants to keep things tidy, Flow streamlines your browsing experience. Here’s why you’ll love it:

Effortless Tab Management
• Create Sessions: Start fresh by initiating a new session. A dedicated Chrome window opens, marking the beginning of your focused browsing journey.
• Automatic Saving: Flow takes care of your tabs in the background. Close a window without hesitation; your tabs are securely saved.
• Resume Seamlessly: Reopen any session whenever you need to pick up where you left off.
• Unsaved Windows: Add any open window to your sessions directly from the ‘Unsaved Windows’ section.

Boost Your Workflow with Additional Features
• Main Session: Designate a session as your ‘Main Session.’ When you launch Chrome, all other windows close, leaving only your essential workstream active.
• Backups: Create local backups of your sessions. Flow auto-generates a backup before deleting any session, ensuring you never lose your work.
• Dark Mode: Enjoy a sleek dark mode that’s easy on the eyes during late-night browsing.
• Resizable Interface: Customize the extension’s size by simply dragging the bottom right corner to fit your screen and preferences.

Why Flow?

• Simplicity: Flow keeps things straightforward.
• Speed: It’s fast and reliable.
• Organization: Say goodbye to tab overload.

Give Flow a try and experience a clutter-free browsing environment. Your feedback is invaluable in making Flow even better!

#tab-manager #session #tab-groups #flow

### Contribution and License
For contibuting see CONTRIBUTION.md file.
This project is licensed under the GPL v3 License - see the LICENSE.md file.

### Refrences
<a href="https://docs.plasmo.com/">Plasmo Docs</a>

<a href="https://www.framer.com/motion/">Framer Motion Docs</a>