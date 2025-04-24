import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import Link from 'next/link';
const Orders = (props) => {
    const router = useRouter();
    const items = ['Confirmed - 2006', 'In  Delivery - 300', 'Returned', 'Completed', 'Customer cancelled', 'Cancelled'];
    const containerRef = useRef(null);

    const scrollLeft = () => {
        containerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    };

    const scrollRight = () => {
        containerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    };
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        async function getcats() {
            const resp = await fetch("https://api.thecatapi.com/v1/images/search?limit=10", requestOptions)
            const data = await resp.json()
            console.log(data, "data");
        }
        getcats()

    }, [])
    return (
        <div className='flex flex-col gap-y-6'>
            <div className=''>
                <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
                    <li className={`${router.asPath === '/orders' ? 'text-[#793FDF] font-bold' : ' '} cursor-pointer`}><Link href={'/orders/confirmed'}>Confirmed - 2003</Link></li>
                    <li className='cursor-pointer'><Link href={'/returned'}>Returned</Link> </li>
                    <li className='cursor-pointer'>In  Delivery - 300</li>
                    <li className='cursor-pointer'>Replaced</li>
                    <li className='cursor-pointer'>Completed</li>
                    <li className='cursor-pointer'>Customer cancelled </li>
                    <li className='cursor-pointer'>Cancelled</li>
                </ul>
                <div className=" navbar-carousel text-xs ">
                    <button className="nav-btn" onClick={scrollLeft}>‹</button>
                    <div className="nav-items flex gap-x-1" ref={containerRef}>
                        {items.map((item, idx) => (
                            <div className="nav-item" key={idx}>{item}</div>
                        ))}
                    </div>
                    <button className="nav-btn" onClick={scrollRight}>›</button>
                </div>
            </div>
            <div className=''>
                <div className='flex lg:gap-x-6 gap-x-1 text-xs items-center'>
                    <select className='px-2 py-1 rounded-md border-2 border-[#F5F5F5] outline-none'>
                        <option value="today">All Stores</option>
                        <option value="today">Today</option>
                        <option value="today">Today</option>
                    </select>
                    <select className='px-2 py-1 rounded-md border-2 border-[#F5F5F5] outline-none'>
                        <option value="today">Order Status</option>
                        <option value="today">Today</option>
                        <option value="today">Today</option>
                    </select>
                    <select className='px-2 py-1 rounded-md border-2 border-[#F5F5F5] outline-none'>
                        <option value="today">Delivery Boy Status</option>
                        <option value="today">Today</option>
                        <option value="today">Today</option>
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 '>
                <div className='border-2 border-[#f2f2f2] rounded-lg p-3'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-1'>
                            <p className='font-bold lg:text-2xl text-sm'>Order Id : 146543</p>
                            <p className='text-xs text-[#6B767B]'>KLM Shopping Mall, Medipally</p>
                            <p className='font-medium text-sm lg:text-lg'>Customer:9854223588</p>
                            <p className='font-medium'></p>
                            <p className=' w-36 flex flex-col text-xs'>
                                <span>
                                    Delivery Location :
                                </span>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</p>
                        </div>
                        <div className='flex flex-col justify-between items-center'>
                            <p className='text-xs lg:text-sm text-yellow-500'>Ready to Pickup</p>
                            <p className='flex flex-col gap-y-2 items-end'>
                                <span className='text-pink-500 font-bold text-xl'>5000/-</span>
                                <span className='p-2 bg-[#793FDF] text-white rounded-lg text-sm'>View Items</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='border-2 border-[#f2f2f2] rounded-lg p-3'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-1'>
                            <p className='font-bold lg:text-2xl text-sm'>Order Id : 146543</p>
                            <p className='text-xs text-[#6B767B]'>KLM Shopping Mall, Medipally</p>
                            <p className='font-medium text-sm lg:text-lg'>Customer:9854223588</p>
                            <p className='font-medium'></p>
                            <p className=' w-36 flex flex-col text-xs'>
                                <span>
                                    Delivery Location :
                                </span>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</p>
                        </div>
                        <div className='flex flex-col justify-between items-center'>
                            <p className='text-xs lg:text-sm text-yellow-500'>Ready to Pickup</p>
                            <p className='flex flex-col gap-y-2 items-end'>
                                <span className='text-pink-500 font-bold text-xl'>5000/-</span>
                                <span className='p-2 bg-[#793FDF] text-white rounded-lg text-sm'>View Items</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='border-2 border-[#f2f2f2] rounded-lg p-3'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-1'>
                            <p className='font-bold lg:text-2xl text-sm'>Order Id : 146543</p>
                            <p className='text-xs text-[#6B767B]'>KLM Shopping Mall, Medipally</p>
                            <p className='font-medium text-sm lg:text-lg'>Customer:9854223588</p>
                            <p className='font-medium'></p>
                            <p className=' w-36 flex flex-col text-xs'>
                                <span>
                                    Delivery Location :
                                </span>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</p>
                        </div>
                        <div className='flex flex-col justify-between items-center'>
                            <p className='text-xs lg:text-sm text-red-500'>Delivery Not Assigned</p>
                            <p className='flex flex-col gap-y-2 items-end'>
                                <span className='text-pink-500 font-bold text-xl'>5000/-</span>
                                <span className='p-2 bg-[#793FDF] text-white rounded-lg text-sm'>View Items</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='border-2 border-[#f2f2f2] rounded-lg p-3'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-1'>
                            <p className='font-bold lg:text-2xl text-sm'>Order Id : 146543</p>
                            <p className='text-xs text-[#6B767B]'>KLM Shopping Mall, Medipally</p>
                            <p className='font-medium text-sm lg:text-lg'>Customer:9854223588</p>
                            <p className='font-medium'></p>
                            <p className=' w-36 flex flex-col text-xs'>
                                <span>
                                    Delivery Location :
                                </span>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</p>
                        </div>
                        <div className='flex flex-col justify-between items-center'>
                            <p className='text-xs lg:text-sm text-yellow-500'>Ready to Pickup</p>
                            <p className='flex flex-col gap-y-2 items-end'>
                                <span className='text-pink-500 font-bold text-xl'>5000/-</span>
                                <span className='p-2 bg-[#793FDF] text-white rounded-lg text-sm'>View Items</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='border-2 border-[#f2f2f2] rounded-lg p-3'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-1'>
                            <p className='font-bold lg:text-2xl text-sm'>Order Id : 146543</p>
                            <p className='text-xs text-[#6B767B]'>KLM Shopping Mall, Medipally</p>
                            <p className='font-medium text-sm lg:text-lg'>Customer:9854223588</p>
                            <p className='font-medium'></p>
                            <p className=' w-36 flex flex-col text-xs'>
                                <span>
                                    Delivery Location :
                                </span>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</p>
                        </div>
                        <div className='flex flex-col justify-between items-center'>
                            <p className='text-xs lg:text-sm text-red-500'>Delivery Not Assigned</p>
                            <p className='flex flex-col gap-y-2 items-end'>
                                <span className='text-pink-500 font-bold text-xl'>5000/-</span>
                                <span className='p-2 bg-[#793FDF] text-white rounded-lg text-sm'>View Items</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='border-2 border-[#f2f2f2] rounded-lg p-3'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-1'>
                            <p className='font-bold lg:text-2xl text-sm'>Order Id : 146543</p>
                            <p className='text-xs text-[#6B767B]'>KLM Shopping Mall, Medipally</p>
                            <p className='font-medium text-sm lg:text-lg'>Customer:9854223588</p>
                            <p className='font-medium'></p>
                            <p className=' w-36 flex flex-col text-xs'>
                                <span>
                                    Delivery Location :
                                </span>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</p>
                        </div>
                        <div className='flex flex-col justify-between items-center'>
                            <p className='text-xs lg:text-sm text-yellow-500'>Ready to Pickup</p>
                            <p className='flex flex-col gap-y-2 items-end'>
                                <span className='text-pink-500 font-bold text-xl'>5000/-</span>
                                <span className='p-2 bg-[#793FDF] text-white rounded-lg text-sm'>View Items</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;