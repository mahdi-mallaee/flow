## Hey there!

### ***Flow*** is a chrome extension for keeping your tabs and windows clean.

### In this file I explain:
- how to start the project 
- what it can do 
- how it's made
- what's the logic behind

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
I used plasmo for hot reloading and also it's storage api for data sync between background and popup scripts and it's other cool features like out of pocket react and typescript support and automatic manifest  builds.

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
Flow is the best way to organize your tabs and windows in Chrome and access them whenever you want. It is simple, fast, and reliable.

You need Flow if you have too many tabs and windows open in Chrome and feel overwhelmed by them or want to close a window without worry of losing your journey.

• Flow allows you to create and save sessions that represent a window in Chrome.
• You can open a session anytime and it will create a new window with the saved tabs. 
• You can also see the open windows as unsaved sessions and save them as new sessions.
• You can backup your sessions manually or automatically and restore them if you lose them. 
• You can also set a main session that will always open when you start Chrome, regardless of the last closed window.

Wil be thankful of your feedbacks for improving.

### Refrences
<a href="https://docs.plasmo.com/">Plasmo Docs</a>

<a href="https://www.framer.com/motion/">Framer Motion Docs</a>