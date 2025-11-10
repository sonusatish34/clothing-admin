import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../../components/Loader'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { formatDateTime } from '@/utils/convertDate';
import Image from 'next/image';
import { CiSquarePlus } from "react-icons/ci";

const Orders = () => {

  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState('all')
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    async function kk(params) {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("https://ecommstagingapi.tboo.com/admin/orders-count", requestOptions)
        .then((response) => response.json())
        .then((result) => setCount(result?.data?.count_results?.reverse()))
        .catch((error) => console.error(error));
    }
    kk()
  }, [])

  useEffect(() => {
    const fetchOrders = () => {
      const phone = localStorage.getItem('user_phone');
      const token = localStorage.getItem(`${phone}_token`);

      if (!phone || !token) {
        console.error('Phone or token missing in localStorage');
        return;
      }

      fetch(`https://ecommstagingapi.tboo.com/admin/orders?status=${orderStatus}`, {
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
        .catch(err => console.error('Error fetching orders:', err));
    };

    // Fetch orders initially
    fetchOrders();

    // Set an interval to fetch orders every 20 seconds
    const id = setInterval(fetchOrders, 10000);
    setIntervalId(id);

    // Clean up the interval when the component is unmounted or when `orderStatus` changes
    return () => {
      clearInterval(id);
    };
  }, [orderStatus]); // The effect runs every time `orderStatus` changes

  const [sliderRef, slider] = useKeenSlider({
    loop: false,
    slides: {
      perView: 4.5,
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


  const statuses = ["all", "in_cart", "booked", "order_assigned", "delivered", "returned", "canceled"];

 


  return (
    <div className='flex flex-col gap-y-6'>
      {/* Top Tabs */}
      <div className=''>
        {/* <Loader/> */}
        <div className="relative w-full">
          <div className="text-xs xl:text-sm lg:text-xs">
            {/* <ul className='gap-x-10 flex  bg-red- border-2 border-[#F5F5F5] p-3 rounded-t-2xl overflow-hidden'>
              

              {count.filter((item => item.status === "all"))?.length ? count.filter((item => item.status === "all")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('all') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>all dummy (0)
                </li>
              }
               {count.filter((item => item.status === "in_cart"))?.length ? count.filter((item => item.status === "in_cart")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('in_cart') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>in cart (0)
                </li>
              }
              {count.filter((item => item.status === "booked"))?.length ? count.filter((item => item.status === "booked")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('booked') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>booked (0)
                </li>
              }
              {count.filter((item => item.status === "order_assigned"))?.length ? count.filter((item => item.status === "order_assigned")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('order_assigned') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>order assigned (0)
                </li>
              }
              {count.filter((item => item.status === "delivered"))?.length ? count.filter((item => item.status === "delivered")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('delivered') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>delivered (0)
                </li>
              }
              {count.filter((item => item.status === "returned"))?.length ? count.filter((item => item.status === "returned")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('returned') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>returned (0)
                </li>
              }
              {count.filter((item => item.status === "canceled"))?.length ? count.filter((item => item.status === "canceled")).map((item) => (
                <li onClick={() => { setOrderStatus(item?.status) }}
                  className={`capitalize lg:text-sm cursor-pointer ${item.status == orderStatus && 'text-[#793FDF] font-bold'}`}
                  key={`${item?.status} index`}>{item?.status?.replaceAll('_', ' ')} ({item?.count})
                </li>
              )) :
                <li onClick={() => { setOrderStatus('canceled') }}
                  className={`capitalize lg:text-sm cursor-pointer ${'text-[#793FDF] font-bold'}`}
                  key={`1 index`}>canceled (0)
                </li>
              }
             

            </ul> */}

            <ul className="gap-x-10 flex bg-red- border-2 border-[#F5F5F5] p-3 rounded-t-2xl overflow-hidden">
              {statuses.map((status) => {
                const filtered = count.filter((item) => item.status === status);
                const item = filtered[0];
                return (
                  <li
                    key={status}
                    onClick={() => setOrderStatus(status)}
                    className={`hover:underline capitalize lg:text-sm cursor-pointer ${orderStatus === status ? 'text-[#793FDF] font-bold' : ''}`}
                  >
                    {status.replaceAll('_', ' ')} ({item ? item.count : 0})
                  </li>
                );
              })}
            </ul>


          </div>
        </div>
      </div>

      {/* Filters */}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {orders?.map(order => (
          <div key={order._id} className='border-2 border-[#f2f2f2] rounded-lg p-3 px-3 lg:hover:scale-95 delay- transition-all ease-in-out'>
            <div className='flex justify-evenly'>
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
                <p className='font-medium'>Custome Number : {order?.user_phone}</p>
                <p className='w-40 lg:w-52 xl:w-72 flex flex-col lg:text-sm text-xs'>
                  <span>Delivery Location :</span>
                  {order.delivery_location || 'N/A'}
                </p>
              </div>
              {/* <div><Image src={order?.items_json[0]?.item_image} className='h-32 w-32' height={100} width={200}/></div> */}
              <div>
                <div className='lg:flex hidden flex-col  items-center gap-y-3'>
                  {order?.items_json?.slice(0, 2).map((item, index) => (
                    <Image key={index} src={item?.item_image} className='h-12 w-12 rounded-md' height={100} width={200} />
                  ))}
                  {(order?.items_json.length > 2 && <span><CiSquarePlus size={30} /></span>)}
                </div>
              </div>
              <div className='flex flex-col lg:gap-y-6 items-end'>
                <p className={`capitalize font-semibold text-sm ${order.status == 'in_cart' && 'text-blue-700' || order.status == 'canceled' && 'text-red-700' || order.status == 'booked' && 'text-green-700'}`}>
                  {order?.status?.replaceAll('_', ' ')}
                </p>
                <p className='text-pink-500 font-bold text-xl'>
                  {order.product_price ? `${order.product_price}/-` : '0/-'}
                </p>
                <Link className='p-2 bg-[#793FDF] text-white rounded-lg' href={`/orders/${order._id}`}>View Items</Link>
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