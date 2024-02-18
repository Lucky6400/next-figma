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

      {message ?
      <div className="absolute left-0 top-4 px-5 py-2 text-white rounded-full w-max text-xs max-w-48" style={{ backgroundColor: color }}>
        <p>
          {message}
        </p>
      </div>
      : <></>}
    </div>
  )
}

export default Cursor