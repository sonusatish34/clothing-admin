"use client";
import { useState } from "react";
import { Pencil, Pause, XCircle, Check, X ,CircleCheck} from "lucide-react";
import { formatDateTime } from "@/utils/convertDate";
import Image from "next/image";

const DISCOUNT_OPTIONS = {
    "Price Based": ["Percentage Discount", "Flat Discount", "Cart Value Discount", "Tiered / Slab Discount", "Max Discount Cap"],
    "Quantity Based": ["Buy X Get Y", "Combo Offer", "Milestone Discount"],
    "Cashback Based": ["Wallet Cashback", "Tiered Wallet Cashback"],
    "Loyalty Based": ["VIP Discount", "Loyalty Tier Cashback", "Milestone Reward"],
    "Item Gift": ["Free Gift Item"]
};

export default function DiscountsTable({ discounts, onUpdateStatus, onUpdateDiscount, loading, status }) {
    console.log(status, "0000000status0000000000")
    const [inlineEditingId, setInlineEditingId] = useState(null);
    const [editBuffer, setEditBuffer] = useState({});

    const startEdit = (item) => {
        setInlineEditingId(item._id || item.discount_id);
        setEditBuffer({ ...item, min_order_value: item.min_order_value || 0 });
    };

    const handleInlineChange = (key, value) => {
        setEditBuffer(prev => {
            const updated = { ...prev, [key]: value };
            if (key === "offer_type") updated.discount_type = (DISCOUNT_OPTIONS[value] || [])[0];
            return updated;
        });
    };

    const tableInputClass = "w-full border border-gray-300 rounded px-1 py-1 text-xs focus:ring-1 focus:ring-purple-500 outline-none h-8";
    // <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
    //             <table className="w-full text-left border-collapse min-w-[1000px]"></table>
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[700px]">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed border border-gray-300 ">
                <thead className="bg-gray-50 border-b border-gray-300 text-gray-600 font-semibold text-[11px] uppercase">
                    <tr>
                        <th className="p-3 border border-gray-200 w-[10%]">Offer Type</th>
                        <th className="p-3 border border-gray-200 w-[10%]">Created On</th>
                        <th className="p-3 border border-gray-200 w-[8%]">Status</th>
                        <th className="p-3 border border-gray-200 w-[14%]">Offer Name</th>
                        <th className="p-3 border border-gray-200 w-[8%]">Offer On</th>
                        <th className="p-3 border border-gray-200 w-[8%]">Gender</th>
                        <th className="p-3 border border-gray-200 w-[10%]">Discount Type</th>
                        <th className="p-3 border border-gray-200 w-[10%]">Image Link</th>
                        <th className="p-3 border border-gray-200 w-[8%]">Discount</th>
                        <th className="p-3 border border-gray-200 w-[22%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {discounts.map((d) => {
                        const isEditing = inlineEditingId === (d._id || d.discount_id);
                        return (
                            <tr key={d._id || d.discount_id} className={`h-14 border border-gray-200 ${isEditing ? "bg-purple-50" : "hover:bg-gray-50"}`}>
                                {isEditing ? (
                                    <>
                                        <td className="p-2 border"><select className={tableInputClass} value={editBuffer.offer_type} onChange={e => handleInlineChange("offer_type", e.target.value)}>{Object.keys(DISCOUNT_OPTIONS).map(o => <option key={o}>{o}</option>)}</select></td>
                                        <td className="p-2 border text-[10px] italic text-gray-400">Locked</td>
                                        <td className="p-2 border"><input className={tableInputClass} value={editBuffer.status} onChange={e => handleInlineChange("status", e.target.value)} /></td>
                                        <td className="p-2 border"><input className={tableInputClass} value={editBuffer.offer_name} onChange={e => handleInlineChange("offer_name", e.target.value)} /></td>
                                        <td className="p-2 border"><select className={tableInputClass} value={editBuffer.offer_on} onChange={e => handleInlineChange("offer_on", e.target.value)}><option>All Items</option><option>Shirts</option><option>Jeans</option></select></td>
                                        <td className="p-2 border"><select className={tableInputClass} value={editBuffer.gender} onChange={e => handleInlineChange("gender", e.target.value)}><option>All</option><option>Mens</option><option>Womens</option></select></td>
                                        <td className="p-2 border"><select className={tableInputClass} value={editBuffer.discount_type} onChange={e => handleInlineChange("discount_type", e.target.value)}>{(DISCOUNT_OPTIONS[editBuffer.offer_type] || []).map(o => <option key={o}>{o}</option>)}</select></td>
                                        <td className="p-2 border"><input className={tableInputClass} value={editBuffer.image_link} onChange={e => handleInlineChange("image_link", e.target.value)} /></td>
                                        <td className="p-2 border"><input className={tableInputClass} value={editBuffer.discount} onChange={e => handleInlineChange("discount", e.target.value)} /></td>
                                        <td className="p-2 border">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={async () => { await onUpdateDiscount(inlineEditingId, editBuffer); setInlineEditingId(null); }} className="p-1.5 bg-green-600 text-white rounded">{loading ? "..." : <Check size={14} />}</button>
                                                <button onClick={() => setInlineEditingId(null)} className="p-1.5 bg-gray-400 text-white rounded"><X size={14} /></button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3 border border-gray-200">{d.offer_type}</td>
                                        <td className="p-3 border border-gray-200 text-[10px]">{formatDateTime(d.created_on)}</td>
                                        <td className="p-3 border border-gray-200">{d.status}</td>
                                        <td className="p-3 border border-gray-200 text-gray-400 capitalize">{d.offer_name} ({d._id})</td>
                                        <td className="p-3 border border-gray-200">{d.offer_on}</td>
                                        <td className="p-3 border border-gray-200">{d.gender}</td>
                                        <td className="p-3 border border-gray-200">{d.discount_type}</td>
                                        <td className="p-3 border border-gray-200 truncate max-w-[80px] text-blue-500 text-[10px]">
                                            {d.image_link ? <Image alt="image discount" src={d.image_link} className="w-20 h-20 rounded-md" width={500} height={500} /> : ''}
                                        </td>
                                        <td className="p-3 border border-gray-200 font-bold">{d.discount}</td>
                                        <td className="p-3 border border-gray-200">
                                            <div className="flex justify-center items-center gap-x-3 text-sm">
                                                {status === 'active' && (
                                                    <button
                                                        onClick={() => startEdit(d)}
                                                        className="group cursor-pointer flex items-center gap-x-1 px-1.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                                                    >
                                                        <Pencil
                                                            size={16}
                                                            className="transition-colors duration-200"
                                                        />
                                                        <span className="text-xs font-medium">Edit</span>
                                                    </button>
                                                )}
                                                {/* {() => onUpdateStatus(d._id, "inactive")} */}
                                                {status === 'active' && (
                                                    <button
                                                        onClick={() => { onUpdateStatus(d._id, "inactive") }}
                                                        className="group cursor-pointer flex items-center gap-x-1 px-1.5 py-1 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 hover:bg-purple-600 hover:text-white transition-all duration-200 shadow-sm"
                                                    >
                                                        <Pause
                                                            size={16}
                                                            className="transition-colors duration-200"
                                                        />
                                                        <span className="text-xs font-medium">Pause</span>
                                                    </button>
                                                )}
                                                {(status === 'active' || status === 'inactive') && (
                                                    <button
                                                        onClick={() => { onUpdateStatus(d._id, "deleted")}}
                                                        className="group cursor-pointer flex items-center gap-x-1 px-1.5 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                                                    >
                                                        <XCircle
                                                            size={16}
                                                            className="transition-colors duration-200"
                                                        />
                                                        <span className="text-xs font-medium">Close</span>
                                                    </button>
                                                )}
                                                {(status === 'inactive' || status === 'deleted')  && (
                                                    <button
                                                        onClick={() => { onUpdateStatus(d._id, "active")}}
                                                        className="group cursor-pointer flex items-center gap-x-1 px-1.5 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100 hover:bg-green-600 hover:text-white transition-all duration-200 shadow-sm"
                                                    >
                                                        <CircleCheck
                                                            size={16}
                                                            className="transition-colors duration-200"
                                                        />
                                                        <span className="text-xs font-medium">Active It</span>
                                                    </button>
                                                )}
                                                {/* {status === 'active' && (
                                                    <button
                                                        onClick={() => startEdit(d)}
                                                        className="group cursor-pointer flex items-center gap-x-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 hover:bg-purple-600 hover:text-white transition-all duration-200 shadow-sm"
                                                    >
                                                        <Pause
                                                            size={16}
                                                            className="transition-colors duration-200"
                                                        />
                                                        <span className="text-sm font-medium">Pause</span>
                                                    </button>
                                                )} */}


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
    );
}