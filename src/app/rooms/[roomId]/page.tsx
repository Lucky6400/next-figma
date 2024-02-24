'use client'
import { Room } from '@/app/Room'
import React from 'react'
import dynamic from "next/dynamic";
import { useParams, usePathname, useRouter } from 'next/navigation';

/**
 * disable ssr to avoid pre-rendering issues of Next.js
 *
 * we're doing this because we're using a canvas element that can't be pre-rendered by Next.js on the server
 */
const App = dynamic(() => import("../../App"), { ssr: false });

const SingleRoom = () => {
  const params = usePathname();
  console.log(params.split("/")[2])
  return (
    <Room id={params.split("/")[2]}>
      <App />
    </Room>
  )
}

export default SingleRoom