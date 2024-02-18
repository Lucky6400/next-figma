import { CursorChatProps, CursorMode } from '@/types/type'
import React from 'react'
import CursorSVG from '../../../public/assets/CursorSVG'

const CursorChat: React.FC<CursorChatProps> = ({ cursor, cursorState, setCursorState, updateMyPresence }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      message: e.target.value,
      previousMessage: null
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCursorState({
        mode: CursorMode.Chat,
        message: '',
        //@ts-ignore
        previousMessage: cursorState.message
      })
    } else if (e.key === 'Escape') {
      setCursorState({
        mode: CursorMode.Hidden
      })
    }
  }

  return (
    <div className="pointer-events-none absolute top-0 left-0" style={{ transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)` }}>
      {cursorState.mode === CursorMode.Chat ? <>
        <CursorSVG color="#000" />

        <div
          onKeyUp={e => e.stopPropagation()}
          className="absolute left-2 top-5 bg-black text-white rounded-full px-5 py-2 leading-relaxed text-sm">

          {
            cursorState.previousMessage ?
              <p>
                {cursorState.previousMessage}
              </p>
              :
              <>
              </>
          }

          <input
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="text" className="bg-transparent placeholder:text-gray-200 text-white text-sm outline-none focus:outline-none border-none z-10" autoFocus placeholder={cursorState.previousMessage ? '' : "Type a message..."} />

        </div>
      </> : <></>}
    </div>
  )
}

export default CursorChat