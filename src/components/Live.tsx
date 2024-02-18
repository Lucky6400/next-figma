"use client"

import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './Cursors/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '../../liveblocks.config'
import CursorChat from './Cursors/CursorChat'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import ReactionBtn from './Reaction/ReactionBtn'
import ReactionFly from './Reaction/ReactionFly'
import useInterval from '@/hooks/useInterval'

type Props = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

const Live: React.FC<Props> = ({ canvasRef }) => {
    const others = useOthers();
    const [myPresence, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden
    })

    const [reactions, setReactions] = useState<Reaction[]>([]);

    const broadcast = useBroadcastEvent();

    useInterval(() => {
        setReactions(reactions => reactions.filter(reaction => reaction.timestamp > Date.now() - 4000))
    }, 1000)

    useInterval(() => {
        if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && myPresence.cursor) {
            setReactions(r => r.concat([{
                point: { x: myPresence.cursor.x, y: myPresence.cursor.y },
                value: cursorState.reaction,
                timestamp: Date.now()
            }]))

            broadcast({
                x: myPresence.cursor.x,
                y: myPresence.cursor.y,
                value: cursorState.reaction
            })
        }
    }, 100);

    useEventListener((eventData) => {
        const event = eventData.event as ReactionEvent;

        setReactions(r => r.concat([{
            point: { x: event.x, y: event.y },
            value: event.value,
            timestamp: Date.now()
        }]))
    })

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        e.preventDefault();

        if (myPresence.cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
            const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
            const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

            updateMyPresence({ cursor: { x, y } });
        }

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

        setCursorState((state: CursorState) => (cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state));

    }, [cursorState.mode, setCursorState]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {

        setCursorState((state: CursorState) => (cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state));

    }, [cursorState.mode, setCursorState]);

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
            } else if (e.key === 'e') {
                setCursorState({
                    mode: CursorMode.ReactionSelector
                })
            }
        };

        typeof window !== 'undefined' && window.addEventListener('keydown', onKeyDown);
        typeof window !== 'undefined' && window.addEventListener('keyup', onKeyUp);

        return () => {
            typeof window !== 'undefined' && window.removeEventListener('keydown', onKeyDown);
            typeof window !== 'undefined' && window.removeEventListener('keyup', onKeyUp);
        }
    }, [updateMyPresence]);

    const handleSetReactions = useCallback((r: string) => {
        setCursorState({ mode: CursorMode.Reaction, reaction: r, isPressed: false })
    }, [])

    return (
        <div id='canvas' className="w-full min-h-full" onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} onPointerLeave={handlePointerLeave} onPointerUp={handlePointerUp}>

            <canvas ref={canvasRef} />

            {reactions.map((reaction, i: number) => (
                <ReactionFly key={reaction.timestamp.toString()}
                    x={reaction.point.x}
                    y={reaction.point.y}
                    timestamp={reaction.timestamp}
                    value={reaction.value}
                />
            ))}

            {myPresence.cursor ? <CursorChat
                cursor={myPresence.cursor}
                cursorState={cursorState}
                setCursorState={setCursorState}
                updateMyPresence={updateMyPresence}
            /> : <></>}

            {cursorState.mode === CursorMode.ReactionSelector ?
                <>
                    <ReactionBtn
                        setReaction={handleSetReactions}
                    />
                </>
                : <></>}

            <LiveCursors others={others} />
        </div>
    )
}

export default Live