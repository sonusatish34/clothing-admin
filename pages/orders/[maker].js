"use client";

import Layout from "@/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatDateTime } from "@/utils/convertDate";
import { MdKeyboardBackspace } from "react-icons/md";
import Loader from "../../components/Loader";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { maker: orderId } = router.query;

  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ================= FETCH ORDER DETAILS =================
  useEffect(() => {
    if (!orderId) return;

    async function fetchOrderDetails() {
      setIsLoading(true);
      try {
        const phone = localStorage.getItem("user_phone");
        const token = localStorage.getItem(`${phone}_token`);

        const res = await fetch(
          `https://api.zuget.com/admin/order-details?order_id=${orderId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: token || "",
            },
          }
        );

        const result = await res.json();
        setOrderDetails(result?.data?.results[0] || null);
      } catch (err) {
        console.error("Order API Error:", err);
      } finally {
        // If there are no stores, stop the loader here
        if (!orderDetails?.store_details?.length) {
          setIsLoading(false);
        }
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  // ================= FETCH DELIVERY DETAILS (DYNAMIC STORE ID) =================
  useEffect(() => {
    if (!orderDetails?.store_details?.length || !orderId) {
      if (orderDetails) setIsLoading(false);
      return;
    }

    async function fetchDeliveryDetails() {
      try {
        const storeId = orderDetails.store_details[0].store_id;
        const phone = localStorage.getItem("user_phone");
        const token = localStorage.getItem(`${phone}_token`);

        const res = await fetch(
          `https://api.zuget.com/admin/delivery-partner-details?order_id=${orderId}&store_id=${storeId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: token || "",
            },
          }
        );

        const result = await res.json();
        setDeliveryDetails(result?.data || []);
      } catch (err) {
        console.error("Delivery API Error:", err);
      } refinement: {
        setIsLoading(false);
      }
    }

    fetchDeliveryDetails();
  }, [orderDetails, orderId]);

  // ================= GROUP ITEMS BY STORE =================
  const groupedItemsByStore = orderDetails?.store_details?.reduce(
    (acc, store) => {
      const items =
        orderDetails.items_json?.filter(
          (item) => item.store_id === store.store_id
        ) || [];

      if (items.length) acc.push({ store, items });
      return acc;
    },
    []
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'in_cart': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'booked': return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 w-full flex flex-col gap-y-6">
        
        {/* Header Breadcrumbs navigation block */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-x-2">
            <MdKeyboardBackspace
              onClick={() => router.back()}
              className="cursor-pointer size-8 text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 p-1.5 rounded-full"
            />
            <span className="text-gray-400 capitalize text-sm font-medium">
              {orderDetails?.status?.replaceAll("_", " ") || "Loading"} Orders
            </span>
            <span className="text-gray-300 text-xs">{">"}</span>
          </div>
          <h1 className="font-bold text-gray-900 text-base sm:text-lg break-all">
            Order ID : <span className="text-gray-500 font-medium">{orderDetails?._id || orderId}</span>
          </h1>
        </div>

        {/* Global Loading Condition State */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : !orderDetails ? (
          <div className="text-center py-16 text-gray-500 font-medium">
            Could not retrieve order information details.
          </div>
        ) : (
          <>
            {/* Metadata Summary Info Cards Grid */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-y-0 text-xs sm:text-sm text-gray-600 font-medium division-x-muted">
                <li className="flex flex-col gap-y-0.5">
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">Order Placed On</span>
                  <p className="text-gray-800">{formatDateTime(orderDetails?.created_on)}</p>
                </li>
                <li className="flex flex-col gap-y-0.5 sm:border-l sm:pl-6">
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">Status Tracking</span>
                  <div>
                    <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold capitalize ${getStatusBadgeColor(orderDetails?.status)}`}>
                      {orderDetails?.status?.replaceAll("_", " ")}
                    </span>
                  </div>
                </li>
                <li className="flex flex-col gap-y-0.5 sm:border-l sm:pl-6">
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">Payment Protocol</span>
                  <p className="text-gray-800 uppercase">{orderDetails?.payment_method || "N/A"}</p>
                </li>
              </ul>
            </div>

            {/* STORE WISE SEPARATED ORDERS STACK */}
            <div className="flex flex-col gap-y-6">
              {groupedItemsByStore?.map(({ store, items }, index) => (
                <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-4 lg:p-5 flex flex-col gap-y-4">
                  
                  {/* Shop Information Row Banner */}
                  <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 sm:gap-y-0">
                    <div>
                      <h3 className="text-lg font-bold text-[#793FDF]">
                        From {store.store_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="font-semibold text-gray-400">Location:</span> {store.address || "N/A"}
                      </p>
                    </div>
                    <span className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-md text-xs font-bold self-start sm:self-auto">
                      Store ID: {store.store_id}
                    </span>
                  </div>

                  {/* Main Display Body split vertically only on large screens */}
                  <div className="flex flex-col lg:flex-row gap-5">
                    
                    {/* ITEMS SUB-PANEL CONTAINER */}
                    <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-y-3">
                      <div className="flex justify-between items-center font-bold text-gray-800 border-b border-gray-50 pb-2">
                        <span>Items Array ({items.length})</span>
                        <span className="text-[#FF4FA3] text-lg">
                          ₹{orderDetails?.product_price}/-
                        </span>
                      </div>

                      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-1">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between gap-x-2 py-3 first:pt-1 last:pb-1">
                            <div className="flex gap-x-3 min-w-0">
                              <Image
                                src={item.item_image || '/placeholder-image.png'}
                                alt={item.item_name || "item"}
                                width={75}
                                height={75}
                                className="rounded-lg object-cover border border-gray-100 flex-shrink-0 bg-gray-50"
                              />
                              <div className="text-xs sm:text-sm min-w-0">
                                <h4 className="font-bold text-gray-900 truncate">{item.item_name}</h4>
                                <ul className="text-gray-500 font-medium mt-1 space-y-0.5">
                                  <li><span className="text-gray-400">Qty:</span> {item.quantity}</li>
                                  {item.size && <li><span className="text-gray-400">Size:</span> {item.size}</li>}
                                  {item.color && <li><span className="text-gray-400">Color:</span> {item.color}</li>}
                                </ul>
                              </div>
                            </div>
                            <p className="font-bold text-[#FF4FA3] text-sm flex-shrink-0">
                              {item.price ? `₹${item.price}/-` : "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* METADATA CONSUMER AND COURIER BLOCKS CONTAINER */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-y-4">
                      
                      {/* CONSUMER METADATA INFO */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 text-sm border-b border-gray-50 pb-2 mb-2.5">
                          Customer Details
                        </h4>
                        <ul className="text-xs sm:text-sm text-gray-700 font-medium space-y-2">
                          <li>
                            <span className="text-gray-400 font-normal inline-block w-16">Name:</span> 
                            <span className="text-gray-900">{orderDetails?.user_name || "N/A"}</span>
                          </li>
                          <li>
                            <span className="text-gray-400 font-normal inline-block w-16">Phone:</span> 
                            <span className="text-gray-900">{orderDetails?.user_phone || "N/A"}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-gray-400 font-normal inline-block w-16 flex-shrink-0">Address:</span> 
                            <span className="text-gray-900 break-words">{orderDetails?.delivery_location || "N/A"}</span>
                          </li>
                        </ul>
                      </div>

                      {/* DELIVERY COURIER METADATA INFO */}
                      {deliveryDetails.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <h4 className="font-bold text-gray-900 text-sm border-b border-gray-50 pb-2 mb-2">
                            Delivery Partner Assignee
                          </h4>
                          <div className="divide-y divide-gray-50">
                            {deliveryDetails.map((boy, i) => (
                              <div key={i} className="flex gap-x-3 pt-2.5 items-center">
                                <Image
                                  src={boy.pickup_image_url || '/placeholder-image.png'}
                                  alt="delivery partner avatar"
                                  width={52}
                                  height={52}
                                  className="rounded-full object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                                />
                                <div className="text-xs sm:text-sm font-medium text-gray-800">
                                  <p className="font-bold text-gray-900">
                                    {boy.delivery_partner_name}
                                  </p>
                                  <p className="text-gray-500 font-normal mt-0.5">{boy.delivery_partner_number}</p>
                                  <p className="text-emerald-600 font-semibold text-xs mt-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded w-max">
                                    Earnings: ₹{boy.amount_gained}/-
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;