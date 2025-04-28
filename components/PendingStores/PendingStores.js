import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
const ComponentName = (props) => {
    const StoreCard = ({ }) => {
        return (
            <div className='pt-6'>
                <ul className='flex flex-col gap-y-2 border-2 border-[#F5F5F5] rounded-lg'>
                    <li>
                        <Image
                            src="/images/ooo.png"
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-t-lg object-cover w-full ' />
                    </li>
                    <li className='pl-4'>KLM Shopping Mall, Medipally</li>
                    <li className='pl-4'>Store Id : 487987747</li>
                    <li className='pl-4 pb-4'>Submitted At 7 : 32pm, 24may</li>
                </ul>
            </div>
        );
    }
    return (
        <div>
            <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
                <li className={` cursor-pointer`}><Link href={'/orders/confirmed'}>Pending Stores</Link></li>
                <li className='cursor-pointer'><Link href={'/returned'}>Rejected Stores</Link> </li>
                <li className='cursor-pointer'>Approved Stores</li>
            </ul>
            <div className='grid grid-cols-2 gap-7'>
                <StoreCard />
                <StoreCard />
                <StoreCard />
                <StoreCard />

            </div>
        </div>
    );
};

export default ComponentName;