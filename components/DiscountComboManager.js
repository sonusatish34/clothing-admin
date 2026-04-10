"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Package } from "lucide-react";
import Swal from 'sweetalert2';

export default function DiscountComboManager({ tokenAuth, app_user_id, store_id, availableDiscounts }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCombos = async () => {
        try {
            const res = await axios.get(`https://dev.zuget.com/admin/combined-discounts?app_user_id=${app_user_id}&store_id=${store_id}`, {
                headers: { Authorization: `${tokenAuth}` }
            });
            setCombinedData(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch combos", error);
        }
    };

    useEffect(() => {
        if (tokenAuth) fetchCombos();
    }, [tokenAuth]);

    const handleCreateCombo = async () => {
        if (selectedIds.length < 2) {
            return Swal.fire("Info", "Select at least 2 discounts to make a combo", "info");
        }
        setLoading(true);
        try {
            await axios.post('https://dev.zuget.com/admin/store-combined-discounts', {
                app_user_id,
                store_id,
                discount_ids: selectedIds.map(Number)
            }, {
                headers: { Authorization: `${tokenAuth}` }
            });
            Swal.fire("Success", "Combo created successfully!", "success");
            setSelectedIds([]);
            fetchCombos();
        } catch (error) {
            Swal.fire("Error", "Failed to create combo", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="mb-8 font-sans">
            <h2 className="text-sm font-bold mb-2">Active Discounts Combo</h2>

            <div className="flex border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                <div className="w-1/4 bg-gray-50 p-4 flex items-center border-r border-gray-200 font-medium">
                    Select Offer Combo
                </div>

                <div className="w-3/4 p-4 flex gap-4 items-center">
                    <div className="flex-1 relative">
                        {/* Custom Multi-select dropdown logic */}
                        <div className="min-h-[40px] border border-gray-300 rounded px-2 py-1 flex flex-wrap gap-2 items-center bg-gray-50">
                            {selectedIds.length === 0 && <span className="text-gray-400 text-xs">Pick discounts from below...</span>}
                            {selectedIds.map(id => {
                                const disc = availableDiscounts.find(d => (d._id || d.discount_id) === id);
                                return (
                                    <span key={id} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[11px] flex items-center gap-1 border border-purple-200 capitalize">
                                        {disc?.offer_name}
                                        <Trash2 size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleSelection(id)} />
                                    </span>
                                );
                            })}
                        </div>

                        {/* Selection list (Scrollable) */}
                        <div className="mt-2 max-h-32 overflow-y-auto border border-gray-100 rounded text-xs shadow-inner bg-white">
                            {availableDiscounts.filter(d => d.status === 'active').map(d => {
                                const id = d._id || d.discount_id;
                                const isSelected = selectedIds.includes(id);
                                return (
                                    <div
                                        key={id}
                                        onClick={() => toggleSelection(id)}
                                        className={`p-2 capitalize cursor-pointer border-b hover:bg-gray-50 flex justify-between ${isSelected ? 'bg-purple-50' : ''}`}
                                    >
                                        <span>{d.offer_name} ({d.discount})</span>
                                        {isSelected ? <span className="text-purple-600 font-bold">✓</span> : <Plus size={14} className="text-gray-400" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateCombo}
                        disabled={loading}
                        className="bg-purple-600 text-white px-6 py-2 rounded font-bold text-xs hover:bg-purple-700 disabled:opacity-50 h-[40px] flex items-center gap-2"
                    >
                        <Package size={16} /> {loading ? "Creating..." : "Create Combo"}
                    </button>
                </div>
            </div>

            {/* Displaying Current Combos */}
            {combinedData.length > 0 && (
                <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
                    <h3 className="text-[12px] font-semibold text-blue-700 uppercase tracking-wide mb-3">
                        Combined Offers
                    </h3>

                    <div className="flex flex-col gap-4">
                        {combinedData.map((combo, index) => (
                            <div
                                key={index}
                                className="bg-white border border-blue-100 rounded-lg p-3 shadow hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start gap-3">

                                    {/* Left Number Badge */}
                                    <div className="h-7 w-7 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-full text-xs">
                                        {index + 1}
                                    </div>

                                    {/* Divider */}
                                    <span className="text-gray-300 font-bold">|</span>

                                    {/* Offers List */}
                                    <div className="flex flex-wrap gap-2">
                                        {combo.discounts.map((item, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] rounded-full shadow-sm capitalize"
                                            >
                                                {item.offer_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}