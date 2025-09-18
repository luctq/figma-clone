import { useMyPresence, useOthers } from "@liveblocks/react"
import LiveCursors from "./cursor/LiveCursors"
import { CursorMode, CursorState } from "@/types/type"
import { useEffect, useState } from "react"
import CursorChat from "./cursor/CursorChat"

const Live = () => {
  const others= useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y
    updateMyPresence({
      cursor: { x, y },
    })
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    setCursorState({
      mode: CursorMode.Hidden,
    })

    updateMyPresence({
      cursor: null,
      message: null,
    })
  }

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        })
      } else if (e.key === "Escape") {
        updateMyPresence({
          message: "",
        })
        setCursorState({
          mode: CursorMode.Hidden,
        })
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault()
      }
    }

    document.addEventListener("keyup", onKeyUp)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keyup", onKeyUp)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [updateMyPresence])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    updateMyPresence({
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
      {cursor && <CursorChat 
        cursor={cursor}
        cursorState={cursorState}
        setCursorState={setCursorState}
        updateMyPresence={updateMyPresence}
      />}
      <LiveCursors others={others}/>
    </div>
  )
}

export default Live