import { createContext, useContext, useEffect, useState, type ReactNode, type MutableRefObject, useRef } from 'react'
import './Reorder.scss'
import { AnimatePresence } from 'framer-motion'

interface ListProps {
  items: any[],
  onReorder: (items: any[]) => void,
  children?: React.ReactNode,
  scrollRef: MutableRefObject<HTMLDivElement>
}

const itemHeight = 40
const scrollSpeed = 10

const ReorderListContext = createContext({
  dragItemId: "",
  setDragItemId: (id: string) => { },
  y: 0,
  dragConstraint: { top: 0, bottom: 0 },
  reorder: (id: string) => { },
  setItemPos: (id: string, y: number) => { },
  itemHeight
})

export const ReorderList = ({ items, onReorder, children, scrollRef }: ListProps) => {
  const [dragItemId, setDragItemId] = useState("")
  const yRef = useRef(0)
  const [yState, setYState] = useState(0)
  const timeoutRef = useRef(null)
  const itemsPosRef = useRef<{ [key: string]: { y: number } }>({})
  const [dropItemId, setDropItemId] = useState('')


  const handleScroll = () => {
    if (!dragItemId) return

    if (yRef.current > (scrollRef?.current?.clientHeight + scrollRef?.current?.offsetTop - itemHeight)) {
      scrollRef.current.scroll({ top: scrollRef.current.scrollTop + scrollSpeed, behavior: 'smooth' })
    }
    if (yRef.current - scrollRef.current.offsetTop < itemHeight) {
      scrollRef.current.scroll({ top: scrollRef.current.scrollTop - scrollSpeed, behavior: 'smooth' })
    }

    handleReorder()

    timeoutRef.current = setTimeout(() => {
      handleScroll()
    }, 100)
  }

  useEffect(() => {
    if (!dragItemId) {
      clearTimeout(timeoutRef.current)
      return
    } else {
      handleScroll()
    }
  }, [dragItemId])

  useEffect(() => {
    window.addEventListener('pointerup', () => {
      setDragItemId('')
    })
  }, [])

  const reorder = (id: string) => {
    if (!dragItemId || !dropItemId) return

    const newItems = [...items]
    const dragItemIndex = items.findIndex(item => item.id === dragItemId)
    const dropItemIndex = items.findIndex(item => item.id === id)
    const temp = newItems[dragItemIndex]
    newItems[dragItemIndex] = newItems[dropItemIndex]
    newItems[dropItemIndex] = temp
    onReorder(newItems)
    setTimeout(() => {
      setDropItemId('')
    }, 50)
  }


  const handleReorder = () => {
    if (!dragItemId) return
    const top = scrollRef.current.scrollTop + Math.min(yRef.current, scrollRef.current.clientHeight + scrollRef.current.offsetTop)
    const dropItemId = items.find(item => {
      if (item.id === dragItemId) return false
      const itemTop = itemsPosRef.current[item.id]?.y
      return top > itemTop + 5 && top < itemTop + itemHeight - 5
    })?.id

    if (!dropItemId) return
    setDropItemId(dropItemId)
  }

  useEffect(() => {
    reorder(dropItemId)
  }, [dropItemId])

  return (
    <ReorderListContext.Provider
      value={{
        dragItemId,
        setDragItemId, y: yState,
        dragConstraint: {
          top: (scrollRef?.current?.offsetTop) || 0,
          bottom: (scrollRef?.current?.clientHeight + scrollRef?.current?.offsetTop - itemHeight) || 0
        },
        reorder,
        setItemPos: (id, y) => {
          itemsPosRef.current[id] = { y }
        },
        itemHeight
      }}>
      <div
        onMouseMove={e => {
          yRef.current = (e.clientY)
          setYState(e.clientY)
          handleReorder()
        }}
        onPointerUp={() => setDragItemId('')}>
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </div>
    </ReorderListContext.Provider>
  )
}


interface ItemProps {
  children: React.ReactNode,
  id: string
}

export const ReorderItem = ({ children, id }: ItemProps) => {
  const { dragItemId, y, dragConstraint, setItemPos, itemHeight } = useContext(ReorderListContext)
  const dragRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dragRef.current) {
      setItemPos(id, dragRef.current?.offsetTop)
    }
  }, [dragRef.current?.offsetTop])

  return (
    <div className={'reorder-item ' + (dragItemId === id ? ' drag' : '')}>
      <div className='reorder-item-draggable'
        ref={dragRef}
        style={{
          top: y > dragConstraint.top + itemHeight / 2 ? Math.min(y - itemHeight / 2, dragConstraint.bottom) : dragConstraint.top,
        }}>
        {children}
      </div>
    </div>
  )
}

export const ItemDragController = ({ id, children }: { id: string, children: ReactNode }) => {
  const { setDragItemId } = useContext(ReorderListContext)
  return (
    <div
      onPointerDown={() => setDragItemId(id)}>
      {children}
    </div>
  )
}