"use client";
import Layout from '@/components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { formatDateTime } from '@/utils/convertDate';
import { MdKeyboardBackspace } from "react-icons/md";

const ComponentName = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [deliveryDetails, setDeliveryDetails] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchOrderDetails() {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            try {
                const response = await fetch(`https://ecommstagingapi.tboo.com/admin/order-details?order_id=${router.query.maker}`, requestOptions);
                const result = await response.json();
                setOrderDetails(result?.data?.results[0]);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchDeliveryDetails() {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            try {
                const response = await fetch(`https://ecommstagingapi.tboo.com/admin/delivery-partner-details?order_id=${router.query.maker}`, requestOptions);
                const result = await response.json();
                setDeliveryDetails(result?.data || []);
            } catch (error) {
                console.error(error);
            }
        }

        if (router.query.maker) {
            fetchOrderDetails();
            fetchDeliveryDetails();
        }
    }, [router.query.maker]);

    // Group items by store_id
    const groupedItemsByStore = orderDetails?.store_details?.reduce((acc, store) => {
        const items = orderDetails.items_json?.filter(item => item.store_id === store.store_id) || [];
        if (items.length) {
            acc.push({ store, items });
        }
        return acc;
    }, []);

    console.log(groupedItemsByStore, '333');

    return (
        <Layout>
            <div>
                {/* Header */}
                <p className='lg:text-xl text-xs flex gap-x-3 items-center'>
                    <span className='cursor-pointer'>
                        <MdKeyboardBackspace onClick={() => router.back()} className='size-6 lg:size-12' />
                    </span>
                    <span className='text-[#6B757C] capitalize'>{orderDetails?.status.replaceAll('_', ' ')} Orders</span>
                    <span className='text-[#6B757C]'>{' > '}</span>
                    <span className='font-bold'>Order Id : {orderDetails?._id}</span>
                </p>

                {/* Order Info */}
                <ul className='pt-4 flex lg:gap-x-4 xl:text-xl lg:text-lg text-xs'>
                    <li><span className='text-[#6B757C]'> Order Placed On</span><span> {formatDateTime(orderDetails?.created_on)}</span></li>
                    <li className='border-l-2 border-l-[#6B757C] capitalize pl-2'><span className='text-[#6B757C]'>Status</span><span> {orderDetails?.status.replaceAll('_', ' ')}</span></li>
                    <li className='border-l-2 border-l-[#6B757C] pl-2'><span className='text-[#6B757C]'>Payment</span><span> {orderDetails?.payment_method}</span></li>
                </ul>

                {/* Store-wise Grouped Orders */}
                <div className='flex flex-col gap-y-6 mt-5'>
                    {groupedItemsByStore?.map(({ store, items }, index) => (
                        <div key={index} className='border-2 border-[#F5F5F5] bg-[#ECF3FE99] rounded-lg p-4'>
                            {/* Store Header */}
                            <h3 className='text-xl font-bold text-[#7A69E7]'>From {store.store_name}</h3>
                            <p className='flex lg:gap-x-10'>
                                <span className='text-sm lg:text-base text-[#6B767B] w-1/2'><strong>Location :</strong> {store.address}</span>
                                <span className='text-sm lg:text-base text-[#6B767B]'><strong>Store Number :</strong>  {store.store_id}</span>
                            </p>
                            {/* Order Items */}
                            <div className='flex lg:gap-x-20'>
                                <div className='mt-4 bg-white w-1/2 p-2'>
                                    <p className='flex justify-between font-bold'>
                                        <span>Order List : {items.length}</span>
                                        <span className='text-[#FF4FA3]'>{orderDetails.product_price}/-</span>
                                    </p>

                                    {items.map((item, idx) => (
                                        <div key={idx} className='flex justify-between border-t-4 border-[#F5F5F5] py-3'>
                                            <div className='flex gap-x-3'>
                                                <Image src={item?.item_image} alt="item" width={500} height={300} className='rounded-lg lg:w-32 lg:h-36 w-16 h-full' />
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
                                    ))}
                                </div>
                                {/* Details Section */}
                                <div className='flex flex-col mt-4 gap-y-3 w-1/2'>
                                    {/* Customer Info */}
                                    <ul className='p-3 flex flex-col gap-y-1 rounded-lg border-2 border-[#F5F5F5] w-full bg-white'>
                                        <li className='font-bold'>Customer Details</li>
                                        <li>Name : {orderDetails?.user_name || 'NA'}</li>
                                        <li>Number : {orderDetails?.user_phone}</li>
                                        <li>Delivery Location :</li>
                                        <li>{orderDetails?.delivery_location || 'NA'}</li>
                                    </ul>

                                    {/* Delivery Boy Info */}
                                    {deliveryDetails.length ? <ul className='p-3 flex flex-col gap-y-1 rounded-lg border-2 border-[#F5F5F5] w-full bg-white0'>
                                        <li className='font-bold'>Delivery Boy Details</li>
                                        {deliveryDetails?.map((boy, i) => (
                                            <li key={i} className='flex gap-x-3 items-start'>
                                                <Image src={boy?.pickup_image_url} alt="dp" width={500} height={300} className='rounded-lg w-20 h-20' />
                                                <div className='flex flex-col text-sm text-[#6B767B]'>
                                                    <span className='text-black'>{boy?.delivery_partner_name}</span>
                                                    <span>{boy?.delivery_partner_number}</span>
                                                    <span>Assigned 7:30 AM</span>
                                                    <span>Earnings: {boy?.amount_gained}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul> : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Price Breakdown */}
                    <div className='rounded-lg border-2 border-[#F5F5F5] p-3 w-full lg:w-fit'>
                        <p className='font-semibold text-lg'>Price Details</p>
                        <div className='flex flex-wrap gap-x-3 text-sm pt-2'>
                            <div className='flex flex-col gap-y-1'>
                                <span>{orderDetails?.product_price}</span>
                                <span className='text-[#6B767B]'>Customer Price</span>
                            </div>
                            <p>-</p>
                            <div className='flex flex-col gap-y-1'>
                                <span>{orderDetails?.delivery_price}</span>
                                <span className='text-[#6B767B]'>Delivery Fee</span>
                            </div>
                            <p>=</p>
                            <div className='flex flex-col gap-y-1'>
                                <span>{(orderDetails?.product_price - orderDetails?.delivery_price)}</span>
                                <span className='text-[#6B767B]'>Remaining Amount</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ComponentName;
