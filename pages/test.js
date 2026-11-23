"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Pencil,
    Pause,
    XCircle,
    Upload,
    Plus,
    Download,
    Check,
    X
} from "lucide-react";
import Swal from 'sweetalert2';
import { formatDateTime } from "@/utils/convertDate";

const DISCOUNT_OPTIONS = {
    "Price Based": ["Percentage Discount", "Flat Discount", "Cart Value Discount", "Tiered / Slab Discount", "Max Discount Cap"],
    "Quantity Based": ["Buy X Get Y", "Combo Offer", "Milestone Discount"],
    "Cashback Based": ["Wallet Cashback", "Tiered Wallet Cashback"],
    "Loyalty Based": ["VIP Discount", "Loyalty Tier Cashback", "Milestone Reward"],
    "Item Gift": ["Free Gift Item"]
};
// const AUTH_TOKEN = localStorage.getItem(`token_${localStorage.getItem('user_phone')}`);
const BASE_URL = "https://dev.zuget.com/admin";

export default function DiscountsPage() {
    const [tokenAuth, setAuthToken] = useState('')
    const [status, setStatus] = useState('active')
    useEffect(() => {
        setAuthToken(localStorage.getItem(`${localStorage.getItem('user_phone')}_token`))
    }, [])
    console.log(tokenAuth, "tokenAuth");

    const [activeDiscounts, setActiveDiscounts] = useState([]);
    const [inlineEditingId, setInlineEditingId] = useState(null);
    const [editBuffer, setEditBuffer] = useState({});

    const app_user_id = 148;
    const store_id = 24;

    const [loading, setLoading] = useState(false);
    const discountValueOptions = {
        "Percentage Discount": ["5% OFF", "10% OFF", "15% OFF", "20% OFF", "30% OFF"],
        "Flat Discount": ["₹100 OFF", "₹200 OFF", "₹300 OFF", "₹500 OFF", "₹1000 OFF"],
        "Buy X Get Y": ["Buy 1 Get 1", "Buy 2 Get 1", "Buy 3 Get 3", "Buy 3 Get 1"],
        "Free Gift Item": ["Gym Bag", "Wallet", "Perfume", "Keychain", "Gift Hamper"],
    };
    const [createForm, setCreateForm] = useState({
        offer_name: "",
        offer_type: "Price Based",
        offer_on: "All Items",
        gender: "All",
        discount_type: "Percentage Discount",
        discount_value: "",
        image_link: "",
        discount: "",
        min_order_value: 0,
    });
    const handleTypeChange = (e) => {
        const value = e.target.value;

        setCreateForm({
            ...createForm,
            discount_type: value,
            discount_value: "", // reset when type changes
        });
    };
    const handleAddOffer = async () => {
        setLoading(true);
        try {
            const payload = {
                app_user_id: app_user_id,
                store_id: store_id,
                ...createForm,
                min_order_value: Number(createForm.min_order_value) // Ensure it's a number
            };

            await axios.post(
                'https://dev.zuget.com/admin/add-discount',
                payload,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4',
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("Offer Added Successfully!");
            fetchDiscountsStatus('active')
            // Reset form or refresh list here
        } catch (err) {
            console.error(err);
            alert("Failed to add offer");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (tokenAuth) fetchDiscountsStatus('active'); }, [tokenAuth]);
    console.log(status, "our present status");

    const fetchDiscountsStatus = async (statustext) => {
        setStatus(statustext)
        try {
            const res = await axios.get(`${BASE_URL}/${statustext}-discounts?app_user_id=${app_user_id}&store_id=${store_id}`, {
                headers: { Authorization: tokenAuth },
            });
            setActiveDiscounts(res.data?.data || []);
        } catch (error) { setActiveDiscounts([]); }
    };

    const handleCreateChange = (key, value) => {
        setCreateForm(prev => {
            const updated = { ...prev, [key]: value };
            if (key === "offer_type") updated.discount_type = (DISCOUNT_OPTIONS[value] || [])[0];
            return updated;
        });
    };

    const startInlineEdit = (item) => {
        setInlineEditingId(item._id || item.discount_id);
        setEditBuffer({
            ...item,
            min_order_value: item.min_order_value || 0 // Ensure fallback
        });
    };

    const handleInlineChange = (key, value) => {
        setEditBuffer(prev => {
            const updated = { ...prev, [key]: value };
            if (key === "offer_type") updated.discount_type = (DISCOUNT_OPTIONS[value] || [])[0];
            return updated;
        });
    };

    const saveInlineEdit = async () => {
        setLoading(true);
        try {
            const payload = {
                // Ensure these match the IDs from your CURL example
                app_user_id: app_user_id,
                store_id: store_id,
                discount_id: Number(inlineEditingId), // CURL shows an integer (22)

                offer_name: editBuffer.offer_name,
                offer_type: editBuffer.offer_type,
                offer_on: editBuffer.offer_on,
                gender: editBuffer.gender,
                discount_type: editBuffer.discount_type,
                image_link: editBuffer.image_link || "",
                discount: editBuffer.discount,
                min_order_value: Number(editBuffer.min_order_value || 0)
            };

            // CHANGED: axios.put instead of axios.post to match CURL
            await axios.put(
                `${BASE_URL}/update-discount`,
                payload,
                {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': tokenAuth,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("Discount Updated Successfully!");
            setInlineEditingId(null);
            fetchDiscountsStatus();
        } catch (err) {
            console.error("Update Error:", err.response?.data || err.message);
            alert(`Update failed: ${err.response?.data?.message || "Check Method (PUT vs POST)"}`);
        } finally {
            setLoading(false);
        }
    };

    // const handleUpdateStatus = (id, status) => {
    //     axios.post(`${BASE_URL}/update-discount-status`, {
    //         app_user_id, store_id, discount_id: id, status
    //     }, { headers: { Authorization: tokenAuth } }).then(() => fetchDiscountsStatus());
    // };
    const handleUpdateStatus = (id, status) => {
        // Optional: Add a confirmation before pausing/closing
        // const actionText = status === "paused" ? "pause" : "close";

        axios.put(`${BASE_URL}/update-discount-status`, {
            app_user_id,
            store_id,
            discount_id: id,
            status
        }, {
            headers: { Authorization: tokenAuth }
        })
            .then((res) => {
                // This handles your specific response: { status: "success", message: "..." }
                if (res.data.status === "success") {
                    Swal.fire({
                        title: 'Success!',
                        text: res.data.message + `  to  ${status}`, // "Discount status updated successfully!!"
                        icon: 'success',
                        timer: 2500,
                        showConfirmButton: false,
                        toast: true,           // Makes it a small popup
                        position: 'top-end',   // Positions it nicely at the corner
                        timerProgressBar: true,
                    });
                    fetchDiscountsStatus('active');
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Failed to update status',
                    icon: 'error',
                    confirmButtonColor: '#9333ea' // Purple-600 to match your theme
                });
            });

    };

    // Shared input style for table to prevent layout shift
    const tableInputClass = "w-full border border-gray-300 rounded px-1 py-1 text-xs focus:ring-1 focus:ring-purple-500 outline-none h-8";

    return (
        <div className="p-6 bg-white min-h-screen text-[13px] text-gray-700 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">← Discounts</h1>

            </div>

            {/* Creation Grid (Add Row) */}
            <div className="mb-8 bg-white border border-gray-300 rounded-md overflow-hidden">

                {/* Header Row */}
                <div className="grid grid-cols-9 bg-gray-50 border-b border-gray-300 text-gray-600 font-semibold uppercase text-[11px]">
                    <div className="p-3 border-r border-gray-200">Offer Type</div>
                    <div className="p-3 border-r border-gray-200">Offer Name</div>
                    <div className="p-3 border-r border-gray-200">Offer On *</div>
                    <div className="p-3 border-r border-gray-200">Gender *</div>
                    <div className="p-3 border-r border-gray-200">Discount Type *</div>
                    <div className="p-3 border-r border-gray-200">Min Order</div>
                    <div className="p-3 border-r border-gray-200 text-center">Image</div>
                    <div className="p-3 border-r border-gray-200">Discount</div>
                    <div className="p-3 text-center">Action</div>
                </div>

                {/* Input Row */}
                <div className="grid grid-cols-9 border-t border-gray-300">
                    {/* Offer Type */}
                    <div className="border-r border-gray-200 p-2">
                        <select
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            value={createForm.offer_type}
                            onChange={(e) => setCreateForm({ ...createForm, offer_type: e.target.value })}
                        >
                            <option>Price Based</option>
                            <option>Quantity Based</option>
                            <option>Cashback Based</option>
                            <option>Loyalty Based</option>
                            <option>Item Gift</option>
                        </select>
                    </div>

                    {/* Offer Name */}
                    <div className="border-r border-gray-200 p-2">
                        <input
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            type="text"
                            placeholder="Name"
                            value={createForm.offer_name}
                            onChange={(e) => setCreateForm({ ...createForm, offer_name: e.target.value })}
                        />
                    </div>

                    {/* Offer On */}
                    <div className="border-r border-gray-200 p-2">
                        <select
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            value={createForm.offer_on}
                            onChange={(e) => setCreateForm({ ...createForm, offer_on: e.target.value })}
                        >
                            <option>All Items</option>
                            <option>Shirts</option>
                            <option>Jeans</option>
                            <option>Shorts</option>
                            <option>Track Pants</option>
                        </select>
                    </div>

                    {/* Gender */}
                    <div className="border-r border-gray-200 p-2">
                        <select
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            value={createForm.gender}
                            onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                        >
                            <option>All</option>
                            <option>Mens</option>
                            <option>Womens</option>
                        </select>
                    </div>

                    {/* Discount Type */}
                    <div className="border-r border-gray-200 p-2">
                        <select
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            value={createForm.discount_type}
                            onChange={handleTypeChange}
                        >
                            <option>Percentage Discount</option>
                            <option>Flat Discount</option>
                            <option>Buy X Get Y</option>
                            <option>Free Gift Item</option>
                        </select>
                    </div>
                    <div className="border-r border-gray-200 p-2">
                        <input
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            type="number"
                            placeholder="Min Order"
                            value={createForm.min_order_value}
                            onChange={(e) => setCreateForm({ ...createForm, min_order_value: e.target.value })}
                        />
                    </div>

                    {/* Upload Image */}
                    <div className="border-r border-gray-200 p-2 flex justify-center">
                        <button className="text-[10px] text-green-600 border border-green-200 bg-green-50 py-1 px-2 rounded flex items-center gap-1">
                            <Upload size={12} /> Upload
                        </button>
                    </div>

                    {/* Discount Value */}
                    <div className="border-r border-gray-200 p-2">
                        <select
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none"
                            value={createForm.discount_value}
                            onChange={(e) =>
                                setCreateForm({ ...createForm, discount: e.target.value })
                            }
                        >
                            <option value="">Select Value</option>

                            {discountValueOptions[createForm.discount_type]?.map((item, i) => (
                                <option key={i} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add Offer Button */}
                    <div className="p-2 flex justify-center items-center">
                        <button
                            onClick={handleAddOffer}
                            disabled={loading}
                            className="bg-purple-600 text-white py-1.5 px-3 rounded-md font-bold text-xs hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Add Offer"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Table */}

            <h2 className="text-sm font-bold mb-4 capitalize">{status} Discounts</h2>
            <div className="flex gap-x-5 py-4 text-md font-semibold">
                <button className={`${status == 'active' ? 'border-b-4 border-purple-500' : ''} cursor-pointer`} onClick={() => { fetchDiscountsStatus('active') }}>Active</button>
                <button className={`${status == 'inactive' ? 'border-b-4 border-purple-500' : ''} cursor-pointer`} onClick={() => { fetchDiscountsStatus('inactive') }}>Paused</button>
                <button className={`${status == 'deleted' ? 'border-b-4 border-purple-500' : ''} cursor-pointer`} onClick={() => { fetchDiscountsStatus('deleted') }}>Closed</button>
            </div>
            <div className="">
                <table className="w-full text-left table-fixed border border-gray-300 border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-300 text-gray-600 font-semibold text-[11px] uppercase">
                        <tr>
                            <th className="p-3 border border-gray-200 w-[12%]">Offer Type</th>
                            <th className="p-3 border border-gray-200 w-[12%]">Created On</th>
                            <th className="p-3 border border-gray-200 w-[12%]">Status</th>
                            <th className="p-3 border border-gray-200 w-[12%]">Offer Name</th>
                            <th className="p-3 border border-gray-200 w-[10%]">Offer On</th>
                            <th className="p-3 border border-gray-200 w-[10%]">Gender</th>
                            <th className="p-3 border border-gray-200 w-[15%]">Discount Type</th>
                            <th className="p-3 border border-gray-200 w-[12%]">Image Link</th>
                            <th className="p-3 border border-gray-200 w-[12%]">Discount</th>
                            <th className="p-3 border border-gray-200 w-[17%] text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {activeDiscounts.map((d) => {
                            const isEditing = inlineEditingId === (d._id || d.discount_id);

                            return (
                                <tr
                                    key={d._id || d.discount_id}
                                    className={`h-14 border border-gray-200 ${isEditing ? "bg-purple-50" : "hover:bg-gray-50"
                                        }`}
                                >
                                    {isEditing ? (
                                        <>
                                            <td className="p-2 border border-gray-200">
                                                <select
                                                    className={tableInputClass}
                                                    value={editBuffer.offer_type}
                                                    onChange={(e) =>
                                                        handleInlineChange("offer_type", e.target.value)
                                                    }
                                                >
                                                    {Object.keys(DISCOUNT_OPTIONS).map((o) => (
                                                        <option key={o}>{o}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td className="p-2 border border-gray-200">same as before</td>

                                            <td className="p-2 border border-gray-200">
                                                <input
                                                    className={tableInputClass}
                                                    value={editBuffer.status}
                                                    onChange={(e) =>
                                                        handleInlineChange("status", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <input
                                                    className={tableInputClass}
                                                    value={editBuffer.offer_name}
                                                    onChange={(e) =>
                                                        handleInlineChange("offer_name", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <select
                                                    className={tableInputClass}
                                                    value={editBuffer.offer_on}
                                                    onChange={(e) =>
                                                        handleInlineChange("offer_on", e.target.value)
                                                    }
                                                >
                                                    <option>All Items</option>
                                                    <option>Shirts</option>
                                                    <option>Jeans</option>
                                                    <option>Shorts</option>
                                                    <option>Track Pants</option>
                                                </select>
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <select
                                                    className={tableInputClass}
                                                    value={editBuffer.gender}
                                                    onChange={(e) =>
                                                        handleInlineChange("gender", e.target.value)
                                                    }
                                                >
                                                    <option>All</option>
                                                    <option>Mens</option>
                                                    <option>Womens</option>
                                                </select>
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <select
                                                    className={tableInputClass}
                                                    value={editBuffer.discount_type}
                                                    onChange={(e) =>
                                                        handleInlineChange(
                                                            "discount_type",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {(DISCOUNT_OPTIONS[editBuffer.offer_type] || []).map(
                                                        (o) => (
                                                            <option key={o}>{o}</option>
                                                        )
                                                    )}
                                                </select>
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <input
                                                    className={tableInputClass}
                                                    value={editBuffer.image_link}
                                                    onChange={(e) =>
                                                        handleInlineChange("image_link", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <input
                                                    className={tableInputClass}
                                                    value={editBuffer.discount}
                                                    onChange={(e) =>
                                                        handleInlineChange("discount", e.target.value)
                                                    }
                                                />
                                            </td>

                                            <td className="p-2 border border-gray-200">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={saveInlineEdit}
                                                        disabled={loading}
                                                        className="p-1.5 bg-green-600 text-white rounded shadow-sm disabled:opacity-50"
                                                    >
                                                        {loading ? "..." : <Check size={14} />}
                                                    </button>

                                                    <button
                                                        onClick={() => setInlineEditingId(null)}
                                                        className="p-1.5 bg-gray-400 text-white rounded shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3 border border-gray-200">{d.offer_type}</td>
                                            <td className="p-3 border border-gray-200 text-[10px]">{formatDateTime(d.created_on)}</td>
                                            <td className="p-3 border border-gray-200">{d.status}</td>
                                            <td className="p-3 border border-gray-200 text-gray-400 capitalize">
                                                {d.offer_name}
                                            </td>
                                            <td className="p-3 border border-gray-200">{d.offer_on}</td>
                                            <td className="p-3 border border-gray-200">{d.gender}</td>
                                            <td className="p-3 border border-gray-200">
                                                {d.discount_type}
                                            </td>

                                            <td className="p-3 border border-gray-200 truncate max-w-[120px] text-blue-500 text-[10px]">
                                                {d.image_link || "No Image"}
                                            </td>

                                            <td className="p-3 border border-gray-200 font-bold">
                                                {d.discount}
                                            </td>

                                            <td className="p-3 border border-gray-200">
                                                <div className="flex justify-center items-center gap-4">
                                                    <Pencil
                                                        size={20}
                                                        className="cursor-pointer text-blue-400 hover:text-blue-600"
                                                        onClick={() => startInlineEdit(d)}
                                                    />

                                                    <div
                                                        className="bg-purple-100 p-1 rounded-full cursor-pointer hover:bg-purple-200"
                                                        onClick={() =>
                                                            handleUpdateStatus(d._id, "inactive")
                                                        }
                                                    >
                                                        <Pause
                                                            size={20}
                                                            className="text-purple-600 fill-purple-600"
                                                        />
                                                    </div>

                                                    <XCircle
                                                        size={20}
                                                        className="cursor-pointer text-red-400 hover:text-red-600"
                                                        onClick={() =>
                                                            handleUpdateStatus(d._id, "deleted")
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}