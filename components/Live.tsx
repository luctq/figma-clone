import { useMyPresence, useOthers } from "@liveblocks/react"
import LiveCursors from "./cursor/LiveCursors"

const Live = () => {
  const others= useOthers()
  const [myPresence, setMyPresence] = useMyPresence()

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y
    setMyPresence({
      cursor: { x, y },
    })
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMyPresence({
      cursor: null,
      message: null,
    })
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setMyPresence({
      cursor: { x: e.clientX, y: e.clientY },
      message: "Hello",
    })
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="h-[100vh] w-full flex justify-center items-center text-white"
    >
      <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1>
      <LiveCursors others={others}/>
    </div>
  )
}

export default Live