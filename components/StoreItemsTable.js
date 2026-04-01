"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FaTimes, FaBarcode, FaEdit, FaPrint, FaSave,
    FaCamera, FaSpinner, FaCheckSquare, FaSquare
} from "react-icons/fa";
import { FcApprove, FcDisapprove } from "react-icons/fc";

// import heic2any from "heic2any";

const API_BASE = "https://dev.zuget.com";
const ALPHA_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const NUMERIC_SIZES = Array.from({ length: 11 }, (_, i) => (28 + i * 2).toString());

export default function StoreItemsTable({ storeId }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    // --- Search & Filter State ---
    const [searchQuery, setSearchQuery] = useState(""); // For item_id and barcode
    const [nameFilter, setNameFilter] = useState("");   // For item_name dropdown
    const [isVerified, setIsVerified] = useState(null);   // For item_name dropdown

    const filteredItems = items.filter((item) => {
        // 1. Ensure we are checking strings and handle potential nulls
        const idString = String(item?._id || "").toLowerCase();
        const barcodeString = String(item?.barcode || "").toLowerCase();
        const query = searchQuery.toLowerCase().trim();

        const matchesSearch = idString.includes(query) || barcodeString.includes(query);

        const matchesName = nameFilter === "" || item.item_name === nameFilter;

        // --- Verified Filter Logic ---
        const matchesVerified =
            isVerified === "" ||
            item.is_verified === (isVerified === "true");

        return matchesSearch && matchesName && matchesVerified;
    });

    // Get unique names for the dropdown
    console.log(items, 'items-----------');

    const uniqueNames = [...new Set(items.map(item => item.item_name))].sort();
    // --- Existing Forward State ---
    const [availableStores, setAvailableStores] = useState([]);
    const [selectedTargetStore, setSelectedTargetStore] = useState("");
    const [forwardingItem, setForwardingItem] = useState(null);
    const [forwardLoading, setForwardLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // --- New Edit & Print State ---
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printingItem, setPrintingItem] = useState(null);
    const [printSelections, setPrintSelections] = useState([]);

    const getAuthHeaders = () => {
        const phone = window.localStorage.getItem("user_phone") || "";
        const token = window.localStorage.getItem(`${phone}_token`) || "";
        return {
            "accept": "application/json",
            "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        };
    };

    const fetchItems = () => {
        if (!storeId) return;

        // CAPTURE: Save where the user is currently looking
        scrollPosRef.current = window.scrollY;

        setLoading(true);
        fetch(`${API_BASE}/admin/store-items?store_id=${storeId}`, { headers: getAuthHeaders() })
            .then((res) => res.json())
            .then((result) => {
                setItems(result.data || []);
                // RESTORE: Use a timeout to ensure React has finished 
                // painting the table rows before scrolling
                setTimeout(() => {
                    window.scrollTo({
                        top: scrollPosRef.current,
                        behavior: 'instant' // 'instant' prevents flickering
                    });
                }, 100);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchItems();
        fetch(`${API_BASE}/admin/approved-store-names`, { headers: getAuthHeaders() })
            .then((res) => res.json())
            .then((data) => setAvailableStores(data.data || []))
            .catch(console.error);
    }, [storeId]);

    // --- EDIT HELPERS ---
    const getFullSizeData = (existingSizeData) => {
        const isNumeric = existingSizeData.some(s => !isNaN(Number(s.size)));
        const range = isNumeric ? NUMERIC_SIZES : ALPHA_SIZES;
        return range.map(size => {
            const existing = existingSizeData.find(s => s.size.toString().toUpperCase() === size);
            return existing || { size: size, price: 0, quantity: 0 };
        });
    };

    const handleImageChange = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let fileToProcess = file;

        // Check if it's an HEIC file
        if (file.name.toLowerCase().endsWith(".heic")) {
            try {
                // DYNAMICALLY IMPORT HEIC2ANY ONLY ON CLIENT-SIDE
                const heic2any = (await import("heic2any")).default;

                const converted = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8
                });

                fileToProcess = new File(
                    [Array.isArray(converted) ? converted[0] : converted],
                    file.name.replace(/\.heic$/i, ".jpg"),
                    { type: "image/jpeg" }
                );
            } catch (error) {
                console.error("HEIC conversion failed:", error);
                return;
            }
        }

        const localUrl = URL.createObjectURL(fileToProcess);
        setEditFormData({
            ...editFormData,
            [`${field}_file`]: fileToProcess,
            [`${field}_preview`]: localUrl,
        });
    };

    const uploadToS3 = async (file) => {
        const formdata = new FormData();
        formdata.append("file", file);
        const res = await fetch(`${API_BASE}/s3/image-file`, {
            method: "POST",
            headers: { Authorization: getAuthHeaders().Authorization },
            body: formdata,
        });
        const result = await res.json();
        return result?.data?.image_link;
    };

    const handleUpdate = async (itemId) => {
        setIsUpdating(true);
        try {
            let finalFrontUrl = editFormData.item_image;
            let finalBackUrl = editFormData.item_video;
            if (editFormData.front_file) finalFrontUrl = await uploadToS3(editFormData.front_file);
            if (editFormData.back_file) finalBackUrl = await uploadToS3(editFormData.back_file);

            const cleanedSizeData = editFormData.size_data.filter((s) => s.quantity > 0 || s.price > 0);
            const res = await fetch(`${API_BASE}/admin/update-product?item_id=${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...getAuthHeaders() },
                body: JSON.stringify({ ...editFormData, item_image: finalFrontUrl, item_video: finalBackUrl, size_data: cleanedSizeData }),
            });
            if ((await res.json()).status === "success") {
                setEditingId(null);
                fetchItems();
            }
        } catch (e) { console.error(e); }
        setIsUpdating(false);
    };

    // --- PRINT HELPERS ---
    const openPrintModal = (item) => {
        setPrintingItem(item);
        const initial = item.size_data
            .filter((s) => s.quantity > 0)
            .map((s) => ({ size: s.size, printQty: s.quantity, price: s.price, selected: true }));
        setPrintSelections(initial);
        setIsPrintModalOpen(true);
    };

    const executePrint = () => {
        if (!printingItem?.barcode) return alert("No barcode found");
        const toPrint = printSelections.filter(s => s.selected && s.printQty > 0);
        if (toPrint.length === 0) return alert("Select at least one size");

        const win = window.open("", "_blank");
        if (!win) {
            alert("Popup blocked! Please allow popups to print labels.");
            return;
        }

        const storeName = localStorage.getItem("store_name") || "THE EDIT LUXURY CLUB";

        let html = `
<html>
<head>
  <title>Print Labels</title>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
  <style>
    @page { size: 101.6mm 50.8mm; margin: 0; }
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: #fff; text-transform: uppercase; }
    
    .label-container {
      width: 101.6mm;
      height: 50.8mm;
      display: flex;
      align-items: center;
      justify-content: center;
      page-break-after: always;
      overflow: hidden;
    }

    .portrait-wrapper {
      transform: rotate(-90deg);
      width: 48mm;
      height: 88mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2mm 4mm;
      box-sizing: border-box;
    }

    .store_name {
      background: #000 !important;
      color: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      padding: 2px 6px;
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      margin-top: 2mm;
      margin-bottom: 2px;
    }

    .barcode-section { 
      background: #fff; 
      width: 100%; 
      padding: 0;
      margin: 0;
    }

    .barcode-svg {
      width: 100%; 
      height: 100px; 
      display: block;
      margin: 0 auto;
      shape-rendering: crispEdges;
    }

    .barcode-number { font-size: 12px; font-weight: 800; margin-bottom: 4px; }
    
    .brand {
      padding-top: 10px;
      font-size: 18px;
      font-weight: 900;
      margin: 2px 0;
    }
    
    .specs {
      font-size: 10px;
      font-weight: 800;
      line-height: 1.8;
      flex-grow: 1;
      padding-top: 12px;
    }
    
    .specs p {
      margin: 1px 0;
      white-space: normal;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1.5px solid #000;
      padding-top: 2px;
      margin-top: 2px;
      margin-bottom: 4mm;
    }

    .mrp-label { font-size: 8px; font-weight: 700; line-height: 1; }
    .price { font-size: 20px; font-weight: 900; }
  </style>
</head>
<body>
`;

        toPrint.forEach((s) => {
            for (let i = 0; i < s.printQty; i++) {
                // Generate a unique ID for each barcode element to prevent rendering conflicts
                const uniqueId = `bc_${s.size}_${i}_${Math.floor(Math.random() * 1000)}`;

                html += `
<div class="label-container">
  <div class="portrait-wrapper">
    <div style="display: flex; flex-direction: column;">
      <div class="store_name">${storeName}</div>
      <div class="barcode-section">
        <svg class="barcode-svg" id="${uniqueId}" data-value="${printingItem.barcode}-${s.size}"></svg>
        <div class="barcode-number">${printingItem.barcode}-${printingItem._id}-${s.size}</div>
      </div>
      <div class="brand">${printingItem.brand || ""}</div>
      <div class="specs">
        <p>ITEM: ${printingItem.item_name || printingItem.item || ""}</p>
        <p>SIZE: ${s.size}</p>
        <p>COLOR: ${printingItem.color || "N/A"}</p>
        <p>FIT: ${printingItem.fit || "N/A"}</p>
      </div>
    </div>
    <div class="footer">
      <div class="mrp-label">MAX RETAIL PRICE<br/>(Incl. of all taxes)</div>
      <div class="price">₹${s.price}</div>
    </div>
  </div>
</div>`;
            }
        });

        html += `
<script>
  window.onload = () => {
    document.querySelectorAll('.barcode-svg').forEach(el => {
      JsBarcode("#" + el.id, el.getAttribute('data-value'), {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: false,
        margin: 0,
        background: "#ffffff",
        lineColor: "#000000",
        flat: true
      });
    });

    setTimeout(() => {
      window.print();
      window.close();
    }, 700);
  };
</script>
</body>
</html>`;

        win.document.write(html);
        win.document.close();
    };

    // --- FORWARD LOGIC ---
    const openForwardModal = (item) => {
        const initializedSizes = item.size_data.map(s => ({
            ...s,
            original_qty: s.quantity,
            forward_qty: 0
        }));
        setForwardingItem({ ...item, size_data: initializedSizes });
    };

    const updateForwardQty = (index, delta) => {
        const newData = [...forwardingItem.size_data];
        const item = newData[index];
        const nextVal = item.forward_qty + delta;
        if (nextVal >= 0 && nextVal <= item.original_qty) {
            item.forward_qty = nextVal;
            item.quantity = item.original_qty - nextVal;
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
                size: s.size, price: s.price, quantity: s.forward_qty
            }))
        };
        try {
            const res = await fetch(`${API_BASE}/admin/forward-items`, {
                method: "POST",
                headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if ((await res.json()).status === "success") {
                alert("Forwarded successfully");
                setForwardingItem(null);
                fetchItems();
            }
        } catch (err) { alert("Error forwarding items"); }
        finally { setForwardLoading(false); }
    };
    const scrollPosRef = typeof window !== 'undefined' ?
        { current: window.scrollY } : { current: 0 };
    const [loadingId, setLoadingId] = useState(null);

    const handleVerifiedCondition = async (itemId, currentStatus) => {
        setLoadingId(itemId);
        const newStatus = !currentStatus;

        // 1. Capture current scroll position
        const currentScroll = window.scrollY;

        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        // Use your token logic here
        myHeaders.append("Authorization", getAuthHeaders().Authorization);

        try {
            const response = await fetch(
                `${API_BASE}/admin/update-item-verified?item_id=${itemId}&is_verified=${newStatus}`,
                { method: "PUT", headers: myHeaders }
            );

            const result = await response.json();

            if (result.status === "success" || response.ok) {
                // 2. SUCCESS: Update the local state instead of reloading
                setItems(prevItems =>
                    prevItems.map(item =>
                        item._id === itemId ? { ...item, is_verified: newStatus } : item
                    )
                );

                // 3. Optional: Re-fetch in background to ensure sync, 
                // but local state update handles the UI immediately.
                // fetchItems(); 
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setLoadingId(null);
            // 4. CRITICAL: Remove window.location.reload();
            // This was preventing the state update and resetting scroll.
        }
    };


    return (
        <div className="p-4 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <h2 className="text-sm text-gray-500 uppercase">
                        Store: {availableStores.find(s => s.store_id == storeId)?.store_name || storeId}
                    </h2>
                </div>
                <Link target="_blank" href='/barcode-search'>
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        Barcode Search <FaBarcode />
                    </button>
                </Link>
            </div>
            {/* --- Filters Section --- */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-[250px]">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Search ID / Barcode</label>
                    <input
                        type="text"
                        placeholder="Enter Item ID or Barcode..."
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="w-64">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status Filter</label>
                    <select
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={isVerified}
                        onChange={(e) => setIsVerified(e.target.value)} // Added 'e' here
                    >
                        <option value="">All Items</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                    </select>
                </div>
                <div className="w-64">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Filter by Item Name</label>
                    <select
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    >
                        <option value="">All Items</option>
                        {uniqueNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => { setSearchQuery(""); setNameFilter(""); }}
                        className="text-xs text-blue-600 hover:underline pb-3"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Update the Table Map to use filteredItems */}
            {loading ? (
                <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-blue-600" /></div>
            ) : (
                <div className="overflow-x-auto border rounded-xl shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        {/* ... thead ... */}
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => {
                                    // ... your existing row logic ...
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400">
                                        No items found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {loading ? (
                <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-blue-600" /></div>
            ) : (
                <div className="overflow-x-auto border rounded-xl shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4">Item Details</th>
                                <th className="p-4">Verified/Not</th>
                                <th className="p-4 text-center">Images</th>
                                <th className="p-4">Stock Matrix</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => {
                                const isEditing = editingId === item._id;
                                return (
                                    <tr key={item._id} className={`text-xl ${isEditing ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                                        <td className="p-4 flex flex-col gap-y-1">
                                            <p className="font-bold text-gray-900">{item.item_name}</p>
                                            <p className=" text-gray-700">ID: {item._id} | {item.barcode}</p>
                                            <p className=" text-blue-500 mt-1">{item.created_on}</p>
                                        </td>
                                        <td className=" pt-1">
                                            {/* <p>{item.is_verified ? <FcApprove size={40} /> : <FcDisapprove size={40} />}</p> */}
                                            <button
                                                disabled={loadingId === item.item_id}
                                                onClick={() => handleVerifiedCondition(item._id, item.is_verified)}
                                                className={`flex items-center justify-center gap-2 p-1 rounded-md min-w-[100px] text-white transition-opacity ${item.is_verified ? "bg-green-500" : "bg-red-500"
                                                    } ${loadingId === item.item_id ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                                            >
                                                {loadingId === item.item_id ? (
                                                    <>
                                                        {/* Small Tailwind Spinner */}
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <span>{item.is_verified ? "Verified" : "Not Verified"}</span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                {[item.item_image, item.item_video].map((img, idx) => (
                                                    <div key={idx} className="relative group w-12 h-12 border rounded overflow-hidden bg-gray-100">
                                                        <img
                                                            src={isEditing ? (idx === 0 ? (editFormData.front_preview || item.item_image) : (editFormData.back_preview || item.item_video)) : img}
                                                            className="w-full h-full object-cover cursor-pointer"
                                                            onClick={() => setPreviewImage(img)}
                                                        />
                                                        {isEditing && (
                                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                                                <FaCamera className="text-white text-xs" />
                                                                <input type="file" className="hidden" onChange={(e) => handleImageChange(e, idx === 0 ? "front" : "back")} />
                                                            </label>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {isEditing ? (
                                                <div className="grid grid-cols-5 gap-1">
                                                    {editFormData.size_data.map((s, i) => (
                                                        <div key={i} className="flex flex-col border p-1 rounded bg-white">
                                                            <span className="text-[12px] font-black text-gray-400">{s.size}</span>
                                                            <input
                                                                type="number"
                                                                className="w-full text-[10px] outline-none"
                                                                placeholder="Qty"
                                                                value={s.quantity || ""}
                                                                onChange={(e) => {
                                                                    const next = [...editFormData.size_data];
                                                                    next[i].quantity = Number(e.target.value);
                                                                    setEditFormData({ ...editFormData, size_data: next });
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.size_data?.filter(s => s.quantity > 0).map((s, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 border text-[10px] font-bold rounded">
                                                            {s.size}: {s.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={() => handleUpdate(item._id)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                            {isUpdating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-gray-600 rounded">
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => openPrintModal(item)} className="p-2 text-gy-500 hover:bg-gray-100 rounded" title="Print Labels">
                                                            <FaPrint size={40} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(item._id);
                                                                setEditFormData({ ...item, size_data: getFullSizeData(item.size_data) });
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit Item"
                                                        >
                                                            <FaEdit size={40} />
                                                        </button>
                                                        <button
                                                            onClick={() => openForwardModal(item)}
                                                            className="bg-gray-900 text-white px-3 py-1 rounded text-xs hover:bg-black transition cursor-pointer"
                                                        >
                                                            Forward
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- PRINT MODAL --- */}
            {isPrintModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold">Print Labels</h3>
                            <button onClick={() => setIsPrintModalOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                            {printSelections.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 border rounded-xl">
                                    <button onClick={() => {
                                        const next = [...printSelections];
                                        next[idx].selected = !next[idx].selected;
                                        setPrintSelections(next);
                                    }}>
                                        {s.selected ? <FaCheckSquare className="text-blue-600" /> : <FaSquare className="text-gray-300" />}
                                    </button>
                                    <div className="flex-1 font-bold">{s.size}</div>
                                    <input
                                        type="number"
                                        className="w-16 border rounded p-1 text-center"
                                        value={s.printQty}
                                        onChange={(e) => {
                                            const next = [...printSelections];
                                            next[idx].printQty = Number(e.target.value);
                                            setPrintSelections(next);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 flex gap-2">
                            <button onClick={() => setIsPrintModalOpen(false)} className="flex-1 py-2 font-bold text-gray-500">Cancel</button>
                            <button onClick={executePrint} className="flex-[2] py-2 bg-blue-600 text-white rounded-lg font-bold">
                                Print Labels
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FORWARD MODAL (Already present in your code) --- */}
            {forwardingItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Forwarding: {forwardingItem.item_name}</h2>
                            <select
                                className="border p-2 rounded bg-white text-sm"
                                value={selectedTargetStore}
                                onChange={(e) => setSelectedTargetStore(e.target.value)}
                            >
                                <option value="">Select Store...</option>
                                {availableStores.map(s => (
                                    <option className="capitalize" key={s.store_id} value={s.store_id}>{s.store_name} - {s.store_id}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
                            <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                                {forwardingItem.size_data.map((size, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <span className="font-bold text-gray-700">{size.size}</span>
                                            {/* Change size.original_qty to size.quantity to see it reduce */}
                                            <p className="text-xs font-semibold text-blue-600">
                                                Remaining: {size.quantity}
                                                <span className="text-gray-400 font-normal ml-2">(Total: {size.original_qty})</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => updateForwardQty(idx, -1)}
                                                className="w-8 h-8 bg-white border rounded shadow hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                            >-</button>

                                            <div className="flex flex-col items-center min-w-[50px]">
                                                <span className="text-[9px] uppercase text-gray-400 font-bold leading-none">Forward</span>
                                                <span className="text-sm font-black text-blue-600">{size.forward_qty}</span>
                                            </div>

                                            <button
                                                onClick={() => updateForwardQty(idx, 1)}
                                                className="w-8 h-8 bg-white border rounded shadow hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setForwardingItem(null)} className="px-4 py-2">Cancel</button>
                            <button
                                onClick={handleFinalForward}
                                disabled={forwardLoading}
                                className="px-6 py-2 bg-green-600 text-white rounded font-bold disabled:opacity-50"
                            >
                                {forwardLoading ? "Sending..." : "Confirm Forward"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PREVIEW MODAL --- */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
                    <img src={previewImage} className="max-w-full max-h-[90vh] rounded shadow-2xl" />
                </div>
            )}
        </div>
    );
}