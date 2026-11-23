"use client";
import Layout from "@/components/Layout/Layout";
import React, { useState, useEffect } from "react";
import { FaSpinner, FaSync } from "react-icons/fa";

export default function MerchantEnquiriesTable() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnquiries = async () => {
    setLoading(true);
    setError("");

    // Retrieve token dynamically from localStorage if available, or fall back to the provided token
    const savedPhone = localStorage.getItem("user_phone");
    const savedToken = savedPhone ? localStorage.getItem(`${savedPhone}_token`) : null;
    const token = savedToken || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4";

    try {
      const response = await fetch("https://api.zuget.com/admin/merchant-enquiries", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setEnquiries(data?.data?.merchant_enquiries || []);
      } else {
        setError(data?.message || "Failed to fetch merchant enquiries.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <>
      <Layout>
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Merchant Enquiries</h1>
              <p className="text-sm text-slate-500">Manage and view recent merchant requests</p>
            </div>
            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="flex items-center gap-x-2 bg-[#793FDF] hover:bg-[#612ec4] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-y-3 text-slate-500">
                <FaSpinner className="animate-spin text-2xl text-[#793FDF]" />
                <span className="text-sm font-medium">Loading enquiries...</span>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                No merchant enquiries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">sno</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      {/* <th className="px-6 py-4">Status</th> */}
                      <th className="px-6 py-4">Created On</th>
                      {/* <th className="px-6 py-4">Updated On</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries.map((item, ind) => (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{ind + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {item.name ? item.name : <span className="text-slate-400 font-normal">N/A</span>}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.email || "N/A"}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {item.user_phone ? item.user_phone : <span className="text-slate-400">N/A</span>}
                        </td>
                        {/* <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td> */}
                        <td className="px-6 py-4 text-xs text-slate-500">{item.created_on}</td>
                        {/* <td className="px-6 py-4 text-xs text-slate-500">
                      {item.updated_on ? item.updated_on : <span className="text-slate-400">N/A</span>}
                    </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>

  );
}