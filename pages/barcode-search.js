import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa'; // Added FaSpinner

export default function BarcodeSearchPage() {
  const [data, setData] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  
  // --- New State for Verification Loading ---
  const [loadingId, setLoadingId] = useState(null);

  // Helper for Headers
  const getAuthHeaders = () => {
    const phone = localStorage.getItem("user_phone") || "";
    const token = localStorage.getItem(`${phone}_token`) || "";
    return {
      'accept': 'application/json',
      'Authorization': token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    };
  };

  // 1. Fetch Store Names
  useEffect(() => {
    fetch(`https://dev.zuget.com/admin/approved-store-names`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((result) => setAvailableStores(result.data || []))
      .catch((err) => console.error("Failed to load stores:", err));
  }, []);

  // 2. Verification Logic
  const handleVerifiedCondition = async (itemId, currentStatus) => {
    setLoadingId(itemId);
    const newStatus = !currentStatus;

    try {
      const response = await fetch(
        `https://dev.zuget.com/admin/update-item-verified?item_id=${itemId}&is_verified=${newStatus}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        // Update local state so the UI changes instantly without a reload
        setData((prevData) =>
          prevData.map((item) =>
            item._id === itemId ? { ...item, is_verified: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  // 3. Barcode Search Logic (Debounced)
  useEffect(() => {
    if (!barcode) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://dev.zuget.com/admin/barcode-item-search?barcode=${barcode}`,
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Search</h1>
            <p className="text-gray-500 mt-1">
              Scanning for: <span className="font-mono font-bold text-blue-600">{barcode || "____"}</span>
            </p>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Scan / Type Barcode</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g. 660644"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
              autoFocus
            />
          </div>
        </header>

        {loading && <div className="p-10 text-center animate-pulse text-blue-600 font-bold">Searching inventory...</div>}
        {error && <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">Error: {error}</div>}

        {!loading && !error && barcode && data.length === 0 && (
          <div className="p-10 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            No items found for barcode {barcode}
          </div>
        )}

        {data.length > 0 && (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white uppercase text-xs tracking-wider">
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Specifications</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold text-center">Store Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item) => {
                    const storeMatch = availableStores.find(
                      (s) => s.store_id.toString() === item.store_id.toString()
                    );

                    return (
                      <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex gap-x-8 items-center">
                            <img
                              src={item.item_image}
                              className="h-24 w-12 object-cover rounded cursor-pointer hover:scale-105 transition"
                              onClick={() => setPreviewImage(item.item_image)}
                              alt="Front"
                            />
                            <img
                              src={item.item_video}
                              className="h-24 w-12 object-cover rounded cursor-pointer hover:scale-105 transition"
                              onClick={() => setPreviewImage(item.item_video)}
                              alt="Front"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{item.brand}</span>
                              <h3 className="text-sm font-bold text-gray-800 leading-tight">{item.item_name}  -{item._id}</h3>
                              <p className="text-[10px] text-gray-400 font-mono">{item.barcode}</p>
                            </div>
                          </div>
                        </td>

                        {/* --- Verified Button Column --- */}
                        <td className="px-6 py-6">
                          <button
                            disabled={loadingId === item._id}
                            onClick={() => handleVerifiedCondition(item._id, item.is_verified)}
                            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                              item.is_verified ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                            } ${loadingId === item._id ? "opacity-50 cursor-wait" : ""}`}
                          >
                            {loadingId === item._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              item.is_verified ? "Verified" : "Not Verified"
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-6 text-xs text-gray-600">
                          <div><span className="text-gray-400">Color:</span> {item.color}</div>
                          <div><span className="text-gray-400">Fit:</span> {item.fit}</div>
                        </td>

                        <td className="px-6 py-6">
                          <div className="bg-gray-50 rounded p-2 text-[10px] grid grid-cols-2 gap-x-4">
                            {item.size_data.map((sz, i) => (
                              <div key={i} className="flex justify-between border-b last:border-0 border-gray-200 py-0.5">
                                <span className="font-bold">{sz.size}</span>
                                <span className={sz.quantity > 0 ? 'text-green-600' : 'text-red-400'}>{sz.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-6 text-center border-l">
                          <div className="font-black text-gray-900 uppercase text-xs">
                            {storeMatch ? storeMatch.store_name : `ID: ${item.store_id}`}
                          </div>
                          <div className="text-[10px] text-blue-500 font-mono mt-1">
                             LOC ID: {item.store_id}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Preview Modal --- */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-6 text-white text-2xl"><FaTimes /></button>
          <img src={previewImage} className="max-w-full max-h-[90vh] rounded-lg object-contain" alt="Preview" />
        </div>
      )}
    </div>
  );
}