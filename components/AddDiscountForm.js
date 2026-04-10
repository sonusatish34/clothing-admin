"use client";
import { useState, useRef } from "react"; // Added useRef
import axios from "axios";
import { Upload, ImageIcon, CheckCircle2 } from "lucide-react";

// ... (keep DISCOUNT_OPTIONS and DISCOUNT_VALUE_OPTIONS as they are)
const DISCOUNT_OPTIONS = {

    "Price Based": ["Percentage Discount", "Flat Discount", "Cart Value Discount", "Tiered / Slab Discount", "Max Discount Cap"],

    "Quantity Based": ["Buy X Get Y", "Combo Offer", "Milestone Discount"],

    "Cashback Based": ["Wallet Cashback", "Tiered Wallet Cashback"],

    "Loyalty Based": ["VIP Discount", "Loyalty Tier Cashback", "Milestone Reward"],

    "Item Gift": ["Free Gift Item"]

};



const DISCOUNT_VALUE_OPTIONS = {

    "Percentage Discount": ["5% OFF", "10% OFF", "15% OFF", "20% OFF", "30% OFF"],

    "Flat Discount": ["₹100 OFF", "₹200 OFF", "₹300 OFF", "₹500 OFF", "₹1000 OFF"],

    "Buy X Get Y": ["Buy 1 Get 1", "Buy 2 Get 1", "Buy 3 Get 3", "Buy 3 Get 1"],

    "Free Gift Item": ["Gym Bag", "Wallet", "Perfume", "Keychain", "Gift Hamper"],

};


export default function AddDiscountForm({ tokenAuth, app_user_id, store_id, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null); // Ref to trigger file selection

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

    // 1. Integration of your S3 Upload Function
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formdata = new FormData();
            formdata.append("file", file);
            
            const res = await fetch(`https://dev.zuget.com/admin/s3/image-file`, {
                method: "POST",
                headers: { 
                    // Replacing with your explicit token logic
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4` 
                },
                body: formdata,
            });
            
            const result = await res.json();
            if (result?.data?.image_link) {
                setCreateForm(prev => ({ ...prev, image_link: result.data.image_link }));
            }
        } catch (err) {
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleAddOffer = async () => {
        if (!createForm.offer_name || !createForm.discount) {
            alert("Please fill required fields");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                app_user_id,
                store_id,
                ...createForm,
                min_order_value: Number(createForm.min_order_value)
            };
            await axios.post('https://dev.zuget.com/admin/add-discount', payload, {
                headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4`,
                    'Content-Type': 'application/json'
                }
            });
            alert("Offer Added Successfully!");
            // Reset form
            setCreateForm({
                offer_name: "", offer_type: "Price Based", offer_on: "All Items",
                gender: "All", discount_type: "Percentage Discount", image_link: "",
                discount: "", min_order_value: 0
            });
            onSuccess();
        } catch (err) {
            alert("Failed to add offer");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none";

    return (
        <div className="mb-8 bg-white border border-gray-300 rounded-md overflow-hidden">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
            />

            <div className="grid grid-cols-9 bg-gray-50 border-b border-gray-300 text-gray-600 font-semibold uppercase text-[11px]">
                <div className="p-3 border-r border-gray-200 text-center">Offer Type</div>
                <div className="p-3 border-r border-gray-200">Offer Name</div>
                <div className="p-3 border-r border-gray-200">Offer On *</div>
                <div className="p-3 border-r border-gray-200 text-center">Gender</div>
                <div className="p-3 border-r border-gray-200">Discount Type</div>
                <div className="p-3 border-r border-gray-200">Min Order</div>
                <div className="p-3 border-r border-gray-200 text-center">Image</div>
                <div className="p-3 border-r border-gray-200">Discount</div>
                <div className="p-3 text-center">Action</div>
            </div>

            <div className="grid grid-cols-9 border-t border-gray-300 items-center">
                <div className="border-r border-gray-200 p-2">
                    <select className={inputClass} value={createForm.offer_type} onChange={(e) => setCreateForm({ ...createForm, offer_type: e.target.value })}>
                        {Object.keys(DISCOUNT_OPTIONS).map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                </div>
                <div className="border-r border-gray-200 p-2">
                    <input className={inputClass} type="text" placeholder="Name" value={createForm.offer_name} onChange={(e) => setCreateForm({ ...createForm, offer_name: e.target.value })} />
                </div>
                <div className="border-r border-gray-200 p-2">
                    <select className={inputClass} value={createForm.offer_on} onChange={(e) => setCreateForm({ ...createForm, offer_on: e.target.value })}>
                        <option>All Items</option><option>Shirts</option><option>Jeans</option>
                    </select>
                </div>
                <div className="border-r border-gray-200 p-2">
                    <select className={inputClass} value={createForm.gender} onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}>
                        <option>All</option><option>Mens</option><option>Womens</option>
                    </select>
                </div>
                <div className="border-r border-gray-200 p-2">
                    <select className={inputClass} value={createForm.discount_type} onChange={(e) => setCreateForm({ ...createForm, discount_type: e.target.value, discount: "" })}>
                        <option>Percentage Discount</option><option>Flat Discount</option><option>Buy X Get Y</option><option>Free Gift Item</option>
                    </select>
                </div>
                <div className="border-r border-gray-200 p-2">
                    <input className={inputClass} type="number" placeholder="Min Order" value={createForm.min_order_value} onChange={(e) => setCreateForm({ ...createForm, min_order_value: e.target.value })} />
                </div>
                
                {/* Image Upload Cell */}
                <div className="border-r border-gray-200 p-2 flex justify-center">
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                        className={`cursor-pointer hover:scale-105 text-[10px] py-1 px-2 rounded flex items-center gap-1 border transition-all ${
                            createForm.image_link 
                            ? "text-blue-600 border-blue-200 bg-blue-50" 
                            : "text-green-600 border-green-200 bg-green-50"
                        }`}
                    >
                        {uploading ? (
                            "..." 
                        ) : createForm.image_link ? (
                            <><CheckCircle2 size={12} /> Done</>
                        ) : (
                            <><Upload size={12} /> Upload</>
                        )}
                    </button>
                </div>

                <div className="border-r border-gray-200 p-2">
                    <select className={inputClass} value={createForm.discount} onChange={(e) => setCreateForm({ ...createForm, discount: e.target.value })}>
                        <option value="">Select</option>
                        {DISCOUNT_VALUE_OPTIONS[createForm.discount_type]?.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div className="p-2 flex justify-center items-center">
                    <button onClick={handleAddOffer} disabled={loading || uploading} className="cursor-pointer bg-purple-600 text-white py-1.5 px-3 rounded-md font-bold text-xs hover:bg-purple-700 disabled:opacity-50">
                        {loading ? "Saving..." : "Add Offer"}
                    </button>
                </div>
            </div>
        </div>
    );
}