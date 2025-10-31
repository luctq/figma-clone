import { useMyPresence, useOthers } from "@liveblocks/react"
import LiveCursors from "./cursor/LiveCursors"
import { CursorMode, CursorState, Reaction } from "@/types/type"
import { useCallback, useEffect, useState } from "react"
import CursorChat from "./cursor/CursorChat"
import ReactionSelector from "./reaction/ReactionSelector"

const Live = () => {
  const others= useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      e.preventDefault()
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y
      updateMyPresence({
        cursor: { x, y },
      })
    }
  }, [])

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setCursorState({
      mode: CursorMode.Hidden,
    })

    updateMyPresence({
      cursor: null,
      message: null,
    })
  }, [])

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        })
      } else if (e.key === "e") {
        setCursorState({
          mode: CursorMode.ReactionSelector,
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

  const setReactions = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false })
  }, [cursor])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    updateMyPresence({
      cursor: { x: e.clientX, y: e.clientY },
      message: null,
    })

    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state)
  }, [cursorState.mode, setCursorState])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state)
  }, [cursorState.mode, setCursorState])

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full flex justify-center items-center text-white"
    >
      <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1>
      {cursor && <CursorChat 
        cursor={cursor}
        cursorState={cursorState}
        setCursorState={setCursorState}
        updateMyPresence={updateMyPresence}
      />}

      {cursorState.mode === CursorMode.ReactionSelector && <ReactionSelector setReaction={setReactions} />}
      <LiveCursors others={others}/>
    </div>
  )
}

export default Live