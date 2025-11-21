'use client';

import Layout from '@/components/Layout/Layout';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Swal from 'sweetalert2';

export default function AddStoreAdmin() {
    const [ownerName, setOwnerName] = useState('');
    const [ownerNumber, setOwnerNumber] = useState('');
    const [storeName, setStoreName] = useState('');
    const [approvedStores, setApprovedStores] = useState([]);
    const [selectedStoreIds, setSelectedStoreIds] = useState([]);
    const [message, setMessage] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [showExisting, setShowExisting] = useState(false);
    const [token, setToken] = useState('')

    const getApprovedStores = async () => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const res = await fetch("https://ecommstagingapi.longdrivecarz.in/admin/approved-stores", requestOptions);
            const result = await res.json();
            setApprovedStores(result?.data?.results);
        } catch (error) {
            console.error(error);
        }
    };

    const getStores = async () => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const res = await fetch("https://ecommstagingapi.longdrivecarz.in/admin/get-store-admins", requestOptions);
            const result = await res.json();
            setAdminList(result?.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setToken(localStorage.getItem(`${localStorage.getItem('user_phone')}_token`))
        if (token) {
            getApprovedStores();
            getStores();
        }
    }, [token]);

    const handleToggleStore = (id) => {
        setSelectedStoreIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!ownerName || !ownerNumber || selectedStoreIds.length === 0) {
            Swal.fire('Missing Info', 'Please fill all fields and select at least one store.', 'warning');
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Add Store Admin?',
            html: `<strong>${ownerName}</strong><br/>Number: <strong>${ownerNumber}</strong>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add',
            cancelButtonText: 'Cancel',
        });

        if (confirmResult.isConfirmed) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("accept", "application/json");
                myHeaders.append("Authorization", token);
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                    user_phone: ownerNumber,
                    name: ownerName,
                    store_ids: selectedStoreIds
                });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                const res = await fetch("https://ecommstagingapi.longdrivecarz.in/admin/add-store-admin", requestOptions);
                const result = await res.json();

                if (res.ok) {
                    Swal.fire('Success', 'Store admin added successfully!', 'success');
                    setOwnerName('');
                    setOwnerNumber('');
                    setStoreName('');
                    setSelectedStoreIds([]);
                    getStores();
                    getApprovedStores();
                } else {
                    Swal.fire('Error', result?.message || 'Something went wrong', 'error');
                }
            } catch (error) {
                Swal.fire('Error', error?.message || 'Something went wrong', 'error');
            }
        }
    };

    const handleDeleteAdmin = async (id, name) => {
        const confirmDelete = await Swal.fire({
            title: `Delete Admin?`,
            text: `Are you sure you want to delete ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("accept", "application/json");
                myHeaders.append("Authorization", token);

                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                    redirect: "follow"
                };

                const res = await fetch(`https://ecommstagingapi.longdrivecarz.in/admin/delete-store-admin?app_user_id=${id}`, requestOptions);
                if (res.ok) {
                    Swal.fire('Deleted!', 'Store admin removed successfully.', 'success');
                    getStores();
                } else {
                    Swal.fire('Error', 'Failed to delete store admin.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', error?.message || 'Something went wrong', 'error');
            }
        }
    };

    return (
        <Layout>
            <div className="p-6 pb-4">
                <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
                    <li onClick={() => setShowExisting(false)} className={`${!showExisting ? "text-[#793FDF]" : ""} cursor-pointer`}>
                        <p>Add Store Admin</p>
                    </li>
                    <li onClick={() => setShowExisting(true)} className={`${showExisting ? "text-[#793FDF]" : ""} cursor-pointer`}>
                        <p>Existing Admin</p>
                    </li>
                </ul>

                {!showExisting && (
                    <div>
                        <div className="flex gap-6 pt-6">
                            <div className="w-1/2 space-y-4 bg-white p-4 rounded shadow">
                                <input
                                    type="text"
                                    placeholder="Enter Owner Name"
                                    className="w-full outline-none border border-[#F5F5F5] px-4 py-2 rounded"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Owner Number"
                                    className="w-full outline-none border border-[#F5F5F5] px-4 py-2 rounded"
                                    maxLength={10}
                                    value={ownerNumber}
                                    onChange={(e) => setOwnerNumber(e.target.value)}
                                />
                            </div>

                            <div className="w-1/2 space-y-4 bg-white p-4 rounded shadow">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Store Name"
                                        className="flex-1 border border-[#F5F5F5] outline-none px-4 py-2 rounded"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                    />
                                    <button className="px-4 py-2 rounded bg-purple-500 text-white">Add</button>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium">Assign Stores</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {approvedStores.map((store) => (
                                            <label key={store._id} className="flex text-sm pt-1 capitalize items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStoreIds.includes(store._id)}
                                                    onChange={() => handleToggleStore(store._id)}
                                                />
                                                {store.store_name}, {store.area_name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded w-full"
                                onClick={handleSubmit}
                            >
                                Add
                            </button>
                            {message && <p className="mt-2 text-center text-sm text-gray-700">{message}</p>}
                        </div>
                    </div>
                )}
                {/* {console.log(adminList, "adminList")} */}
                {showExisting && (
                    <div className="grid grid-cols-2 gap-9 pt-8">
                        {adminList.map((item) => (
                            <div key={item._id} className="border border-[#F5F5F5] shadow rounded p-4 w-full flex justify-between gap-x-3">
                                <div className="flex flex-col gap-y-2">
                                    <p className="lg:text-xl font-bold capitalize">Name : {item?.name}</p>
                                    <p className="lg:text-xl">Number : {item?.user_phone}</p>
                                    <ul>
                                        <li>Assigned Stores :</li>
                                        {item?.store_details?.map((itm, i) => (
                                            <li key={i} className='capitalize'>{itm?.store_name}, {itm?.area_name}</li>
                                        ))}

                                    </ul>
                                    <button className="flex items-center gap-x-1">View All <IoIosArrowForward /></button>
                                </div>
                                <div className="flex flex-col items-end justify-between text-left">
                                    <p
                                        onClick={() => handleDeleteAdmin(item._id, item.name)}
                                        className="lg:text-xl font-bold h-12 w-12 bg-[#DA36471A] rounded-full flex items-center justify-center cursor-pointer lg:hover:scale-105"
                                    >
                                        <RiDeleteBin5Fill size={30} color="#DA3647" />
                                    </p>
                                    <ul>
                                        <li>Assigned By :</li>
                                        <li className="font-light">{item?.assigned_by_name}</li>
                                        <li className="font-light">{item?.assigned_by_phone}</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
