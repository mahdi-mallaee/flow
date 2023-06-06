export type Session = {
    id: string,
    windowId: number,
    tabs: Tab[],
    title: string
}

export type Tab = {
    id: number,
    url: string,
    windowId: number,
    index: number,
    groupId: number,
}