import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../../components/Loader'
const Orders = () => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState('all')
  const containerRef = useRef(null);
  const [orders, setOrders] = useState([]);

  const scrollLeft = () => containerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  const scrollRight = () => containerRef.current.scrollBy({ left: 150, behavior: 'smooth' });

  useEffect(() => {
    const phone = localStorage.getItem('user_phone'); // or use context/state if available
    const token = localStorage.getItem(`${phone}_token`);

    if (!phone || !token) {
      console.error('Phone or token missing in localStorage');
      return;
    }
    console.log(orderStatus, 'inside useeffect');


    fetch(`https://ecommstagingapis.tboo.com/admin/orders?status=${orderStatus}`, {
      method: 'GET',
      headers: {
        'Authorization': ` ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status === 'success') {
          setOrders(data.data.results || []);
        }
      })
      .catch(err => console.error('Error fetching orders:', err));
  }, [orderStatus]);
  console.log(orders, '----');


  return (
    <div className='flex flex-col gap-y-6'>
      {/* Top Tabs */}
      <div className=''>
        <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
          <li className={`${orderStatus=='all'?'text-[#793FDF] font-bold':''}`} onClick={() => { setOrderStatus('all') }}>All</li>
          <li className={`${orderStatus=='booked'?'text-[#793FDF] font-bold':''}`} onClick={() => { setOrderStatus('booked') }}>Booked</li>
          <li className={`${orderStatus=='in_cart'?'text-[#793FDF] font-bold':''}`} onClick={() => { setOrderStatus('in_cart') }}>In Cart</li>
          <li>Returned</li>
          <li>Replaced</li>
          <li>Completed</li>
          <li>Customer Cancelled</li>
          <li>Cancelled</li>

        </ul>
        {/* <Loader/> */}
        <div className="navbar-carousel text-xs">
          <button className="nav-btn" onClick={scrollLeft}>‹</button>
          <div className="nav-items flex gap-x-1" ref={containerRef}>
            {['Confirmed', 'In Delivery', 'Returned', 'Completed', 'Cancelled'].map((item, idx) => (
              <div className="nav-item" key={idx}>{item}</div>
            ))}
          </div>
          <button className="nav-btn" onClick={scrollRight}>›</button>
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
        {orders.map(order => (
          <div key={order._id} className='border-2 border-[#f2f2f2] rounded-lg p-3 px-3'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-y-1'>
                <p className='font-bold text-2xl'>Order Id : {order._id}</p>
                {order.items_json?.length > 0 && (
                  <p className='text-xs lg:text-lg text-[#6B767B] font-bold capitalize'>
                    {order.items_json[0]?.store_name}
                  </p>
                )}
                <p className='font-medium'>Customer : {order.app_user_id}</p>
                <p className='w-40 lg:w-64 flex flex-col text-sm'>
                  <span>Delivery Location :</span>
                  {order.delivery_location || 'N/A'}
                </p>
              </div>
              <div className='flex flex-col justify-between lg:items-end items-center'>
                <p className={`text-sm ${order.status === 'in_cart' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {order.status === 'in_cart' ? 'Delivery Not Assigned' : order.status}
                </p>
                <p className='flex flex-col gap-y-2 items-end'>
                  <span className='text-pink-500 font-bold text-xl'>
                    {order.amount_paid ? `${order.amount_paid}/-` : '0/-'}
                  </span>
                  <span className='p-2 bg-[#793FDF] text-white rounded-lg'><Link href={`/orders/${order._id}`}>View Items</Link></span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;