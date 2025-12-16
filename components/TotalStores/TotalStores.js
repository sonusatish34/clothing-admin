import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchAssignStore } from '@/services/api';
import { FaRegCopy } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';
const TotalStores = () => {

    // const { data: assignDoc, isLoading, error } = useQuery({
    //   queryKey: ['assign-store'],
    //   queryFn: fetchAssignStore,
    // });

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Error loading store data</p>;
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState('in_progress');
    const [role, setRole] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [count, setCount] = React.useState(1);
    useEffect(() => {
    }, [])
    // console.log(role,"olee");

    useEffect(() => {
        localStorage.getItem('user_role_id') == '5' ? setRole('approval') : setRole('admin')

        async function fetchStoresByStatus() {
            const response = await fetch(`https://api.zuget.com/admin/stores?status=${status}`, {

                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setLoading(false)
            setData(data?.data?.results);
            // console.log(data.data?.results, "testing");
        }
        if (status || count) {
            fetchStoresByStatus()
        }

    }, [status, count])
    const deleteStore = async (storeid) => {
        const confirmDelete = await Swal.fire({
            title: `Delete  store ${storeid}?`,
            text: `Are you sure you want to delete this store ${storeid} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes  delete store :  ${storeid}`,
            cancelButtonText: 'Cancel',
        });


        if (confirmDelete.isConfirmed) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("accept", "application/json");
                myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
                myHeaders.append("Content-Type", "application/json");

                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                    redirect: "follow"
                };

                const res = await fetch(`https://api.zuget.com/admin/delete-store?store_id=8`, requestOptions);
                if (res.ok) {
                    Swal.fire('Deleted!', 'Bank updated successfully.', 'success');
                    setCount(prev => prev + 1)
                } else {
                    Swal.fire('Error', 'Failed to update bank details.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', error?.message || 'Something went wrong', 'error');
            }
        }
    };


    const StoreCard = ({ store }) => (
        <div className='pt-6'>
            <div>
                <ul className='flex relative flex-col gap-y-2 border-2 border-[#F5F5F5] rounded-lg'>
                    <li>
                        <Image
                            src={store?.store_image?.includes('ldcars') ? store.store_image : 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp'}
                            alt="line"
                            width={500}
                            height={300}
                            className='rounded-t-lg object-cover w-full h-[400px]'
                        />
                    </li>
                    <li className='pl-4 uppercase'> {store?.name_as_per_gst}</li>
                    <li className='pl-4 flex items-center gap-2'>
                        Contact: {store?.owner_number}
                        <button
                            onClick={() => {
                                if (store?.owner_number) {
                                    navigator.clipboard.writeText(store.owner_number);
                                    // alert('Number copied!');
                                }
                            }}
                            className='cursor-pointer ml-2 px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded'
                        >
                            <FaRegCopy size={20} />
                        </button>
                    </li>

                    <li className='pl-4'>Location : {store?.area_name}</li>
                    <li className='pl-4'>Store Id: {store?._id}</li>
                    <li className='pl-4 pb-4'>Submitted At {store?.created_on?.slice(0, 10)}</li>
                    <li className='absolute bottom-2 right-10 '><button onClick={() => { deleteStore(8) }}><MdDeleteForever className='cursor-pointer lg:hover:scale-105' color='red' size={40} /></button></li>
                </ul>
            </div>
        </div>
    );

    return (
        <div>
            <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
                <li className={` cursor-pointer ${status === 'in_progress' ? 'text-[#793FDF]' : ''}`}><p onClick={() => { setStatus('in_progress') }} href={'/'}>Pending Stores</p></li>
                <li className={` cursor-pointer ${status === 'rejected' ? 'text-[#793FDF]' : ''}`}><p onClick={() => { setStatus('rejected') }} href={'/'}>Rejected Stores</p></li>
                <li className={` cursor-pointer ${status === 'approved' ? 'text-[#793FDF]' : ''}`}><p onClick={() => { setStatus('approved') }} href={'/'}>Approved Stores</p></li>
            </ul>
            <div className='grid grid-cols-2 gap-7'>
                {role == 'admin' &&
                    data?.length >= 1 ? data?.map((item, index) => (
                        <div key={index} className=''>
                            <StoreCard store={item} />
                        </div>
                    )) : <p className='mt-4 ml-2'>No {status} stores</p>
                }
            </div>
        </div>
    );
};

export default TotalStores;
