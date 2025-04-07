import React from 'react';
import Image from 'next/image';
import { IoIosArrowForward } from "react-icons/io";
import { LuCalendarDays } from "react-icons/lu";

const Dashboard = (props) => {
    const Card = ({ count, text }) => {
        return (
            <div className='bg-white rounded-xl shadow-md p-4 py-7 hover:scale-105 cursor-pointer'>
                <h2 className='text-3xl font-extrabold'>{count}</h2>
                <p className='text-gray-600'>{text}</p>
            </div>
        );
    }
    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex justify-between'>
                <p className='py-5 text-2xl font-bold'>Dashboard</p>
                <p className='bg-white p-2 h-fit w-32 rounded-lg flex items-center gap-x-3'><LuCalendarDays/>Today</p>
            </div>
            <div className='grid grid-cols-3 gap-x-10'>
                <Card count={'5000'} text={'Today Sales'} />
                <Card count={'500'} text={'Today Sales'} />
                <Card count={'50'} text={'Today Returns Sales'} />
            </div>
            <div className='pt-4  flex gap-x-16'>
                <div className='bg-white rounded-lg p-3 w-[31%] px-3'>
                    Today orders by city
                    <ul className='pt-3 flex flex-col gap-y-2'>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 p-1 items-center'><span>300 in mediplly</span><span><IoIosArrowForward /></span></li>
                        
                    </ul>
                </div>
                <div className='bg-white rounded-lg p-3 w-[68%]'>
                    Bookings & Return Status
                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg' />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;