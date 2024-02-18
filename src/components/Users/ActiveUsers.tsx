"use client"
import { generateRandomName } from "@/lib/utils";
import { useOthers, useSelf } from "../../../liveblocks.config";
import { Avatar } from "./Avatar";
import { useMemo } from "react";

export const ActiveUsers = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > 3;

    const memoizedComp = useMemo(() => (
        <main className="flex items-center">
            <div className="flex pl-3">
                {currentUser && (
                    <div className="relative ml-8 first:ml-0">
                        <Avatar otherStyles="border-2 border-blue-600" name="You" />
                    </div>
                )}

                {users.slice(0, 3).map(({ connectionId, info }) => {
                    
                    return (
                        <Avatar key={connectionId} otherStyles="-ml-2" name={generateRandomName()} />
                    );
                })}

                {hasMoreUsers && <div className={"border-4 rounded-full border-white bg-gray-400 min-w-[56px] w-[56px] h-[56px] -ml-3 flex justify-center items-center text-white"}>+{users.length - 3}</div>}


            </div>
        </main>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [users.length])

    return memoizedComp
}