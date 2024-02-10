import React from 'react'
import CursorSVG from '../../../public/assets/CursorSVG';

type Props = {
  color: string;
  x: number;
  y: number;
  message: string;
}

const Cursor: React.FC<Props> = ({ color, x, y, message }) => {
  return (
    <div className="pointer-events-none absolute top-0 left-0" style={{ transform: `translateX(${x}px) translateY(${y}px)` }}>
      <CursorSVG color={color} />

      
    </div>
  )
}

export default Cursor