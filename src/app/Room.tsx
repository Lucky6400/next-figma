"use client";

import { ReactNode } from "react";
import { RoomProvider } from "../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import Loader from "@/components/Common/Loader";

export function Room({ children, id }: { children: ReactNode, id: string }) {
  return (
    <RoomProvider id={id} initialPresence={{
      cursor: null, message: null
    }}
      initialStorage={{
        canvasObjects: new LiveMap()
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}