import React, { useRef } from 'react'
import Dimensions from './settings/Dimensions'
import Text from './settings/Text'
import Color from './settings/Color'
import Export from './settings/Export'
import { RightSidebarProps } from '@/types/type'
import { modifyShape } from '@/lib/shapes'
import { fabric } from 'fabric';
import { Label } from "@/components/ui/label";


const RightSidebar: React.FC<RightSidebarProps> = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}) => {

  const { width, height, fontFamily, fontSize, fontWeight, fill, stroke, opacity } = elementAttributes;
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;
    setElementAttributes(p => ({
      ...p,
      [property]: value
    }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      activeObjectRef, syncShapeInStorage, property, value
    });
  }
  return (
    <section className="bg-white text-black flex items-center flex-col border-l border-gray-300 min-w-[300px]  sticky right-0 max-md:hidden overflow-x-hidden overflow-y-auto pb-20 h-screen">

      <h3 className="px-5 py-4 text-xs text-black uppercase">design</h3>

      <Dimensions
        isEditingRef={isEditingRef} width={width} height={height} handleInputChange={handleInputChange}
      />
      <Text handleInputChange={handleInputChange} fontFamily={fontFamily} fontWeight={fontWeight} fontSize={fontSize} />
      <Color inputRef={colorInputRef} attribute={fill} opacity={opacity} placeholder='Color' handleInputChange={handleInputChange} attributeType="fill" />
      <Color inputRef={strokeInputRef} attribute={stroke} placeholder='Stroke' handleInputChange={handleInputChange} attributeType='stroke' />

      <Export />
      <h3 className='text-[10px] uppercase w-full px-5'>{"Code </>"}</h3>
      <div className="w-full p-5 max-w-[300px]">
        <div className="w-full bg-gray-300 p-2 rounded-lg">

          {elementAttributes.width ?
            <>
             { `
              <div style={{
                width: ${elementAttributes.width},
                height: ${elementAttributes.height},
                background: "${elementAttributes.fill}",
                opacity: ${elementAttributes.opacity || 1}
           }}>

            </div>
          `}
        </>
        :
        <></>
          }
      </div>
    </div>
    </section >
  )
}

export default RightSidebar