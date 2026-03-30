
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function BarcodeSearchPage() {
  const [data, setData] = useState([]);
  const [availableStores, setAvailableStores] = useState([]); // State for store mapping
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

//   const TOKEN = localStorage.getItem("user_phone") ? localStorage.getItem(`${localStorage.getItem("user_phone")}_token`) : null;

  // 1. Fetch Store Names once when the component mounts
  useEffect(() => {
    fetch(`https://dev.zuget.com/admin/approved-store-names`, {
      headers: {
        'accept': 'application/json',
        'Authorization': localStorage.getItem(`${localStorage.getItem('user_phone')}_token`),
      },
    })
      .then((res) => res.json())
      .then((result) => setAvailableStores(result.data || []))
      .catch((err) => console.error("Failed to load stores:", err));
  }, []);

  // 2. Barcode Search Logic
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
            headers: {
              'accept': 'application/json',
              'Authorization': localStorage.getItem(`${localStorage.getItem('user_phone')}_token`),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              autoFocus
            />
          </div>
        </header>

        {loading && <div className="p-10 text-center animate-pulse">Searching inventory...</div>}
        {error && <div className="p-10 text-center text-red-500">Error: {error}</div>}

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
                    <th className="px-6 py-4 font-semibold">Specifications</th>
                    <th className="px-6 py-4 font-semibold">Stock Availability</th>
                    <th className="px-6 py-4 font-semibold text-center">Store Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item) => {
                    // 3. Find the store name using the store_id from the item
                    const storeMatch = availableStores.find(
                      (s) => s.store_id.toString() === item.store_id.toString()
                    );

                    return (
                      <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.item_image}
                              alt={item.item_name}
                              className="h-20 w-16 object-cover rounded shadow-sm cursor-pointer hover:scale-105"
                              onClick={()=>{setPreviewImage(item.item_image)}}
                            />
                            <img
                              src={item.item_video}
                              alt={item.item_video}
                              onClick={()=>{setPreviewImage(item.item_video)}}
                              className="h-20 w-16 object-cover rounded shadow-sm cursor-pointer hover:scale-105"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{item.brand}</span>
                              <h3 className="text-md font-bold text-gray-800">{item.item_name}</h3>
                              <p className="text-xs text-gray-400">ID: #{item._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-600">
                          <div><span className="text-gray-400">Color:</span> {item.color}</div>
                          <div><span className="text-gray-400">Fit:</span> {item.fit}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="bg-gray-50 rounded p-2 text-xs">
                            {item.size_data.map((sz, i) => (
                              <div key={i} className="flex justify-between border-b last:border-0 py-1">
                                <span className="font-bold">{sz.size}</span>
                                <span className={sz.quantity > 0 ? 'text-green-600' : 'text-red-500'}>{sz.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        {/* 4. Display Store Name instead of just ID */}
                        <td className="px-6 py-6 text-center">
                          <div className="font-bold text-gray-900 uppercase text-sm">
                            {storeMatch ? storeMatch.store_name : `Store #${item.store_id}`}
                          </div>
                          <div className="text-lg text-gray-700 font-mono font-semibold">
                            Store ID: {item.store_id}
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