"use client"

import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './Cursors/LiveCursors'
import { useMyPresence, useOthers } from '../../liveblocks.config'
import CursorChat from './Cursors/CursorChat'
import { CursorMode } from '@/types/type'

const Live = () => {
    const others = useOthers();
    const [myPresence, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState({
        mode: CursorMode.Hidden
    })

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        e.preventDefault();

        const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
        const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } });

    }, []);

    // this hides the cursor once you leave the screen
    const handlePointerLeave = useCallback((e: React.PointerEvent) => {
        setCursorState({ mode: CursorMode.Hidden });
        updateMyPresence({ cursor: null, message: null });

    }, []);

    // this is called once we come back to the canvas
    const handlePointerDown = useCallback((e: React.PointerEvent) => {

        const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
        const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } });

    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') e.preventDefault();
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key === '/') {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                })
            } else if (e.key === 'Escape') {
                updateMyPresence({ message: '' });
                setCursorState({ mode: CursorMode.Hidden })
            }
        };

        typeof window !== 'undefined' && window.addEventListener('keydown', onKeyDown);
        typeof window !== 'undefined' && window.addEventListener('keyup', onKeyUp);

        return () => {
            typeof window !== 'undefined' && window.removeEventListener('keydown', onKeyDown);
            typeof window !== 'undefined' && window.removeEventListener('keyup', onKeyUp);
        }
    }, [updateMyPresence]);

    return (
        <div className="w-full min-h-full border-red-600 border-4" onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} onPointerLeave={handlePointerLeave}>
            <LiveCursors others={others} />

            {myPresence.cursor ? <CursorChat
                cursor={myPresence.cursor}
                cursorState={cursorState}
                setCursorState={setCursorState}
                updateMyPresence={updateMyPresence}
            /> : <></>}
        </div>
    )
}

export default Live