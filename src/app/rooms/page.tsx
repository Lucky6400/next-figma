'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Rooms = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/")
    //eslint-disable-next-line
  }, [])
  return (
    <div>Rooms</div>
  )
}

export default Rooms