"use client";
import { useState } from "react";
import { Pencil, Pause, XCircle, Check, X } from "lucide-react";
import { formatDateTime } from "@/utils/convertDate";

const DISCOUNT_OPTIONS = {
    "Price Based": ["Percentage Discount", "Flat Discount", "Cart Value Discount", "Tiered / Slab Discount", "Max Discount Cap"],
    "Quantity Based": ["Buy X Get Y", "Combo Offer", "Milestone Discount"],
    "Cashback Based": ["Wallet Cashback", "Tiered Wallet Cashback"],
    "Loyalty Based": ["VIP Discount", "Loyalty Tier Cashback", "Milestone Reward"],
    "Item Gift": ["Free Gift Item"]
};

export default function DiscountsTable({ discounts, onUpdateStatus, onUpdateDiscount, loading }) {
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

    return (
        <div className="overflow-x-auto h-[800px]">
            <table className="w-full text-left table-fixed border border-gray-300 border-collapse ">
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
                                        <td className="p-3 border border-gray-200 text-gray-400 capitalize">{d.offer_name}({d._id})</td>
                                        <td className="p-3 border border-gray-200">{d.offer_on}</td>
                                        <td className="p-3 border border-gray-200">{d.gender}</td>
                                        <td className="p-3 border border-gray-200">{d.discount_type}</td>
                                        <td className="p-3 border border-gray-200 truncate max-w-[120px] text-blue-500 text-[10px]">{d.image_link || "No Image"}</td>
                                        <td className="p-3 border border-gray-200 font-bold">{d.discount}</td>
                                        <td className="p-3 border border-gray-200">
                                            <div className="flex justify-center items-center gap-4">
                                                <Pencil size={20} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => startEdit(d)} />
                                                <div className="bg-purple-100 p-1 rounded-full cursor-pointer hover:bg-purple-200" onClick={() => onUpdateStatus(d._id, "inactive")}><Pause size={20} className="text-purple-600 fill-purple-600" /></div>
                                                <XCircle size={20} className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => onUpdateStatus(d._id, "deleted")} />
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