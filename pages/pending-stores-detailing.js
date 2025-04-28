import React from 'react';
import Layout from '@/components/Layout/Layout';
import Image from 'next/image';
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from 'next/router';

const ComponentName = (props) => {
    const router = useRouter()
    return (
        <Layout>
            <div className="">
                {/* <PendingStores /> */}
                <p className='lg:text-xl text-xs flex gap-x-3 items-center'><span className='cursor-pointer'><IoArrowBackSharp onClick={() => { router.back() }} className='size-6 lg:size-8' /></span><span className='text-[#6B757C]'>Pending Stores</span><span className='text-[#6B757C]'>{' > '}</span><span className='font-bold '>KLM Shopping Mall, Medipally</span>  </p>
                <div className='flex flex-col gap-y-5 pt-8'>
                    <div className='flex gap-x-6'>
                        <Image
                            src="/images/ooo.png"
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/2 ' />
                        <div className='w-full flex flex-col gap-y-3'>
                            <ul className='p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-1.5'>
                                <li className='text-2xl font-semibold'>Store Details</li>
                                <li className='text-[#6B767B]'>Store Id : 487987747</li>
                                <li className='w-40'>KLM Shopping mall Plot No 21,Medipally, Hyderabad 533103</li>
                            </ul>
                            <ul className='p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-2'>
                                <li className='text-2xl font-semibold'>GST Details</li>
                                <li className=''>Number : 6548978978887887</li>
                                <li className=''>Name As Per Gst : KLM Shopping Mall</li>
                                <li className=''><button className='bg-[#F5F5F5] rounded-md p-2 text-xl flex justify-between w-full items-center pr-10'><span>View GST Image</span> <IoIosArrowForward/></button></li>
                            </ul>
                            {/* <ul>
                                <li>GST Details</li>
                                <li>Number : 6548978978887887</li>
                                <li>Name As Per Gst : KLM Shopping Mall</li>
                                <li>View GST Image</li>
                            </ul> */}
                        </div>
                    </div>
                    <div className='flex gap-x-2'>
                        <Image
                            src="/images/ee.png"
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 ' />
                        <Image
                            src="/images/ee.png"
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 ' />
                        <Image
                            src="/images/ee.png"
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 ' />
                        <Image
                            src="/images/ee.png"
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-lg  object-cover w-1/4 ' />

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