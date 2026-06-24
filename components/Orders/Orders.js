import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../../components/Loader';
import { formatDateTime } from '@/utils/convertDate';
import Image from 'next/image';
import { CiSquarePlus } from "react-icons/ci";

const Orders = () => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const statuses = ["all", "in_cart", "booked", "order_assigned", "delivered", "returned", "canceled"];

  // Fetch Order counts
  useEffect(() => {
    async function fetchCounts() {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      // Note: Move this hardcoded string token to an environment variable (.env) for security production builds
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch("https://dev.zuget.com/admin/orders-count", requestOptions);
        const result = await response.json();
        if (result?.data?.count_results) {
          setCount(result.data.count_results.reverse());
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }
    fetchCounts();
  }, []);

  // Fetch Orders based on status
  useEffect(() => {
    const fetchOrders = (showLoader = false) => {
      if (showLoader) setIsLoading(true);
      
      const phone = localStorage.getItem('user_phone');
      const token = localStorage.getItem(`${phone}_token`);

      if (!phone || !token) {
        console.error('Phone or token missing in localStorage');
        setIsLoading(false);
        return;
      }

      fetch(`https://dev.zuget.com/admin/orders?status=${orderStatus}`, {
        method: 'GET',
        headers: {
          'Authorization': ` ${token}`,
          'Accept': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.status === 'success') {
            setOrders(data.data.results?.reverse() || []);
          }
        })
        .catch(err => console.error('Error fetching orders:', err))
        .finally(() => {
          setIsLoading(false);
        });
    };

    // Trigger initial load with spinner visibility turned on
    fetchOrders(true);

    // Continuous polling updates in background without jarring loading animations
    const id = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => clearInterval(id);
  }, [orderStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_cart': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'canceled': return 'text-red-600 bg-red-50 border-red-200';
      case 'booked': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='flex flex-col gap-y-6 p-4 max-w-7xl mx-auto w-full'>
      {/* Top Tabs */}
      <div className="w-full border-b border-gray-200">
        <ul className="flex gap-x-6 overflow-x-auto no-scrollbar pb-px whitespace-nowrap scroll-smooth-touch">
          {statuses.map((status) => {
            const filtered = count.filter((item) => item.status === status);
            const item = filtered[0];
            const isActive = orderStatus === status;
            return (
              <li
                key={status}
                onClick={() => setOrderStatus(status)}
                className={`capitalize text-sm pb-3 cursor-pointer border-b-2 font-medium transition-all duration-200 ease-in-out select-none
                  ${isActive 
                    ? 'border-[#793FDF] text-[#793FDF] font-bold scale-105' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {status.replaceAll('_', ' ')} 
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-[#793FDF] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {item ? item.count : 0}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Contents Area */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium">
          No orders found for this status.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {orders.map(order => (
            <div 
              key={order._id} 
              className='bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-xl p-4 lg:p-5 transition-all duration-200 flex flex-col justify-between gap-y-4'
            >
              {/* Card Header Information */}
              <div className='flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-gray-50 pb-3'>
                <div>
                  <h3 className='font-bold text-base lg:text-lg text-gray-900 break-all sm:break-normal'>
                    Order ID: <span className="text-gray-600 font-medium text-sm sm:text-base">{order._id}</span>
                  </h3>
                  {order.items_json?.length > 0 && (
                    <p className='text-xs sm:text-sm text-gray-500 font-semibold mt-0.5 capitalize'>
                      {(() => {
                        const uniqueStoreNames = [
                          ...new Set(order.items_json?.map(item => item?.store_name).filter(Boolean))
                        ];
                        return uniqueStoreNames.length > 0 ? uniqueStoreNames.join(', ') : 'N/A';
                      })()}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order?.status?.replaceAll('_', ' ')}
                </span>
              </div>

              {/* Card Body Core Metadata */}
              <div className='flex flex-row justify-between items-center gap-4'>
                <div className='flex flex-col gap-y-1.5 flex-1 min-w-0'>
                  <p className='text-xs sm:text-sm text-gray-700 font-medium'>
                    <span className="text-gray-400">Customer:</span> {order?.user_phone}
                  </p>
                  <div className='text-xs sm:text-sm text-gray-600 flex flex-col'>
                    <span className="text-gray-400 font-medium">Delivery Location:</span>
                    <p className="truncate-2-lines text-gray-700 mt-0.5 font-medium">
                      {order.delivery_location || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Optional Micro Thumbnails Preview Array */}
                {order?.items_json?.length > 0 && (
                  <div className='hidden sm:flex flex-col items-center justify-center gap-1.5 flex-shrink-0 bg-gray-50 p-2 rounded-lg'>
                    {order.items_json.slice(0, 2).map((item, index) => (
                      <Image 
                        alt='item preview' 
                        key={index} 
                        src={item?.item_image || '/placeholder-image.png'} 
                        className='h-10 w-10 object-cover rounded-md border border-gray-200' 
                        height={40} 
                        width={40} 
                      />
                    ))}
                    {order?.items_json.length > 2 && (
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <CiSquarePlus size={24} />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className='flex flex-row justify-between items-center border-t border-gray-50 pt-3 mt-auto'>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Total Price</span>
                  <p className='text-rose-500 font-bold text-lg sm:text-xl'>
                    {order.product_price ? `₹${order.product_price}/-` : '₹0/-'}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-y-1">
                  <Link 
                    className='px-4 py-2 bg-[#793FDF] hover:bg-[#6432b8] text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-sm' 
                    href={`/orders/${order._id}`}
                  >
                    View Items
                  </Link>
                  <p className='text-[10px] text-gray-400 font-medium mt-1'>{formatDateTime(order.created_on)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;