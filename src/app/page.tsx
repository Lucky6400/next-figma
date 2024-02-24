'use client'
import HomeLoader from "@/components/Common/Loaders/HomeLoader";
import CreateRoomModal from "@/components/Home/CreateRoomModal";
import { getCurrentUser } from "@/services/auth";
import { deleteRoom, getAllRooms } from "@/services/rooms";
import { RoomType, UserType } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {

    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteRoom = async (id: string) => {
        setLoading(true)
        try {
            const res = await deleteRoom(id);
            if (res.success) {
                setRooms(p => p.filter(v => v.id !== id));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const user = await getCurrentUser();
                const rooms = await getAllRooms();
                console.log(user)
                setCurrentUser(user);
                setRooms(rooms);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
            //console.log(rooms)
        }
        getData();
    }, [])
    return (
        <div className="w-full">
            <div className="flex items-center p-2 justify-between">
                <div className="logo text-xl font-semibold">
                    nextDesign
                </div>

                <Link href="/profile" className="text-sm">
                    <Image width={40} height={40} src={currentUser?.imgUrl || "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"} className="border-2 rounded-full border-blue-500" alt="" />

                </Link>
            </div>
            <button onClick={() => setModal(true)} className="mx-2 mt-3 px-4 hover:bg-blue-800 bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2">
                + Create a room
            </button>

            {modal ? <CreateRoomModal setRooms={setRooms} setModal={setModal} /> : <></>}

            <h5 className="text-xl px-2 my-4 font-semibold">
                Available rooms
            </h5>

            {loading ? <div className="flex w-full min-h-[60vh] justify-center items-center">
                <HomeLoader />
            </div> : <>

                <div className="flex flex-col px-2">

                    {rooms.map((room) => (
                        <div key={room.id} className="flex items-center border-b border-gray-300 hover:bg-gray-200 hover:text-blue-500 px-3 justify-between">
                            <Link href={"/rooms/" + room.id} className="my-2 w-full group cursor-pointer p-2 rounded-lg " >

                                {room.id}
                                <div className="text-xs text-gray-400 group-hover:text-blue-700">
                                    {new Date(room.createdAt).toDateString()}
                                </div>
                            </Link>

                            <div>
                                <button disabled={loading} onClick={() => handleDeleteRoom(room.id)} className="bg-red-500 text-white p-2 rounded-lg disabled:cursor-not-allowed hover:bg-red-300 text-sm font-semibold">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </>}
        </div>
    )
}

export default Home;