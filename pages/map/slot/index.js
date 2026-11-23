"use client";

import Layout from '@/components/Layout/Layout';
import React, { useState, useEffect } from 'react';

// Static 2-hour operational slot blocks
const TIME_SLOTS = [
  "10 AM - 12 PM",
  "12 PM - 2 PM",
  "2 PM - 4 PM",
  "4 PM - 6 PM",
  "6 PM - 8 PM",
  "8 PM - 10 PM"
];

// Baseline pricing matrix layout structure with empty values by default
const INITIAL_EMPTY_PRICING = [
  { min_km: 0, max_km: 5, price: 0 },
  { min_km: 5, max_km: 10, price: 0 },
  { min_km: 10, max_km: 15, price: 0 },
  { min_km: 15, max_km: 20, price: 0 },
  { min_km: 20, max_km: 25, price: 0 },
  { min_km: 25, max_km: 30, price: 0 },
];

const ZoneSlotForm = () => {
  const [activeZone, setActiveZone] = useState('red');

  // Transformed single target date state into Start and End date states
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [userId, setUserId] = useState(0);
  const [loadingRowIndex, setLoadingRowIndex] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Initialize individual rows with 0 default values until the API finishes loading
  const [slotsData, setSlotsData] = useState(
    TIME_SLOTS.map(time => ({
      slot_timing: time,
      slot_price: JSON.parse(JSON.stringify(INITIAL_EMPTY_PRICING)),
      min_gaurantee_amount: 0,
      no_of_people: 0,
      price_per_km: 0
    }))
  );

  // Safely capture localStorage window values
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedUserId = localStorage.getItem('app_user_id');
      if (storedUserId) {
        setUserId(Number(storedUserId));
      }
    }
  }, []);
  const [allSLots, setAllSlots] = useState([])
  // Fetch data live from the slots API using both dynamic date fields
  const fetchExistingSlots = async () => {
    if (!startDate || !endDate) return;
    setIsFetchingData(true);

    try {
      const phoneKey = localStorage.getItem('user_phone');
      const token = String(localStorage.getItem(`${phoneKey}_token`));

      const response = await fetch(
        `https://api.zuget.com/admin/slots?search_start_date=${startDate}&search_end_date=${endDate}&zone_type=${activeZone}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': token,
          }
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result && result.status === "success" && Array.isArray(result.data)) {
          setAllSlots(result.data)
          setSlotsData(TIME_SLOTS.map(time => {
            const normalizedTime = time.replace(/\s+/g, '').toLowerCase();

            const match = result.data.find((item) => {
              const apiTime = (item.slot_details?.slot_timing || '').replace(/\s+/g, '').toLowerCase();
              return apiTime === normalizedTime;
            });

            // If found in API response, render custom values, else leave as empty fields
            if (match && match.slot_details) {
              const details = match.slot_details;
              return {
                slot_timing: time,
                slot_price: Array.isArray(details.slot_price) && details.slot_price.length > 0
                  ? details.slot_price.map((sp) => ({
                    min_km: Number(sp.min_km || 0),
                    max_km: Number(sp.max_km || 0),
                    price: Number(sp.price || 0)
                  }))
                  : JSON.parse(JSON.stringify(INITIAL_EMPTY_PRICING)),
                min_gaurantee_amount: Number(details.min_gaurantee_amount || 0),
                no_of_people: Number(details.no_of_people || 0),
                price_per_km: Number(details.price_per_km || 0),
              };
            }

            return {
              slot_timing: time,
              slot_price: JSON.parse(JSON.stringify(INITIAL_EMPTY_PRICING)),
              min_gaurantee_amount: 0,
              no_of_people: 0,
              price_per_km: 0
              ,
            };
          }));
        }
      }
    } catch (error) {
      console.error("Error running slot data retrieval synchronization:", error);
    } finally {
      setIsFetchingData(false);
    }
  };
  console.log(allSLots, 'alllllllllll');


  // Re-run whenever active zone, start date, or end date switches
  useEffect(() => {
    fetchExistingSlots();
  }, [activeZone, startDate, endDate]);

  const handlePriceChange = (slotIndex, priceIndex, value) => {
    setSlotsData(prev => prev.map((slotData, sIdx) => {
      if (sIdx !== slotIndex) return slotData;

      const updatedPriceArray = slotData.slot_price.map((priceObj, pIdx) => {
        if (pIdx === priceIndex) {
          return { ...priceObj, price: Number(value) };
        }
        return priceObj;
      });

      return { ...slotData, slot_price: updatedPriceArray };
    }));
  };

  const handleMetaFieldChange = (slotIndex, field, value) => {
    setSlotsData(prev => prev.map((slotData, sIdx) => {
      if (sIdx !== slotIndex) return slotData;
      return { ...slotData, [field]: Number(value) };
    }));
  };

  const handleRowSubmit = async (slotIndex) => {
    const targetedSlot = slotsData[slotIndex];
    setLoadingRowIndex(slotIndex);

    const payload = {
      app_user_id: userId,
      slot_start_date: startDate, // Submits with start date selection baseline
      slot_end_date: endDate,
      slot_timing: targetedSlot.slot_timing,
      zone_type: activeZone,
      slot_price: targetedSlot.slot_price,
      min_gaurantee_amount: targetedSlot.min_gaurantee_amount,
      no_of_people: targetedSlot.no_of_people,
      price_per_km: targetedSlot.price_per_km,
    };

    try {
      const phoneKey = localStorage.getItem('user_phone');
      const token = String(localStorage.getItem(`${phoneKey}_token`));

      const response = await fetch('https://api.zuget.com/admin/add-zone-slots', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Slot configurations for [${targetedSlot.slot_timing}] updated successfully!`);
        fetchExistingSlots();
      } else {
        alert(`Failed to add slot configurations for ${targetedSlot.slot_timing}`);
      }
    } catch (error) {
      console.error("Submission Error targeting row:", error);
    } finally {
      setLoadingRowIndex(null);
    }
  };

  return (
    <Layout>
      <div className="py-8 bg-[#fafafa] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto flex flex-col gap-y-6">

          {/* Component Header & Date Range Selection Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Zone Prices</h1>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Start Date */}
              <div className="flex items-center gap-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-3xs min-w-[200px]">
                <label htmlFor="startDate" className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">From:</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="outline-none text-sm font-semibold text-gray-700 bg-transparent cursor-pointer w-full"
                />
              </div>

              {/* End Date */}
              <div className="flex items-center gap-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-3xs min-w-[200px]">
                <label htmlFor="endDate" className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">To:</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  min={startDate} // Prevents setting an end date earlier than start date
                  onChange={(e) => setEndDate(e.target.value)}
                  className="outline-none text-sm font-semibold text-gray-700 bg-transparent cursor-pointer w-full"
                />
              </div>
            </div>
          </div>

          {/* Global Nav Type Selection Bar */}
          <div className="flex flex-wrap gap-3 mb-2">
            <button
              type="button"
              onClick={() => setActiveZone('red')}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${activeZone === 'red'
                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Red Type Zones
            </button>
            <button
              type="button"
              onClick={() => setActiveZone('orange')}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${activeZone === 'orange'
                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Orange Type Zones
            </button>
            <button
              type="button"
              onClick={() => setActiveZone('violet')}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${activeZone === 'violet'
                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              Violet Type Zones
            </button>
          </div>
          <p className='flex gap-x-3 flex-wrap'>
            {allSLots.map((item, ind) => (
              <span onClick={() => { setEndDate(item.slot_details.slot_date); setStartDate(item.slot_details.slot_date) }} key={ind} className='rounded-full bg-purple-100 text-black px-3 py-2'>{item.slot_details.slot_date}</span>
            ))}
          </p>

          {/* Independent Cards Feed Container */}
          <div className={`flex flex-col gap-y-6 transition-opacity ${isFetchingData ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            {slotsData.map((row, slotIdx) => (
              <div
                key={slotIdx}
                className="bg-white rounded-2xl shadow-xs border border-gray-100 p-8 flex flex-col gap-y-6 transition-all hover:shadow-md/5"
              >
                <h3 className="text-md font-bold text-gray-700 flex items-center">
                  {row.slot_timing} <span className="text-gray-400 font-normal ml-1">Slot</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
                  {row.slot_price.map((slot, priceIdx) => (
                    <div key={priceIdx} className="flex flex-col space-y-2">
                      <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                        Price Upto {slot.max_km}km <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 text-xs font-medium">₹</span>
                        <input
                          type="text"
                          value={slot.price || ''}
                          placeholder="0"
                          onChange={(e) => handlePriceChange(slotIdx, priceIdx, e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-gray-50/70 rounded-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none transition-all text-sm font-medium text-gray-700 focus:bg-white"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="flex items-center justify-center border border-dashed border-gray-300 bg-gray-50/40 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all h-9 text-xs font-medium px-4 w-full"
                  >
                    <span className="text-md mr-1.5 font-bold">+</span> Add more
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
                  <div className="flex flex-wrap gap-x-6 gap-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-semibold text-gray-500">
                        Minimum Guarantee <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-36">
                        <span className="absolute left-3 top-2.5 text-gray-500 text-xs font-medium">₹</span>
                        <input
                          type="text"
                          value={row.min_gaurantee_amount || ''}
                          placeholder="0"
                          onChange={(e) => handleMetaFieldChange(slotIdx, 'min_gaurantee_amount', e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-gray-50/70 rounded-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none text-sm font-medium text-gray-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-semibold text-gray-500">
                        No . Of People <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-36">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs">👥</span>
                        <input
                          type="text"
                          value={row.no_of_people || ''}
                          placeholder="0"
                          onChange={(e) => handleMetaFieldChange(slotIdx, 'no_of_people', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50/70 rounded-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none text-sm font-medium text-gray-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-semibold text-gray-500">
                        price_per_km <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-36">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs">👥</span>
                        <input
                          type="text"
                          value={row.price_per_km || ''}
                          placeholder="0"
                          onChange={(e) => handleMetaFieldChange(slotIdx, 'price_per_km', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50/70 rounded-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none text-sm font-medium text-gray-700 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={loadingRowIndex === slotIdx}
                    onClick={() => handleRowSubmit(slotIdx)}
                    className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#a78bfa] text-white font-medium text-sm py-2.5 px-10 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                  >
                    {loadingRowIndex === slotIdx ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ZoneSlotForm;