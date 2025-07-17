"use client"
import Layout from '@/components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from 'next/router';

const ComponentName = (props) => {
    const [orderDetails, setOrderDetails] = useState([])
    const router = useRouter();
    console.log(router.query.maker, 'oooo');
    useEffect(() => {
        async function DevServer() {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`https://ecommstagingapis.tboo.com/admin/order-details?order_id=${router.query.maker}`, requestOptions)
                .then((response) => response.json())
                .then((result) => setOrderDetails(result?.data?.results[0]))
                .catch((error) => console.error(error));
        }
        DevServer()
    }, [router.query.maker])
    console.log(orderDetails, 'klk');

    return (
        <Layout>
            <div>
                <p className='lg:text-xl text-xs flex gap-x-3 items-center'><span className='cursor-pointer'><IoArrowBackSharp onClick={() => { router.back() }} className='size-6 lg:size-10' /></span><span className='text-[#6B757C]'>Confirmed Orders</span><span className='text-[#6B757C]'>{' > '}</span><span className='font-bold '>Order Id {orderDetails?._id}</span>  </p>
                <ul className='pt-4 flex lg:gap-x-4 lg:text-xl text-xs'>
                    <li><span className='text-[#6B757C]'> Order Placed At</span><span> {orderDetails?.created_on}</span></li>
                    <li className='border-l-2 border-l-[#6B757C]  pl-2'><span className='text-[#6B757C] capitalize'> Status</span><span> {orderDetails?.status}</span></li>
                    <li className='border-l-2 border-l-[#6B757C]  pl-2'><span className='text-[#6B757C]'>Payment</span><span> Pay On Delivery (not in api)</span></li>
                </ul>
                <div className='flex flex-col lg:flex-row gap-x-4'>
                    <div className='lg:w-[60%]'>
                        <div className='flex flex-col  rounded-lg mt-5 border-2 border-[#F5F5F5]'>
                            <p className='flex justify-between pt-8 p-4 font-bold'><span>Order List : {orderDetails?.items_json?.length}</span><span className='text-[#FF4FA3]'>{orderDetails?.product_price}/-</span></p>

                            {orderDetails?.items_json?.length &&
                                orderDetails?.items_json?.map((item,index) => (
                                    <div key={index} className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                        <div className='flex gap-x-3'>
                                            <Image src={item?.item_image} alt="line" width={500} height={300} className='rounded-lg lg:w-24 lg:h-28 w-16 h-16 ' />
                                            <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-[16px] text-xs'>
                                                <li className='text-black'>{item?.item_name}</li>
                                                <li>Item Id : {item?._id}</li>
                                                <li>Qty : {item?.quantity}</li>
                                                <li>Size : {item?.size}</li>
                                            </ul>
                                        </div>
                                        <p className='font-semibold text-[#FF4FA3]'>{item?.price}/-</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className=' p-2 rounded-lg  mt-2 pl-4 border-2 border-[#F5F5F5]'>
                            <p className='font-semibold text-lg'>Price Details</p>
                            <div className='flex lg:flex-row flex-col gap-x-5 gap-y-3 text-sm pt-2'>
                                <div className='flex gap-x-3'><p className='flex flex-col gap-y-1'><span>{orderDetails?.product_price}</span><span className='text-[#6B767B]'>Customer price</span></p>
                                    <p>-</p>
                                    <p className='flex flex-col gap-y-1'><span>{orderDetails?.delivery_price}</span><span className='text-[#6B767B]'>Delivery Fee</span></p>
                                    <p>-</p></div>
                                <div className='flex gap-x-3'><p className='flex flex-col gap-y-1'><span>{"0"}</span><span className='text-[#6B767B]'>Merchant Price</span></p>
                                    <p>=</p>
                                    <p className='flex flex-col gap-y-1'><span>{(orderDetails?.product_price - orderDetails?.delivery_price)}</span><span className='text-[#6B767B]'>Remaining Amount</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 flex flex-col gap-y-4 lg:text-[16px] text-sm'>
                        <ul className=' p-3 flex flex-col gap-y-1 rounded-lg border-2 border-[#F5F5F5]'>
                            <li className='font-bold'>Customer Details</li>
                            <li>Number : {orderDetails?.user_phone}</li>
                            <li>Delivery Location : </li>
                            <li className='w-3/4'>
                                {orderDetails?.delivery_location}</li>
                        </ul>
                        <p className='font-bold pl-2 text-lg'>Store details</p>
                        {orderDetails?.store_details?.map((item,index) => (
                            <ul key={index} className=' p-3 flex flex-col gap-y-1 rounded-lg border-2 border-[#F5F5F5]'>
                                {/* <li className='font-bold'>Store Details</li> */}
                                <li className='font-bold capitalize'>Name : {item?.store_name}</li>
                                <li>Number : {item?.store_id}</li>
                                <li>Store Location :</li>
                                <li className='w-1/2'>{item?.address}</li>
                            </ul>
                        ))}

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