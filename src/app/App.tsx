"use client";

import LeftSidebar from "@/components/Common/LeftSidebar";
import Navbar from "@/components/Common/Navbar";
import RightSidebar from "@/components/Common/RightSidebar";
import Live from "@/components/Live";
import { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric'
import { handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectScaling, handleCanvasSelectionCreated, handleCanvaseMouseMove, handlePathCreated, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "../../liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);
  const isDrawing = useRef(false);
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#000",
  });
  const canvasObject = useStorage(r => r.canvasObjects);
  const undo = useUndo();
  const redo = useRedo();



  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });


    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({ options, canvas, isDrawing, shapeRef, selectedShapeRef });
    });


    canvas.on('mouse:move', (options) => {
      handleCanvaseMouseMove({ options, canvas, isDrawing, shapeRef, selectedShapeRef, syncShapeInStorage });

    });

    canvas.on('mouse:up', () => {
      handleCanvasMouseUp({ activeObjectRef, canvas, isDrawing, shapeRef, selectedShapeRef, syncShapeInStorage, setActiveElement });
    });

    canvas.on('object:scaling', (options) => {
      handleCanvasObjectScaling({ options, setElementAttributes });
    })

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({ options, syncShapeInStorage })
    })

    canvas.on('selection:created', (options) => {
      handleCanvasSelectionCreated({
        options, isEditingRef, setElementAttributes
      })
    })

    canvas.on('path:created', (options) => {
      handlePathCreated({ options, syncShapeInStorage });
    })

    typeof window !== 'undefined' && window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    typeof window !== 'undefined' && window.addEventListener('keydown', (e) => {
      handleKeyDown({
        e, undo, redo, deleteShapeFromStorage, canvas: fabricRef.current, syncShapeInStorage
      })
    })
    return () => {
      canvas.dispose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    renderCanvas({
      fabricRef, canvasObjects: canvasObject, activeObjectRef
    })
  }, [canvasObject])

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '', value: '', icon: ''
  })

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get('canvasObjects');

    if (!canvasObjects || canvasObjects.size === 0) return true;

    console.log(canvasObjects.entries());


    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }



    return canvasObjects.size === 0;
  }, [])

  const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.delete(objectId);
  }, [])

  const handleActiveElement = (e: ActiveElement) => {
    setActiveElement(e);

    const val = e?.value;

    if (val === 'reset') {
      deleteAllShapes();
      fabricRef.current?.clear;
      setActiveElement(defaultNavElement);
    } else if (val === 'delete') {
      handleDelete(fabricRef.current as any, deleteShapeFromStorage);
      setActiveElement(defaultNavElement);
    } else if (val === 'image') {
      imageInputRef.current?.click();
      isDrawing.current = false;

      if (fabricRef.current) fabricRef.current.isDrawingMode = false;

    } else {
      selectedShapeRef.current = e?.value as string;
    }
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
        imageInputRef={imageInputRef}
        handleImageUpload={e => {
          e.stopPropagation();

          handleImageUpload({
            file: e?.target?.files?.[0] as File,
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage
          })
        }}
      />
      <div className="flex w-full">
        <LeftSidebar allShapes={Array.from(canvasObject)} />
        <Live canvasRef={canvasRef} undo={undo} redo={redo} />
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </div>
    </div>
  );
}