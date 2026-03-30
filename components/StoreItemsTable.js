import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTimes,FaBarcode } from "react-icons/fa";
export default function StoreItemsTable({ storeId }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dropdown and Modal State
    const [availableStores, setAvailableStores] = useState([]);
    const [selectedTargetStore, setSelectedTargetStore] = useState("");
    const [forwardingItem, setForwardingItem] = useState(null); // The item currently being edited in modal
    const [forwardLoading, setForwardLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const getAuthHeaders = () => {
        const usermobile = window.localStorage.getItem("user_phone");
        const usertoken = usermobile ? window.localStorage.getItem(`${usermobile}_token`) : null;
        return {
            accept: "application/json",
            Authorization: `${usertoken}`,
        };
    };

    // Fetch Items and Store Names
    useEffect(() => {
        if (!storeId) return;
        setLoading(true);

        // Fetch Items
        // fetch(`https://dev.zuget.com/admin/store-items?store_id=${storeId}`, { headers: getAuthHeaders() })
        //     .then((res) => res.json())
        //     .then((data) => setItems(data.data || []))
        //     .catch(console.error)
        //     .finally(() => setLoading(false));
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem("user_phone")}_token`));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`https://dev.zuget.com/admin/store-items?store_id=${storeId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => setItems(result.data || []))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

        // Fetch Approved Stores for Dropdown
        fetch(`https://dev.zuget.com/admin/approved-store-names`, requestOptions)
            .then((res) => res.json())
            .then((data) => setAvailableStores(data.data || []))
            .catch(console.error);
    }, [storeId]);

    // Handle opening the modal and initializing local quantity state
    const openForwardModal = (item) => {
        const initializedSizes = item.size_data.map(s => ({
            ...s,
            original_qty: s.quantity, // Keep track of stock
            forward_qty: 0           // Start at zero
        }));
        setForwardingItem({ ...item, size_data: initializedSizes });
    };

    const updateForwardQty = (index, delta) => {
        const newData = [...forwardingItem.size_data];
        const item = newData[index];
        const nextVal = item.forward_qty + delta;

        // Constraint: Don't go below 0 or above original stock
        if (nextVal >= 0 && nextVal <= item.original_qty) {
            item.forward_qty = nextVal;
            item.quantity = item.original_qty - nextVal; // Visual feedback of remaining stock
            setForwardingItem({ ...forwardingItem, size_data: newData });
        }
    };

    const handleFinalForward = async () => {
        if (!selectedTargetStore) return alert("Please select a target store");

        setForwardLoading(true);
        const payload = {
            store_id: parseInt(selectedTargetStore),
            item_id: forwardingItem._id,
            size_data: forwardingItem.size_data.map(s => ({
                size: s.size,
                price: s.price,
                quantity: s.forward_qty
            }))
        };

        try {
            const res = await fetch("https://dev.zuget.com/admin/forward-items", {
                method: "POST",
                headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.status === "success") {
                alert("✅ " + data.message);
                setForwardingItem(null); // Close modal
            } else {
                alert("❌ " + data.message);
            }
        } catch (err) {
            alert("Something went wrong");
        } finally {
            setForwardLoading(false);
            window.location.reload()
        }
    };

    return (
        <div className="p-4">
            <div className=" mb-6">
                <h1 className="text-2xl font-semibold">All Items</h1>
                <h2 className="text-xl font-semibold capitalize">{availableStores.find(s => s.store_id == parseInt(storeId))?.store_name} (ID: {storeId})</h2>

                {/* <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {availableStores.find(s=>s.store_id == parseInt(storeId))?.store_name}
                    </span> */}
                {/* Store Dropdown */}.
                <Link target="_blank" href={'/barcode-search'} className="float-right"> <p className="flex gap-x-1 bg-green-500 p-2 rounded-md">Barcode Search <FaBarcode size={30}/></p></Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 uppercase text-xs">
                            <tr>
                                <th className="p-3">Id</th>
                                <th className="p-3">Barcode</th>
                                <th className="p-3">Item</th>
                                <th className="p-3">Created On</th>
                                <th className="p-3">Front Image</th>
                                <th className="p-3">Back Image</th>
                                <th className="p-3">Stock Details</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id} className="border-t">
                                    <td className="p-3 font-medium">{item._id}</td>
                                    <td className="p-3 font-medium">{item.barcode}</td>
                                    <td className="p-3 font-medium">{item.item_name}</td>
                                    <td className="p-3 font-medium">{item.created_on}</td>
                                    <td className="p-3">
                                        <img
                                            src={item.item_image}
                                            onClick={() => setPreviewImage(item.item_image)}
                                            className="w-12 h-12 rounded object-cover cursor-pointer hover:scale-105 transition"
                                            alt=""
                                        />
                                    </td>
                                    <td className="p-3">
                                        <img
                                            src={item.item_image}
                                            onClick={() => setPreviewImage(item.item_video)}
                                            className="w-12 h-12 rounded object-cover cursor-pointer hover:scale-105 transition"
                                            alt=""
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            {item.size_data?.map((s, i) => (
                                                <span key={i} className="bg-gray-50 border px-2 py-1 rounded text-[10px]">
                                                    {s.size}: {s.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => openForwardModal(item)}
                                            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
                                        >
                                            Forward Items
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- FORWARDING MODAL --- */}
            {forwardingItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl">
                        <div className="flex gap-x-2">
                            <h2 className="text-lg font-bold mb-4">Forwarding: {forwardingItem.item_name}</h2>
                            <select
                                className="border p-2 rounded bg-white shadow-sm"
                                value={selectedTargetStore}
                                onChange={(e) => setSelectedTargetStore(e.target.value)}
                            >
                                <option value="">Forward to Store...</option>
                                {availableStores.map(s => (
                                    <option key={s.store_id} value={s.store_id}>{s.store_name} {s.store_id}</option>
                                ))}
                            </select>

                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-6">
                            {forwardingItem.size_data.map((size, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b pb-3">
                                    <div>
                                        <span className="font-bold text-gray-700">{size.size}</span>
                                        <p className="text-xs text-gray-500">Available: {size.quantity} (Total: {size.original_qty})</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => updateForwardQty(idx, -1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-red-50"
                                        >-</button>

                                        <div className="text-center min-w-[60px]">
                                            <div className="text-xs text-gray-400 uppercase">Forwarding</div>
                                            <div className="font-bold text-blue-600">{size.forward_qty}</div>
                                        </div>

                                        <button
                                            onClick={() => updateForwardQty(idx, 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-green-50"
                                        >+</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setForwardingItem(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >Cancel</button>
                            <button
                                onClick={handleFinalForward}
                                disabled={forwardLoading}
                                className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50"
                            >
                                {forwardLoading ? "Sending..." : "Confirm Forward"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setPreviewImage(null)}
                >
                    <button className="absolute top-6 right-6 text-white text-2xl">
                        <FaTimes />
                    </button>
                    <img
                        src={previewImage}
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in duration-200"
                        alt="Full Preview"
                    />
                </div>
            )}
        </div>
    );
}