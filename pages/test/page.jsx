"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Pencil,
    Pause,
    XCircle,
    Upload,
} from "lucide-react";

export default function DiscountsPage() {
    const [loading, setLoading] = useState(false);
    const [activeDiscounts, setActiveDiscounts] = useState([]);

    // ----------------------
    // FORM STATE
    // ----------------------
    const [form, setForm] = useState({
        offer_name: "",
        offer_type: "Price Based",
        offer_on: "All Items",
        gender: "All",
        discount_type: "Percentage",
        image_link: "",
        discount: "",
        min_order_value: 0,
    });

    const app_user_id = 148;
    const store_id = 24;

    // ----------------------
    // HANDLE INPUT CHANGE
    // ----------------------
    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // ----------------------
    // ADD DISCOUNT FUNCTION
    // ----------------------
    const handleAddOffer = async () => {
        try {
            setLoading(true);

            const payload = {
                app_user_id,
                store_id,
                offer_name: form.offer_name,
                offer_type: form.offer_type,
                offer_on: form.offer_on,
                gender: form.gender,
                discount_type: form.discount_type,
                image_link: form.image_link,
                discount: form.discount,
                min_order_value: form.min_order_value,
            };

            await axios.post(
                "https://dev.zuget.com/admin/add-discount",
                payload,
                {
                    headers: {
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4",
                    },
                }
            );

            alert("Offer Added Successfully!");
            fetchActiveDiscounts();
        } catch (err) {
            console.error(err);
            alert("Failed to add offer");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // FETCH ACTIVE DISCOUNTS
    // ----------------------
    const fetchActiveDiscounts = async () => {
        try {
            const res = await axios.get(
                `https://dev.zuget.com/admin/active-discounts?app_user_id=${app_user_id}&store_id=${store_id}`,
                {
                    headers: {
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4",
                    },
                }
            );

            setActiveDiscounts(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchActiveDiscounts();
    }, []);

    return (
        <div className="p-6 w-full">

            {/* --------------------------
          ADD OFFER UI (Top Section)
      --------------------------- */}
            <h2 className="text-xl font-semibold mb-4">Add Discounts</h2>

            <div className="grid grid-cols-6 gap-4 bg-white p-5 shadow rounded-xl">

                <input
                    type="text"
                    placeholder="Offer Name"
                    className="border p-2 rounded"
                    value={form.offer_name}
                    onChange={(e) => handleChange("offer_name", e.target.value)}
                />

                <select
                    className="border p-2 rounded"
                    value={form.offer_type}
                    onChange={(e) => handleChange("offer_type", e.target.value)}
                >
                    <option>Price Based</option>
                    <option>Quantity Based</option>
                    <option>Cashback Based</option>
                    <option>Loyalty Based</option>
                    <option>Item Gift</option>
                </select>

                <select
                    className="border p-2 rounded"
                    value={form.offer_on}
                    onChange={(e) => handleChange("offer_on", e.target.value)}
                >
                    <option>All Items</option>
                    <option>Men</option>
                    <option>Women</option>
                </select>

                <select
                    className="border p-2 rounded"
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                >
                    <option>All</option>
                    <option>Mens</option>
                    <option>Womens</option>
                </select>

                <select
                    className="border p-2 rounded"
                    value={form.discount_type}
                    onChange={(e) => handleChange("discount_type", e.target.value)}
                >
                    <option>Percentage</option>
                    <option>Buy X Get Y</option>
                    <option>Item Cashback</option>
                    <option>Loyal OFF</option>
                    <option>Item</option>
                </select>

                <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Marketing Image Link"
                        className="border p-2 rounded w-full"
                        value={form.image_link}
                        onChange={(e) => handleChange("image_link", e.target.value)}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Add Discount (ex: 20% Off)"
                    className="border p-2 rounded"
                    value={form.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Min Order Value"
                    className="border p-2 rounded"
                    value={form.min_order_value}
                    onChange={(e) => handleChange("min_order_value", Number(e.target.value))}
                />

                <button
                    onClick={handleAddOffer}
                    className="col-span-6 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                    {loading ? "Adding..." : "Add Offer"}
                </button>
            </div>

            {/* --------------------------
          ACTIVE DISCOUNTS TABLE
      --------------------------- */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Active Discounts</h2>

            <table className="w-full bg-white shadow rounded-xl">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-2">Offer Type</th>
                        <th className="p-2">Offer Name</th>
                        <th className="p-2">Offer On</th>
                        <th className="p-2">Gender</th>
                        <th className="p-2">Discount Type</th>
                        <th className="p-2">Image</th>
                        <th className="p-2">Discount</th>
                        <th className="p-2">Edit</th>
                        <th className="p-2">Pause</th>
                        <th className="p-2">Close</th>
                    </tr>
                </thead>

                <tbody>
                    {activeDiscounts.map((d) => (
                        <tr key={d._id} className="border-t">
                            <td className="p-2">{d.offer_type}</td>
                            <td className="p-2">{d.offer_name}</td>
                            <td className="p-2">{d.offer_on}</td>
                            <td className="p-2">{d.gender}</td>
                            <td className="p-2">{d.discount_type}</td>

                            <td className="p-2">
                                <img
                                    src={d.image_link}
                                    className="w-12 h-12 rounded object-cover"
                                    alt=""
                                />
                            </td>

                            <td className="p-2">{d.discount}</td>

                            <td className="p-2">
                                <Pencil className="cursor-pointer text-blue-600" />
                            </td>

                            <td className="p-2">
                                <Pause className="cursor-pointer text-orange-600" />
                            </td>

                            <td className="p-2">
                                <XCircle className="cursor-pointer text-red-600" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}