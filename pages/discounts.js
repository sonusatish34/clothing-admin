"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import AddDiscountForm from "@/components/AddDiscountForm";
import DiscountsTable from "@/components/DiscountsTable";
import DiscountComboManager from "@/components/DiscountComboManager";
import Layout from "@/components/Layout/Layout";
const BASE_URL = "https://dev.zuget.com/admin";
var APP_USER_ID = 0;
var STORE_ID = 0;


export default function DiscountsPage() {
    const [tokenAuth, setAuthToken] = useState('');
    const [status, setStatus] = useState('active');
    const [activeDiscounts, setActiveDiscounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [storeId, setStoreId] = useState(0);
    const [appUserId, setAppUserId] = useState(0);

    useEffect(() => {
        setAuthToken(localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
        async function fetchStoresByStatus() {
            const usermobile = window.localStorage.getItem("user_phone");
            const usertoken = usermobile
                ? window.localStorage.getItem(`${usermobile}_token`)
                : null;
            const response = await fetch(`https://api.zuget.com/admin/stores?status=approved`, {

                headers: {
                    'accept': 'application/json',
                    'Authorization': usertoken,
                },
            });

            const data = await response.json();
            // console.log(data, 'approved stores');
            setStoreList(data?.data?.results)

            // setLoading(false);
            // setData(data?.data?.results);
            // console.log(data.data?.results, "testing");
        }
        fetchStoresByStatus()
    }, []);
    console.log(storeList, 'sll');

    console.log(storeId,"variabke storeId");
    console.log(appUserId,"variabke appUserId");
    
    const fetchDiscountsStatus = async (statustext = status) => {
        setStatus(statustext);
        try {
            const res = await axios.get(`${BASE_URL}/${statustext}-discounts?app_user_id=${APP_USER_ID}&store_id=${STORE_ID}`, {
                headers: { Authorization: tokenAuth },
            });
            setActiveDiscounts(res.data?.data || []);
        } catch (error) { setActiveDiscounts([]); }
    };

    useEffect(() => { if (tokenAuth) fetchDiscountsStatus('active'); }, [tokenAuth,storeId]);

    const handleUpdateStatus = (id, newStatus) => {
        axios.put(`${BASE_URL}/update-discount-status`, {
            app_user_id: APP_USER_ID, store_id: STORE_ID, discount_id: id, status: newStatus
        }, { headers: { Authorization: tokenAuth } })
            .then((res) => {
                if (res.data.status === "success") {
                    Swal.fire({
                        title: 'Success!',
                        text: res.data.message + ` to ${newStatus}`,
                        icon: 'success', timer: 2500, toast: true, position: 'top-end',
                    });
                    fetchDiscountsStatus('active');
                }
            }).catch(() => alert("Failed to update status"));
    };

    const handleUpdateDiscount = async (id, buffer) => {
        setLoading(true);
        try {
            const payload = {
                app_user_id: APP_USER_ID,
                store_id: STORE_ID,
                discount_id: Number(id),
                ...buffer,
                min_order_value: Number(buffer.min_order_value || 0)
            };
            await axios.put(`${BASE_URL}/update-discount`, payload, {
                headers: { 'Authorization': tokenAuth, 'Content-Type': 'application/json' }
            });
            alert("Updated Successfully!");
            fetchDiscountsStatus();
        } finally { setLoading(false); }
    };
    const handleDiscountToApply = (id,app) =>{
        setStoreId(id);
        setAppUserId(app);
        console.log(id,app,'..............');
        console.log('inside i r');
        
        
    }

    return (
        <Layout>
            <div className="p-6 bg-white min-h-screen text-[13px] text-gray-700 font-sans">
                    <p className="text-xl pb-3">Select Your Store</p>
                 <ul className="h-[111px] overflow-y-scroll flex flex-col gap-y-1 w-[200px]">
                    {storeList.map((item, index) => (
                        <li key={index+1} className="bg-gray-100" onClick={()=>handleDiscountToApply(item._id,item.app_user_id)} value={item._id}>{item.store_name}</li>
                    ))}
                </ul>
                <h1 className="text-xl font-bold mb-4">← Discounts</h1>
                
                {/* Component 1: Add Discount */}
                <AddDiscountForm
                    tokenAuth={tokenAuth}
                    app_user_id={APP_USER_ID}
                    store_id={STORE_ID}
                    onSuccess={() => fetchDiscountsStatus('active')}
                />

                <h2 className="text-sm font-bold mb-4 capitalize">{status} Discounts</h2>
               
                {/* Status Tabs */}
                <div className="flex gap-x-5 py-4 text-md font-semibold">
                    {['active', 'inactive', 'deleted'].map(s => (
                        <button key={s}
                            className={`${status === s ? 'border-b-4 border-purple-500' : ''} cursor-pointer capitalize`}
                            onClick={() => fetchDiscountsStatus(s)}>
                            {s === 'inactive' ? 'Paused' : s === 'deleted' ? 'Closed' : 'Active'}
                        </button>
                    ))}
                </div>

                {/* Component 2: List of Discounts */}
                <DiscountsTable
                    discounts={activeDiscounts}
                    loading={loading}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateDiscount={handleUpdateDiscount}
                    status={status}
                />
                <DiscountComboManager
                    tokenAuth={tokenAuth}
                    app_user_id={APP_USER_ID}
                    store_id={STORE_ID}
                    availableDiscounts={activeDiscounts} // Passes current fetched discounts
                />
            </div>
        </Layout>
    );
}