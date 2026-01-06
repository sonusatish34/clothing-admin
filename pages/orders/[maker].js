"use client";

import Layout from "@/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatDateTime } from "@/utils/convertDate";
import { MdKeyboardBackspace } from "react-icons/md";

const ComponentName = () => {
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState([]);

  // ================= FETCH ORDER DETAILS =================
  useEffect(() => {
    if (!router.query.maker) return;

    async function fetchOrderDetails() {
      try {
        const res = await fetch(
          `https://api.zuget.com/admin/order-details?order_id=${router.query.maker}`,
          {
            headers: {
              accept: "application/json",
              Authorization: localStorage.getItem(
                `${localStorage.getItem("user_phone")}_token`
              ),
            },
          }
        );

        const result = await res.json();
        setOrderDetails(result?.data?.results[0] || null);
      } catch (err) {
        console.error("Order API Error:", err);
      }
    }

    fetchOrderDetails();
  }, [router.query.maker]);

  // ================= FETCH DELIVERY DETAILS (DYNAMIC STORE ID) =================
  useEffect(() => {
    if (!orderDetails?.store_details?.length) return;

    async function fetchDeliveryDetails() {
      try {
        const storeId = orderDetails.store_details[0].store_id;

        const res = await fetch(
          `https://api.zuget.com/admin/delivery-partner-details?order_id=${router.query.maker}&store_id=${storeId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: localStorage.getItem(
                `${localStorage.getItem("user_phone")}_token`
              ),
            },
          }
        );

        const result = await res.json();
        setDeliveryDetails(result?.data || []);
      } catch (err) {
        console.error("Delivery API Error:", err);
      }
    }

    fetchDeliveryDetails();
  }, [orderDetails, router.query.maker]);

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

  return (
    <Layout>
      <div>
        {/* Header */}
        <p className="lg:text-xl text-xs flex gap-x-3 items-center">
          <MdKeyboardBackspace
            onClick={() => router.back()}
            className="cursor-pointer size-6 lg:size-12"
          />
          <span className="text-[#6B757C] capitalize">
            {orderDetails?.status?.replaceAll("_", " ")} Orders
          </span>
          <span className="text-[#6B757C]">{">"}</span>
          <span className="font-bold">Order Id : {orderDetails?._id}</span>
        </p>

        {/* Order Info */}
        <ul className="pt-4 flex gap-x-4 text-xs lg:text-lg">
          <li>
            <span className="text-[#6B757C]">Order Placed On</span>{" "}
            {formatDateTime(orderDetails?.created_on)}
          </li>
          <li className="border-l-2 pl-2 capitalize">
            <span className="text-[#6B757C]">Status</span>{" "}
            {orderDetails?.status?.replaceAll("_", " ")}
          </li>
          <li className="border-l-2 pl-2">
            <span className="text-[#6B757C]">Payment</span>{" "}
            {orderDetails?.payment_method}
          </li>
        </ul>

        {/* STORE WISE ORDERS */}
        <div className="flex flex-col gap-y-6 mt-5">
          {groupedItemsByStore?.map(({ store, items }, index) => (
            <div key={index} className=" bg-[#ECF3FE99] rounded-lg p-4">
              <h3 className="text-xl font-bold text-[#7A69E7]">
                From {store.store_name}
              </h3>

              <div className="flex gap-x-10 mt-2">
                <span className="w-1/2 text-sm">
                  <b>Location:</b> {store.address}
                </span>
                <span className="text-sm">
                  <b>Store ID:</b> {store.store_id}
                </span>
              </div>

              <div className="flex gap-x-10 mt-4">
                {/* ITEMS */}
                <div className="w-1/2 bg-white p-3">
                  <p className="flex justify-between font-bold">
                    <span>Order List: {items.length}</span>
                    <span className="text-[#FF4FA3]">
                      {orderDetails?.product_price}/-
                    </span>
                  </p>

                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between border-t py-3">
                      <div className="flex gap-x-3">
                        <Image
                          src={item.item_image}
                          alt="item"
                          width={120}
                          height={120}
                          className="rounded"
                        />
                        <ul className="text-sm">
                          <li className="font-bold">{item.item_name}</li>
                          <li>Qty: {item.quantity}</li>
                          <li>Size: {item.size}</li>
                          <li>Color: {item.color}</li>
                        </ul>
                      </div>
                      <p className="font-semibold text-[#FF4FA3]">
                        {item.price}/-
                      </p>
                    </div>
                  ))}
                </div>

                {/* CUSTOMER + DELIVERY */}
                <div className="w-1/2 flex flex-col gap-y-3">
                  {/* CUSTOMER */}
                  <ul className="bg-white p-3 rounded-md">
                    <li className="font-bold">Customer Details</li>
                    <li>Name: {orderDetails?.user_name}</li>
                    <li>Phone: {orderDetails?.user_phone}</li>
                    <li>Address: {orderDetails?.delivery_location}</li>
                  </ul>

                  {/* DELIVERY */}
                  {deliveryDetails.length > 0 && (
                    <ul className="bg-white p-3 rounded">
                      <li className="font-bold">Delivery Partner</li>
                      {deliveryDetails.map((boy, i) => (
                        <li key={i} className="flex gap-x-3 mt-2">
                          <Image
                            src={boy.pickup_image_url}
                            alt="dp"
                            width={60}
                            height={60}
                            className="rounded"
                          />
                          <div>
                            <p className="font-semibold">
                              {boy.delivery_partner_name}
                            </p>
                            <p>{boy.delivery_partner_number}</p>
                            <p>Earnings: {boy.amount_gained}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </Layout>
  );
};

export default ComponentName;