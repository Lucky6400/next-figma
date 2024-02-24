'use client';
import ProfileLoader from '@/components/Common/Loaders/ProfileLoader';
import { getCurrentUser, signOut, updateUser } from '@/services/auth';
import { UserType } from '@/types/type';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type FormData = Record<string, string>;

const Profile = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);

    const [formData, setFormData] = useState<FormData>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(p => ({ ...p, [e.target.id]: e.target.value }));
    }
    console.log(formData);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        try {
            const data = {
                ...formData,
                skills: formData.skills ? formData.skills?.split(",") : user?.skills
            }

            const res = await updateUser(user?._id!, data);
            if (res.success) {
                setUser((p: any) => ({
                    ...p,
                    ...data
                }))
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
                const getuser = await getCurrentUser();
                setUser(getuser);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
            //console.log(rooms)
        }
        getData();
    }, [])

    const handleSignOut = async () => {
        setLoading(true);
        try {
            const res = await signOut();
            if (res.success) {
                router.push("/signin");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        loading ?
            <div className="w-full flex items-center justify-center h-screen">
                <ProfileLoader />
            </div>
            :

            <div className="w-full py-10">
                <Link href={"/"} className="fixed left-2 top-2 text-sm">
                    <button className="bg-blue-500 text-xs font-semibold px-4 text-white rounded-lg p-2">
                        Back
                    </button>
                </Link>
                <div className="w-full flex items-center justify-center">
                    <Image width={1000} height={1000} src={user?.imgUrl || "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"} alt='' className="w-48 h-48 border-2 rounded-full border-blue-500" />
                </div>

                <form onSubmit={handleSubmit} className="w-7/12 max-md:w-full mx-auto my-10">
                    <div className="flex w-full justify-between items-center">
                        <div className='flex flex-col gap-1 w-5/12'>
                            <label className='text-xs' htmlFor="">Username</label>
                            <input id='username' onChange={handleChange} type="text" className="focus:outline-blue-700 border w-full border-gray-300 p-2 rounded-lg mb-3"
                                defaultValue={user?.username}
                            />
                        </div>

                        <div className='flex flex-col gap-1 w-5/12'>
                            <label className='text-xs' htmlFor="">Email Address</label>
                            <input id='email' onChange={handleChange} type="text" className="focus:outline-blue-700 border w-full border-gray-300 p-2 rounded-lg mb-3"
                                defaultValue={user?.email}
                            />
                        </div>
                    </div>

                    <div className="flex w-full justify-between items-center">
                        <div className='flex flex-col gap-1 w-5/12'>
                            <label className='text-xs' htmlFor="">Description</label>
                            <input id='desc' onChange={handleChange} type="text" className="focus:outline-blue-700 border w-full border-gray-300 p-2 rounded-lg mb-3"
                                defaultValue={user?.desc}
                            />
                        </div>

                        <div className='flex flex-col gap-1 w-5/12'>
                            <label className='text-xs' htmlFor="">Skills (enter comma separated values)</label>
                            <input id='skills' onChange={handleChange} type="text" className="focus:outline-blue-700 border w-full border-gray-300 p-2 rounded-lg mb-3"
                                defaultValue={user?.skills?.join(",")}
                            />
                        </div>
                    </div>

                    <button type='submit' disabled={loading} className="w-full mt-2 disabled:cursor-not-allowed bg-blue-500 text-white text-sm font-semibold p-2 rounded-lg">
                        Submit
                    </button>

                <button
                    onClick={handleSignOut}
                    disabled={loading} className="w-full mt-2 disabled:cursor-not-allowed bg-red-500 text-white text-sm font-semibold p-2 rounded-lg">
                    Log Out
                </button>
                </form>
            </div>
    )
}

export default Profile