import React from 'react';
import Image from 'next/image';
import { IoIosArrowForward } from "react-icons/io";
import { LuCalendarDays } from "react-icons/lu";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const Dashboard = (props) => {
    const [showCal, setShowCal] = React.useState(false);
    const [value, onChange] = React.useState(new Date());

    const Card = ({ count, text }) => {
        return (
            <div className=' rounded-xl shadow p-4 py-7 hover:scale-105 cursor-pointer transition duration-300 ease-in-out'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h2 className='text-3xl font-extrabold'>{count}</h2>
                        <p className='text-gray-600'>{text}</p>
                    </div>
                    <IoIosArrowForward size={20} />
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-y-3 '>
            <div className='flex items-center justify-between'>
                <p className='py-5 text-2xl font-bold '>Dashboard</p>
                <p onClick={() => { setShowCal(!showCal) }} className='hover:scale-95 cursor-pointer p-2 h-fit w-32 rounded-lg flex items-center gap-x-3 border-2 border-gray-100'><LuCalendarDays />Today</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-10'>
                <Card count={'5000'} text={'Today Sales'} />
                <Card count={'500'} text={'Today Sales'} />
                <Card count={'50'} text={'Today Returns Sales'} />
            </div>
            <div className='pt-4 flex gap-y-4 lg:gap-x-16 lg:flex-row flex-col '>
                <div className=' rounded-lg lg:w-[33%]  border-2 border-[#F5F5F5]'>
                    <p className='font-bold pl-3 pt-3 text-xl'>Today orders by city</p>
                    <ul className='pt-3 flex flex-col gap-y-2'>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                        <li className='flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center'><span>300 in medipally</span><span><IoIosArrowForward /></span></li>
                    </ul>
                </div>
                <div className=' rounded-lg lg:p-3 p-1 lg:w-[68%] border-2 border-[#F5F5F5]'>
                    <p className='py-1 lg:pb-2 font-bold lg:text-xl text-lg' >Bookings & Return Status</p>
                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg' />
                </div>
            </div>
            {showCal && <div className='absolute top-48 right-0 z-50 '>
                <Calendar className={'bg-red-200'} onChange={onChange} value={value} />
            </div>}
        </div>
    );
};

export default Dashboard;