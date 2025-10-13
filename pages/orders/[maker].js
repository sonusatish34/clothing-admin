"use client"
import Layout from '@/components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { formatDateTime } from '@/utils/convertDate';
import { HiOutlineArrowSmLeft } from "react-icons/hi";

const ComponentName = (props) => {
    const [orderDetails, setOrderDetails] = useState([])
    const [deliveryDetails, setDeliveryDetails] = useState([])
    const router = useRouter();

    useEffect(() => {
        async function DevServer() {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`https://ecommstagingapi.tboo.com/admin/order-details?order_id=${router.query.maker}`, requestOptions)
                .then((response) => response.json())
                .then((result) => setOrderDetails(result?.data?.results[0]))
                .catch((error) => console.error(error));
        }
        DevServer()

        async function delivery_details(params) {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`https://ecommstagingapi.tboo.com/admin/delivery-partner-details?order_id=${router.query.maker}`, requestOptions)
                .then((response) => response.json())
                .then((result) => setDeliveryDetails(result))
                .catch((error) => console.error(error));
        }
        delivery_details()
    }, [router.query.maker])

    return (
        <Layout>
            <div>
                <p className='lg:text-xl text-xs flex gap-x-3 items-center'><span className='cursor-pointer'><HiOutlineArrowSmLeft onClick={() => { router.back() }} className='size-6 lg:size-12' /></span><span className='text-[#6B757C] capitalize'>{orderDetails?.status} Orders</span><span className='text-[#6B757C]'>{' > '}</span><span className='font-bold '>Order Id : {orderDetails?._id}</span>  </p>
                <ul className='pt-4 flex lg:gap-x-4 xl:text-xl lg:text-lg text-xs'>
                    <li><span className='text-[#6B757C]'> Order Placed At</span><span> {formatDateTime(orderDetails?.created_on)}</span></li>
                    <li className='border-l-2 border-l-[#6B757C]  pl-2'><span className='text-[#6B757C] capitalize'> Status</span><span> {orderDetails?.status}</span></li>
                    <li className='border-l-2 border-l-[#6B757C]  pl-2'><span className='text-[#6B757C]'>Payment</span><span> Pay On Delivery (not in api)</span></li>
                </ul>
                <div className='flex flex-col lg:flex-row gap-x-4'>
                    <div className='lg:w-[60%]'>
                        <div className='flex flex-col  rounded-lg mt-5 border-2 border-[#F5F5F5]'>
                            <p className='flex justify-between pt-8 p-4 font-bold'><span>Order List : {orderDetails?.items_json?.length}</span><span className='text-[#FF4FA3]'>{orderDetails?.product_price}/-</span></p>

                            {orderDetails?.items_json?.length &&
                                orderDetails?.items_json?.map((item, index) => (
                                    <div key={index} className='flex gap-x-1 justify-between border-t-4 border-t-[#F5F5F5] lg:p-4 p-1 py-2'>
                                        <div className='flex gap-x-3'>
                                            <Image src={item?.item_image} alt="line" width={500} height={300} className='rounded-lg lg:w-32 lg:h-36 w-16 h-full ' />
                                            <ul className='flex flex-col gap-y-1 text-[#6B767B] lg:text-sm text-xs'>
                                                <li className='text-black'>{item?.item_name}</li>
                                                <li>Item Id : {item?._id}</li>
                                                <li>Qty : {item?.quantity}</li>
                                                <li>Size : {item?.size}</li>
                                                <li>Gender : {item?.gender}</li>
                                                <li>Color : {item?.color}</li>
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
                            <li>Name : {orderDetails?.user_name || 'NA'}</li>
                            <li>Number : {orderDetails?.user_phone}</li>
                            <li>Delivery Location : </li>
                            <li className='w-3/4'>
                                {orderDetails?.delivery_location}</li>
                        </ul>
                        <div className='flex flex-col gap-y-2 rounded-lg border-2 border-[#F5F5F5] p-3'>
                            <p className='font-bold text-lg px-3'>Store details</p>
                            {console.log(orderDetails,'000000')
                            }
                            {orderDetails?.store_details && orderDetails?.store_details?.map((item, index) => (
                                <ul key={index} className='flex flex-col gap-y-1 p-3 rounded-lg border-2 border-[#F5F5F5]'>
                                    <li >Name : <span className='font-bold capitalize'>{item?.store_name}</span></li>
                                    <li>Store No : {item?.store_id}</li>
                                    <li>Store Location :</li>
                                    <li className='w-1/2'>{item?.address}</li>
                                </ul>
                            ))}
                        </div>

                        <div className='flex flex-col gap-y-1 p-3 rounded-lg border-2 border-[#F5F5F5]'>
                            <p className='font-bold px-3'>Delivery Boy Details</p>
                            {deliveryDetails?.data?.map((item, ind) => (
                                <ul key={ind} className='flex flex-col gap-y-1 p-3 rounded-lg border-2 border-[#F5F5F5]'>
                                    {/* <li className='font-bold'>Delivery Boy Details</li> */}
                                    <li className='flex gap-x-3'>
                                        <Image src={item?.pickup_image_url} alt="line" width={500} height={300} className='rounded-lg w-24 h-24' />
                                        <p className='flex flex-col gap-y-1 text-[#6B767B]'>
                                            <span className='text-black'>{item?.delivery_partner_name}  </span>
                                            <span>{item?.delivery_partner_number}</span>
                                            <span>Assigned 7 : 30 AM</span>
                                        </p>
                                    </li>
                                    <li>Order Earnings : {item?.amount_gained}</li>
                                </ul>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ComponentName;