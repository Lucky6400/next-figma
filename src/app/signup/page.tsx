'use client'

import { signIn, signUp } from '@/services/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const SignUp = () => {

  const [creds, setCreds] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds(p => ({ ...p, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signUp(creds);
      console.log(res);
      if(res && res.success) {
        router.push('/signin');
      } else setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-sm">
      <div className="text-center max-md:mb-5 mb-20">

        <h1 className="text-5xl max-md:text-xl font-semibold text-black">
          Welcome to NextDesign!
        </h1>

        <p className="text-lg max-md:text-sm">
          Please enter your credentials to signin and continue.
        </p>
      </div>
      <div className="w-1/4 max-md:w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <label htmlFor="">Email</label>
          <input type="text" id='email' onChange={handleChange} placeholder="Enter email here..." required className="focus:outline-blue-700 border border-gray-300 p-2 rounded-lg mb-3" />

          <label htmlFor="">Username</label>
          <input type="text" id='username' onChange={handleChange} placeholder="Enter username here..." required className="focus:outline-blue-700 border border-gray-300 p-2 rounded-lg mb-3" />

          <label htmlFor="">Password</label>
          <input type="password" id='password' onChange={handleChange} placeholder="Enter password here..." required className="focus:outline-blue-700 border border-gray-300 p-2 rounded-lg mb-3" />

          <button type="submit" className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-600">
            Signup
          </button>
          <div className="text-sm font-ssemibold">
            ALready have an account? <Link className="text-blue-500 font-semibold" href="/signin">Sign in</Link>
          </div>
          {loading ? <p className="my-3 text-xs">Please wait while we are loading...</p> : <></>}
        </form>
      </div>
    </div>
  )
}

export default SignUp