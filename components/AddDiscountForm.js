"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { Upload, X, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function AddDiscountForm({ tokenAuth, app_user_id, store_id, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Store the actual File object
    const [previewUrl, setPreviewUrl] = useState(""); // Store the local blob URL for preview
    const fileInputRef = useRef(null);

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

    // 1. Handle Local Selection & Preview
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        // Create a temporary local URL for the preview image
        setPreviewUrl(URL.createObjectURL(file));
    };

    // 2. The S3 Upload Logic (Internal helper)
    const uploadToS3 = async (file) => {
        const formdata = new FormData();
        formdata.append("file", file);
        
        const res = await fetch(`https://dev.zuget.com/s3/image-file`, {
            method: "POST",
            headers: { Authorization: tokenAuth },
            body: formdata,
        });
        
        const result = await res.json();
        // Adjust based on Zuget API response structure
        return result?.data?.image_link || result?.image_link;
    };

    // 3. Final Submission Logic
    const handleAddOffer = async () => {
        if (!createForm.offer_name || !createForm.discount) {
            alert("Please fill required fields");
            return;
        }

        setLoading(true);
        try {
            let finalImageLink = "";

            // Step A: Upload to S3 ONLY now
            if (selectedFile) {
                finalImageLink = await uploadToS3(selectedFile);
                if (!finalImageLink) throw new Error("S3 Upload Failed");
            }

            // Step B: Final Post with the real S3 link
            const payload = {
                app_user_id,
                store_id,
                ...createForm,
                image_link: finalImageLink, // Using the link we just got
                min_order_value: Number(createForm.min_order_value)
            };

            await axios.post('https://dev.zuget.com/admin/add-discount', payload, {
                headers: {
                    'Authorization': tokenAuth,
                    'Content-Type': 'application/json'
                }
            });

            alert("Offer Added Successfully!");
            
            // Reset everything
            setSelectedFile(null);
            setPreviewUrl("");
            setCreateForm({
                offer_name: "", offer_type: "Price Based", offer_on: "All Items",
                gender: "All", discount_type: "Percentage Discount", image_link: "",
                discount: "", min_order_value: 0
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Failed to add offer. Check if the image uploaded correctly.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 rounded px-1 py-1 text-xs h-8 outline-none";

    return (
        <div className="mb-8 bg-white border border-gray-300 rounded-md overflow-hidden">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

            <div className="grid grid-cols-9 bg-gray-50 border-b border-gray-300 text-gray-600 font-semibold uppercase text-[11px]">
                <div className="p-3 border-r border-gray-200 text-center">Offer Type</div>
                <div className="p-3 border-r border-gray-200">Offer Name</div>
                <div className="p-3 border-r border-gray-200 text-center">Offer On</div>
                <div className="p-3 border-r border-gray-200 text-center">Gender</div>
                <div className="p-3 border-r border-gray-200">Discount Type</div>
                <div className="p-3 border-r border-gray-200">Min Order</div>
                <div className="p-3 border-r border-gray-200 text-center">Image Preview</div>
                <div className="p-3 border-r border-gray-200 text-center">Discount</div>
                <div className="p-3 text-center">Action</div>
            </div>

            <div className="grid grid-cols-9 border-t border-gray-300 items-center">
                {/* ... (Offer Type, Name, On, Gender, Type, Min Order logic same as before) ... */}
                <div className="border-r border-gray-200 p-2 text-center">
                   <select className={inputClass} value={createForm.offer_type} onChange={(e) => setCreateForm({ ...createForm, offer_type: e.target.value })}>
                        {Object.keys({ "Price Based": [], "Quantity Based": [], "Cashback Based": [], "Loyalty Based": [], "Item Gift": [] }).map(opt => <option key={opt}>{opt}</option>)}
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
                
                {/* Image Preview & Upload Cell */}
                <div className="border-r border-gray-200 p-2 flex flex-col items-center justify-center gap-1">
                    {previewUrl ? (
                        <div className="relative group">
                            <img src={previewUrl} alt="Preview" className="h-10 w-10 object-cover rounded border border-purple-200" />
                            <button 
                                onClick={() => { setSelectedFile(null); setPreviewUrl(""); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="text-[10px] py-1 px-2 rounded border border-dashed border-gray-300 text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-all flex items-center gap-1"
                        >
                            <ImageIcon size={12} /> Select
                        </button>
                    )}
                </div>

                <div className="border-r border-gray-200 p-2">
                    {/* ... (Discount Value Select logic) ... */}
                    <input className={inputClass} placeholder="Val" value={createForm.discount} onChange={(e) => setCreateForm({ ...createForm, discount: e.target.value })} />
                </div>
                
                <div className="p-2 flex justify-center items-center">
                    <button onClick={handleAddOffer} disabled={loading} className="cursor-pointer bg-purple-600 text-white py-1.5 px-3 rounded-md font-bold text-xs hover:bg-purple-700 disabled:opacity-50">
                        {loading ? "Processing..." : "Add Offer"}
                    </button>
                </div>
            </div>
        </div>
    );
}