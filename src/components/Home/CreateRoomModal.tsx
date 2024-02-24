'use client';

import { createRoom } from '@/services/rooms';
import React, { FormEvent, useState } from 'react'
import ButtonLoader from '../Common/Loaders/ButtonLoader';

const CreateRoomModal = ({ setModal, setRooms }: { setModal: any, setRooms: any }) => {
    const [val, setVal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createRoom(val);
            console.log(res)
            if (res.success) {
                setModal(false);
                setRooms((p: any) => ([...p, res.createdRoom]))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="z-[9999999] fixed top-0 left-0 w-screen h-screen bg-[#00000060] flex items-center justify-center">
            <div className="bg-white w-1/2 max-md:w-11/12 rounded-xl max-md:rounded-lg p-4 relative">
                <div onClick={() => setModal(false)} className="absolute text-lg right-4 cursor-pointer top-2">X</div>
                <h2 className="text-lg border-b border-gray-400 pb-3 font-semibold">
                    Create a room
                </h2>

                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 my-5">
                    <div>
                        <label className="text-xs " htmlFor="">Room Id</label>
                        <input value={val} onChange={e => setVal(e.target.value)} type="text" className="w-full p-2 my-1 border border-gray-300 rounded-lg focus:outline-blue-500" placeholder='Enter here' />
                    </div>
                    <button disabled={loading} className="w-full flex justify-center items-center disabled:cursor-not-allowed bg-blue-500 p-2 rounded-lg text-white text-center">
                        {loading ? <ButtonLoader /> : "Create"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateRoomModal