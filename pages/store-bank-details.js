"use client";
import Layout from "@/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

import Swal from 'sweetalert2';
import Image from "next/image";
import Loader from "@/components/Loader";

const BankDetailsForm = () => {

    const [bankData, setBankData] = useState(null);
    const [editableData, setEditableData] = useState({});
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [count, setCount] = useState(1);
    const [imageurlUpdated, setImageUrlUpdated] = useState("");

    const uploadImg = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        // setUploadingKey(key);

        const formdata = new FormData();
        formdata.append("file", file);

        try {
            const res = await fetch("https://ecommstagingapi.longdrivecarz.in/s3/image-file", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    Authorization: localStorage.getItem(`${localStorage.getItem('user_phone')}_token`),
                },
                body: formdata
            });

            const result = await res.json();
            const imageUrl = result?.data?.image_link;
            setImageUrlUpdated(imageUrl)

        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            // setUploadingKey(null);
        }
    };

    useEffect(() => {
        const fetchBankDetails = async () => {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({ app_user_id: 27, role_id: 5 });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            try {
                const response = await fetch("https://ecommstagingapi.longdrivecarz.in/admin/assign-bank-details", requestOptions);
                const result = await response.json();
                const data = result?.data;
                setBankData(data);
                setEditableData(data?.results);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchBankDetails();
    }, [count]);
    // console.log(editableData, "ed");


    const handleInputChange = (field, value) => {
        setEditableData({ ...editableData, [field]: value });
    };
    // console.log(imageurlUpdated, "imageurlUpdated");

    const handleSave = async () => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));

        const raw = JSON.stringify({
            bank_id: editableData._id,
            bank_name: editableData.bank_name,
            bank_account_name: editableData.bank_account_name,
            bank_account_number: editableData.bank_account_number,
            bank_ifsc_code: editableData.bank_ifsc_code,
            cancelled_check_url: imageurlUpdated || "string",
        });


        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        try {
            setLoading(true);
            const response = await fetch("https://ecommstagingapi.longdrivecarz.in/admin/update-bank-data", requestOptions);
            const result = await response.json();
            setCount(count + 1)
            alert("Bank details saved!");
            setEditMode(false); // Exit edit mode after save
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!bankData) {
        return <Loader />;
    }

    const handleUpdateBankStatus = async (status) => {
        const confirmUpdate = await Swal.fire({
            title: `Update Bank?`,
            text: `Are you sure you want to ${status}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes ${status}`,
            cancelButtonText: 'Cancel',
        });
        const jsondata = JSON.stringify({
            id: bankData?.assigned_id,
            bank_id: bankData?.results?._id,
            status: status
        });

        if (confirmUpdate.isConfirmed) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("accept", "application/json");
                myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
                myHeaders.append("Content-Type", "application/json");

                const requestOptions = {
                    method: "PUT",
                    headers: myHeaders,
                    body: jsondata,
                    redirect: "follow"
                };

                const res = await fetch(`https://ecommstagingapi.longdrivecarz.in/admin/update-bank-details`, requestOptions);
                if (res.ok) {
                    Swal.fire('Deleted!', 'Bank updated successfully.', 'success');
                } else {
                    Swal.fire('Error', 'Failed to update bank details.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', error?.message || 'Something went wrong', 'error');
            }
        }
    };

    return (
        <Layout>

            {bankData?.results ? <div className=" font-sans relative">
                <div className="flex justify-between p-5 items-start border-2 border-[#F5F5F5] rounded-t-2xl overflow-hidden">
                    <div className="flex gap-4 text-lg font-medium">
                        <span className="text-purple-600 font-bold">Pending</span>
                        <span>Approved</span>
                    </div>

                    <button
                        onClick={() => setEditMode(true)}
                        className="text-gray-600 hover:text-purple-600 text-xl cursor-pointer"
                        title="Edit"
                    >
                        <FaRegEdit size={30} />
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                    <div className="border border-gray-200 p-2 rounded-lg">
                        <label className="text-sm text-gray-500">Store Name</label>
                        <div className="text-base">{bankData?.results?.store_name}</div>
                    </div>

                    <div className="border border-gray-200 p-2 rounded-lg">
                        <label className="text-sm text-gray-500">Holder Name As Per Bank</label>
                        {editMode ? (
                            <input
                                className="w-full border px-2 py-1 rounded"
                                value={editableData.bank_account_name}
                                onChange={(e) => handleInputChange("bank_account_name", e.target.value)}
                            />
                        ) : (
                            <div>{bankData?.results?.bank_account_name}</div>
                        )}
                    </div>

                    <div className="border border-gray-200 p-2 rounded-lg">
                        <label className="text-sm text-gray-500">Bank Name</label>
                        {editMode ? (
                            <input
                                className="w-full border px-2 py-1 rounded"
                                value={editableData.bank_name}
                                onChange={(e) => handleInputChange("bank_name", e.target.value)}
                            />
                        ) : (
                            <div>{bankData?.results?.bank_name}</div>
                        )}
                    </div>

                    <div className="border border-gray-200 p-2 rounded-lg">
                        <label className="text-sm text-gray-500">Account IFSC Code</label>
                        {editMode ? (
                            <input
                                className="w-full border px-2 py-1 rounded"
                                value={editableData.bank_ifsc_code}
                                onChange={(e) => handleInputChange("bank_ifsc_code", e.target.value)}
                            />
                        ) : (
                            <div>{bankData?.results?.bank_ifsc_code}</div>
                        )}
                    </div>

                    <div className="border border-gray-200 p-2 rounded-lg">
                        <label className="text-sm text-gray-500">Account Number</label>
                        {editMode ? (
                            <input
                                className="w-full border px-2 py-1 rounded"
                                value={editableData.bank_account_number}
                                onChange={(e) => handleInputChange("bank_account_number", e.target.value)}
                            />
                        ) : (
                            <div>{bankData?.results?.bank_account_number}</div>
                        )}
                    </div>

                    <div className="border border-gray-200 p-2 rounded-lg">
                        <label className="text-sm text-gray-500">Bank Registered Mobile Number</label>
                        <div className="text-base">7879878787</div>
                    </div>
                </div>

                {/* Cheque */}
                <div className="text-lg font-semibold mb-2">Cheque / Passbook</div>
                <div className="border rounded-lg overflow-hidden mb-6">
                    <Image
                        width={1000}
                        height={1000}
                        src={(bankData?.results?.cancelled_check_url) == 'string' ? "/logo.png" : bankData?.results?.cancelled_check_url}
                        alt="Cheque"
                        className="w-full object-cover h-80"
                    />
                    <p>
                        {editMode && <label htmlFor="upload-store_image" className="cursor-pointer text-blue-600 hover:underline">
                            <FaPen className="inline mr-1" /> Change Image
                        </label>}
                        <input
                            type="file"
                            id="upload-store_image"
                            className="hidden"
                            onChange={(e) => uploadImg(e)}
                        />
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-4">
                    <button
                        onClick={() => handleUpdateBankStatus("rejected")}
                        className="w-full py-2 border rounded-md text-purple-600 hover:bg-purple-50"
                    >
                        Reject
                    </button>

                    {editMode && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    )}

                    <button
                        onClick={() => handleUpdateBankStatus("approved")}
                        className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        Approve
                    </button>
                </div>
            </div> : "No bank details to assign!"}
        </Layout>

    );
};

export default BankDetailsForm;
