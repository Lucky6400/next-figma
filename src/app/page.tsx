"use client";

import LeftSidebar from "@/components/Common/LeftSidebar";
import Navbar from "@/components/Common/Navbar";
import RightSidebar from "@/components/Common/RightSidebar";
import Live from "@/components/Live";
import { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric'
import { handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvaseMouseMove, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { useMutation, useStorage } from "../../liveblocks.config";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');
  const isDrawing = useRef(false);
  const canvasObject = useStorage(r => r.canvasObjects);
  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({ options, canvas, isDrawing, shapeRef, selectedShapeRef });
    });

    canvas.on('mouse:move', (options) => {
      handleCanvaseMouseMove({ options, canvas, isDrawing, shapeRef, selectedShapeRef, syncShapeInStorage });
    });

    canvas.on('mouse:up', (options) => {
      handleCanvasMouseUp({ activeObjectRef, canvas, isDrawing, shapeRef, selectedShapeRef, syncShapeInStorage, setActiveElement });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({ options, syncShapeInStorage })
    })

    typeof window !== 'undefined' && window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });
  }, []);

  useEffect(() => {
    renderCanvas({
      fabricRef, canvasObjects: canvasObject, activeObjectRef
    })
  }, [canvasObject])

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '', value: '', icon: ''
  })

  const handleActiveElement = (e: ActiveElement) => {
    setActiveElement(e);
    selectedShapeRef.current = e?.value as string;
  }


  const syncShapeInStorage = useMutation(({ storage }, object) => {

    if (!object) return;

    const id = object.objectId;
    const data = object.toJSON();
    data.objectId = id;

    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(id, data);
  }, [])

  return (
    <div className="w-full overflow-hidden h-screen">
      <Navbar activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />
      <div className="flex w-full">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </div>
    </div>
  );
}