import React from 'react';
import Layout from '@/components/Layout/Layout';
import Image from 'next/image';
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchAssignStore } from '@/services/api';
import { useState } from 'react';
const ComponentName = (props) => {
    const [showGst, setShowGst] = useState(false);
    const router = useRouter()
    const { data: assignDoc, isLoading, error } = useQuery({
        queryKey: ['assign-store'],
        queryFn: fetchAssignStore,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading store data</p>;

    return (
        <Layout>
            <div className="">
                {/* <PendingStores /> */}
                <p className='lg:text-xl text-xs flex gap-x-3 items-center'><span className='cursor-pointer'><IoArrowBackSharp onClick={() => { router.back() }} className='size-6 lg:size-8' /></span><span className='text-[#6B757C]'>Pending Stores</span><span className='text-[#6B757C]'>{' > '}</span><span className='font-bold '>KLM Shopping Mall, Medipally</span>  </p>
                <div className='flex flex-col gap-y-5 pt-8'>
                    {showGst && <div className='fixed top-0 w-full h-full left-0  bg-black bg-opacity-0 flex justify-center items-center z-50'>
                        <Image
                            src={assignDoc.store_image}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg w-fit h-fit ' />
                        <div className='absolute top-5 right-5 cursor-pointer' onClick={() => { setShowGst(false) }}><IoArrowBackSharp className='size-6 lg:size-8 text-white' /></div>
                    </div>
                    }
                    <div className='flex gap-x-6'>
                        <Image
                            src={assignDoc.store_image}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/2 h-[400px] ' />
                        <div className='w-full flex flex-col gap-y-3'>
                            <ul className='p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-1.5'>
                                <li className='text-2xl font-semibold'>Store Details</li>
                                <li className='text-[#6B767B]'>Store Id : {assignDoc._id}</li>
                                <li className='w-56'>{assignDoc.address}</li>
                            </ul>
                            <ul className='p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-2'>
                                <li className='text-2xl font-semibold'>GST Details</li>
                                <li className=''>Number :  {assignDoc.gst_number}</li>
                                <li className=''>Name As Per Gst :  {assignDoc.name_as_per_gst}</li>
                                <li className=''><button onClick={() => { setShowGst(true); }} className='bg-[#F5F5F5] rounded-md p-2 text-xl flex justify-between w-full items-center pr-10'><span>View GST Image</span> <IoIosArrowForward /></button></li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex gap-x-2'>
                        <Image
                            src={assignDoc.store_image}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 h-[250px] ' />
                        <Image
                            src={assignDoc.store_top_image_1}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 h-[250px]  ' />
                        <Image
                            src={assignDoc.store_top_image_2}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 h-[250px]  ' />
                        <Image
                            src={assignDoc.store_top_image_3}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 h-[250px]  ' />
                    </div>
                    <div className='flex gap-x-2'>
                        <button className='p-3 py-5 rounded-lg border-2 border-gray-100 w-full hover:bg-red-500'>Reject</button>
                        <button className='p-3 py-5 rounded-lg border-2 border-gray-100 w-full bg-[#793FDF] text-white'>Approve</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ComponentName;