import Layout from '@/components/Layout/Layout';
import React from 'react';
import Image from 'next/image';
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from 'next/router';

const ComponentName = (props) => {
    const router = useRouter();
    return (
        <Layout>
            <div>
                <p className='lg:text-xl text-xs flex gap-x-3 items-center'><span><IoArrowBackSharp onClick={()=>{router.back()}} className='size-6 lg:size-10 cursor-pointer' /></span><span className='text-[#6B757C]'>Confirmed Orders</span><span className='text-[#6B757C]'>{' > '}</span><span className='font-bold '>Order Id : 1456876</span>  </p>
                <ul className='pt-4 flex lg:gap-x-4 lg:text-xl text-xs'>
                    <li><span className='text-[#6B757C]'> Order Placed At</span><span> 7:30 PM</span></li>
                    <li className='border-l-2 border-l-[#6B757C]  pl-2'><span className='text-[#6B757C]'> Status</span><span> Booked</span></li>
                    <li className='border-l-2 border-l-[#6B757C]  pl-2'><span className='text-[#6B757C]'>Payment</span><span> Pay On Delivery</span></li>
                </ul>
                <div className='flex flex-col lg:flex-row gap-x-4'>
                    <div className='lg:w-[60%]'>
                        <div className='flex flex-col  rounded-lg mt-5 border-2 border-[#F5F5F5]'>
                            <p className='flex justify-between pt-8 p-4 font-bold'><span>Order List : 5</span><span className='text-[#FF4FA3]'>5000/-</span></p>
                            <div className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                <div className='flex gap-x-3'>
                                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg lg:w-24 lg:h-28 w-16 h-16 ' />
                                    <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-[16px] text-xs'>
                                        <li className='text-black'>Flying Machine T-Shirt</li>
                                        <li>Item Id : 14545</li>
                                        <li>Qty : 1</li>
                                        <li>Size : XL</li>
                                    </ul>
                                </div>
                                <p className='font-semibold'>5000/-</p>
                            </div>
                            <div className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                <div className='flex gap-x-3'>
                                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg lg:w-24 lg:h-28 w-16 h-16 ' />
                                    <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-[16px] text-xs'>
                                        <li className='text-black'>Flying Machine T-Shirt</li>
                                        <li>Item Id : 14545</li>
                                        <li>Qty : 2</li>
                                        <li>Size : XL</li>
                                    </ul>
                                </div>
                                <p className='font-semibold'>5000/-</p>
                            </div>
                            <div className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                <div className='flex gap-x-3'>
                                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg lg:w-24 lg:h-28 w-16 h-16 ' />
                                    <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-[16px] text-xs'>
                                        <li className='text-black'>Flying Machine T-Shirt</li>
                                        <li>Item Id : 14545</li>
                                        <li>Qty : 2</li>
                                        <li>Size : XL</li>
                                    </ul>
                                </div>
                                <p className='font-semibold'>5000/-</p>
                            </div>
                        </div>
                        {router.query.maker === 'returned' && <div className='flex flex-col  rounded-lg mt-5 border-2 border-[#F5F5F5]'>
                            <p className='flex justify-between pt-8 p-4 font-bold'><span>Return items : 2</span><span className='text-[#FF4FA3]'>5000/-</span></p>
                            <div className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                <div className='flex gap-x-3'>
                                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg lg:w-24 lg:h-28 w-16 h-16 ' />
                                    <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-[16px] text-xs'>
                                        <li className='text-black'>Flying Machine T-Shirt</li>
                                        <li>Item Id : 14545</li>
                                        <li>Qty : 1</li>
                                        <li>Size : XL</li>
                                    </ul>
                                </div>
                                <p className='font-semibold'>5000/-</p>
                            </div>
                           
                            <div className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                <div className='flex gap-x-3'>
                                    <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg lg:w-24 lg:h-28 w-16 h-16 ' />
                                    <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-[16px] text-xs'>
                                        <li className='text-black'>Flying Machine T-Shirt</li>
                                        <li>Item Id : 14545</li>
                                        <li>Qty : 1</li>
                                        <li>Size : XL</li>
                                    </ul>
                                </div>
                                <p className='font-semibold'>5000/-</p>
                            </div>
                        </div>}
                        <div className=' p-2 rounded-lg  mt-2 pl-4 border-2 border-[#F5F5F5]'>
                            <p className='font-semibold text-lg'>Price Details</p>
                            <div className='flex lg:flex-row flex-col gap-x-5 gap-y-3 text-sm pt-2'>
                                <div className='flex gap-x-3'><p className='flex flex-col gap-y-1'><span>5000</span><span className='text-[#6B767B]'>Customer price</span></p>
                                    <p>-</p>
                                    <p className='flex flex-col gap-y-1'><span>400</span><span className='text-[#6B767B]'>Delivery Fee</span></p>
                                    <p>-</p></div>
                                <div className='flex gap-x-3'><p className='flex flex-col gap-y-1'><span>3000</span><span className='text-[#6B767B]'>Merchant Price</span></p>
                                    <p>=</p>
                                    <p className='flex flex-col gap-y-1'><span>1600</span><span className='text-[#6B767B]'>Remaining Amount</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 flex flex-col gap-y-4 lg:text-[16px] text-sm'>
                        <ul className=' p-3 flex flex-col gap-y-1 rounded-lg border-2 border-[#F5F5F5]'>
                            <li className='font-bold'>Customer Details</li>
                            <li>Number : 12454546545</li>
                            <li>Delivery Location : </li>
                            <li className='w-3/4'>
                                Long Drive Cars
                                Bhartpur Colony
                                Medipally
                                Hyderbad</li>
                        </ul>
                        <ul className=' p-3 flex flex-col gap-y-1 rounded-lg border-2 border-[#F5F5F5]'>
                            <li className='font-bold'>Store Details</li>
                            <li>Name : KLM Shopping Mall</li>
                            <li>Number : 12454546545</li>
                            <li>Store Location :</li>
                            <li className='w-1/2'>Medipally</li>
                        </ul>
                        <ul className='flex flex-col gap-y-1 p-3 rounded-lg border-2 border-[#F5F5F5]'>
                            <li className='font-bold'>Delivery Boy Details</li>
                            <li className='flex gap-x-3'>
                                <Image src="/images/line.png" alt="line" width={500} height={300} className='rounded-lg w-24 h-24' />
                                <p className='flex flex-col gap-y-1 text-[#6B767B]'>
                                    <span className='text-black'>Dasari Chandra Sh.....  </span>
                                    <span>6303968115</span>
                                    <span>Assigned 7 : 30 AM</span>
                                </p>
                            </li>
                            <li>Order Earnings : 400</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ComponentName;