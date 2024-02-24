/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './Cursors/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '../../liveblocks.config'
import CursorChat from './Cursors/CursorChat'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import ReactionBtn from './Reaction/ReactionBtn'
import ReactionFly from './Reaction/ReactionFly'
import useInterval from '@/hooks/useInterval'
import { Comments } from './Common/comments/Comments'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from '@/constants'


type Props = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    undo: () => void;
    redo: () => void;
}

const Live: React.FC<Props> = ({ canvasRef, undo ,redo }) => {
    const others = useOthers();
    const [myPresence, updateMyPresence] = useMyPresence();
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
                point: { x: myPresence?.cursor?.x!, y: myPresence?.cursor?.y! },
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
            const x = e.clientX;
            const y = e.clientY;

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

        const x = e.clientX;
        const y = e.clientY;

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
        setTimeout(() => {
            updateMyPresence({ message: '' });
            setCursorState({ mode: CursorMode.Hidden })
        }, 2000);
    }, [])

    const handleContextMenuClick = useCallback((key: string) => {
        switch (key) {
            case "Chat":
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: "",
                });
                break;

            case "Reactions":
                setCursorState({ mode: CursorMode.ReactionSelector });
                break;

            case "Undo":
                undo();
                break;

            case "Redo":
                redo();
                break;

            default:
                break;
        }
    }, []);


    return (
        <ContextMenu>
            <ContextMenuTrigger style={{
                height: `calc(100vh - 48px)`

            }} className="w-full !overflow-scroll">

                <div id='canvas' className="w-full h-full" onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} onPointerLeave={handlePointerLeave} onPointerUp={handlePointerUp}>

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

                    <Comments />
                </div>

            </ContextMenuTrigger>
                <ContextMenuContent>
                    {shortcuts.map((item) => (
                        <ContextMenuItem
                            key={item.key}
                            className="flex gap-5 items-center bg-black !text-white cursor-pointer hover:!bg-gray-700"
                            onClick={() => handleContextMenuClick(item.name)}
                        >
                            <p>{item.name}</p>
                            <p className="text-xs text-primary-grey-300">{item.shortcut}</p>
                        </ContextMenuItem>
                    ))}
                </ContextMenuContent>
        </ContextMenu>
    )
}

export default Live