import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../../components/Loader'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { formatDateTime } from '@/utils/convertDate';
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
const Orders = () => {



  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState('all')
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState([]);

  useEffect(() => {
    const phone = localStorage.getItem('user_phone'); // or use context/state if available
    const token = localStorage.getItem(`${phone}_token`);

    if (!phone || !token) {
      console.error('Phone or token missing in localStorage');
      return;
    }
    // console.log(orderStatus, 'inside useeffect');
    fetch(`https://ecommstagingapi.tboo.com/admin/orders?status=${orderStatus}`, {
      method: 'GET',
      headers: {
        'Authorization': ` ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status === 'success') {
          setOrders(data.data.results?.reverse() || []);
          setCount(data.data.count_results?.reverse() || []);
        }
      })
      .catch(err => console.error('Error fetching orders:', err));
  }, [orderStatus]);

  const [sliderRef, slider] = useKeenSlider({
    loop: false,
    slides: {
      perView: 4.5, // default (mobile)
      spacing: 5,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 9,
          spacing: 5,
        },
      },
    },
  })


  return (
    <div className='flex flex-col gap-y-6'>
      {/* Top Tabs */}
      <div className=''>
        {/* <Loader/> */}
        <div className="relative w-full">
          {/* Carousel */}
          <div className=" text-xs xl:text-sm lg:text-xs">
            
              <ul  className='gap-x-10 flex  bg-red- border-2 border-[#F5F5F5] p-3 rounded-t-2xl overflow-hidden'>
            {count?.map((item,index)=>(
                <li onClick={()=>{setOrderStatus(item?.status)}} className='capitalize lg:text-base' key={index}>{item?.status?.replaceAll('_',' ')} ({item?.count})</li>
              ))}
          
            </ul>
             
              
            
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='flex lg:gap-x-6 gap-x-1 text-xs items-center'>
        <select className='px-2 py-1 rounded-md border-2 border-[#F5F5F5] outline-none'>
          <option value="all">All Stores</option>
        </select>
        <select className='px-2 py-1 rounded-md border-2 border-[#F5F5F5] outline-none'>
          <option value="all">Order Status</option>
        </select>
        <select className='px-2 py-1 rounded-md border-2 border-[#F5F5F5] outline-none'>
          <option value="all">Delivery Boy Status</option>
        </select>
      </div>

      {/* Orders */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {orders?.map(order => (
          <div key={order._id} className='border-2 border-[#f2f2f2] rounded-lg p-3 px-3'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-y-1'>
                <p className='font-bold text-xl'>Order Id : {order._id}</p>
                {order.items_json?.length > 0 && (
                  <p className='text-xs lg:text-sm xl:text-lg text-[#6B767B] font-bold capitalize'>
                    {
  (() => {
    const uniqueStoreNames = [
      ...new Set(order.items_json?.map(item => item?.store_name).filter(Boolean))
    ];

    return uniqueStoreNames.length > 0
      ? uniqueStoreNames.map((storeName, i) => (
          <span key={i}>
            {storeName}{i < uniqueStoreNames.length - 1 && ', '}
          </span>
        ))
      : 'N/A';
  })()
}

                  </p>
                )}
                <p className='font-medium'>Custome Number : {order.app_user_id}</p>
                <p className='w-40 lg:w-52 xl:w-80 flex flex-col lg:text-sm text-xs'>
                  <span>Delivery Location :</span>
                  {order.delivery_location || 'N/A'}
                </p>
              </div>
              <div className='flex flex-col lg:gap-y-6 items-end'>
                <p className={`text-sm ${order.status === 'in_cart' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {order.status === 'in_cart' ? 'Delivery Not Assigned' : order.status}
                </p>
                <p className='text-pink-500 font-bold text-xl'>
                  {order.amount_paid ? `${order.amount_paid}/-` : '0/-'}
                </p>
                <p className='p-2 bg-[#793FDF] text-white rounded-lg'><Link href={`/orders/${order._id}`}>View Items</Link></p>
                <p className='text-xs'>{formatDateTime(order.created_on)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;