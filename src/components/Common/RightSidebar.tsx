import React, { useRef } from 'react'
import Dimensions from './settings/Dimensions'
import Text from './settings/Text'
import Color from './settings/Color'
import Export from './settings/Export'
import { RightSidebarProps } from '@/types/type'
import { modifyShape } from '@/lib/shapes'
import { fabric } from 'fabric';


const RightSidebar: React.FC<RightSidebarProps> = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}) => {

  const { width, height, fontFamily, fontSize, fontWeight, fill, stroke } = elementAttributes;
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
    <section className="bg-white text-black flex items-center flex-col border-l border-gray-300 min-w-[227px] sticky right-0 max-md:hidden overflow-x-hidden overflow-y-auto h-screen">

      <h3 className="px-5 py-4 text-xs text-black uppercase">design</h3>

      <Dimensions
        isEditingRef={isEditingRef} width={width} height={height} handleInputChange={handleInputChange}
      />
      <Text handleInputChange={handleInputChange} fontFamily={fontFamily} fontWeight={fontWeight} fontSize={fontSize} />
      <Color inputRef={colorInputRef} attribute={fill} placeholder='Color' handleInputChange={handleInputChange} attributeType="fill" />
      <Color inputRef={strokeInputRef} attribute={stroke} placeholder='Stroke' handleInputChange={handleInputChange} attributeType='stroke' />
      <Export />

    </section>
  )
}

export default RightSidebar