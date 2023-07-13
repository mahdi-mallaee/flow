export type Session = {
    id: string,
    windowId: number,
    tabs: Tab[],
    title: string,
    main: boolean
}

export type Tab = {
    id: number,
    url: string,
    windowId: number,
    index: number,
    groupId: number,
}

export type AlertMessage = {
    show: boolean,
    text: string,
    type: 'error' | 'warning' | 'info'
}