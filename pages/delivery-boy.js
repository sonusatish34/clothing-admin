import Layout from '@/components/Layout/Layout';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // SweetAlert2 for popups
import Image from 'next/image';
import Loading from '../components/Loader'
export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [PendingData, setPendingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("assign_profile"); // To toggle between Approval Pending, Approved, and Pending tabs
  const [count, setCount] = useState(0);
  // Fetch the profile data on page load

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "app_user_id": localStorage.getItem('app_user_id'),
          "role_id": localStorage.getItem('user_role_id')
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        const response = await fetch("https://ecommstagingapi.tboo.com/admin/assign-profile", requestOptions);
        const result = await response.json();
        setProfileData(result);
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [count]);
  useEffect(() => {
    const fetchPendingProfile = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        const response = await fetch(`https://ecommstagingapi.tboo.com/admin/${tab}-profiles`, requestOptions);
        const result = await response.json();
        setPendingData(result);
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };
    if(tab =='pending' || tab == 'approved')
    {
      fetchPendingProfile();
    }
  }, [tab]);


  const handleApproveReject = async (docType, status) => {
    if (status === 'rejected') {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: 'Please provide a rejection reason:',
        input: 'textarea',
        inputPlaceholder: 'Enter the rejection reason...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      });

      if (!isConfirmed || !reason) return; // Don't proceed if canceled or no reason


      const updateData = {
        id: profileData?.data?.assigned_id,
        docs_app_user_id: profileData?.data?.results?.app_user_id,
        [docType]: status,
        [`${docType?.replaceAll('_status', '')}_reject_reason`]: reason, // Set rejection reason
      };

      try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append(
          "Authorization",
          localStorage.getItem(`${localStorage.getItem('user_phone')}_token`)
        );
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(updateData);

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch(
          "https://ecommstagingapi.tboo.com/admin/update-profile-details",
          requestOptions
        );
        const result = await response.json();

        if (result.status === "success") {
          Swal.fire("Rejected!", "The document has been rejected successfully.", "error");
        } else {
          Swal.fire("Error!", "Failed to reject the document.", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "An error occurred while updating the status.", "error");
      } finally {
        setCount(count + 1); // Increment count to trigger re-render
      }
    } else {
      // Confirm approval
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to approve this document?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "Cancel",
      });

      if (!confirmResult.isConfirmed) return; // Exit if user cancels

      const updateData = {
        id: profileData?.data?.assigned_id,
        docs_app_user_id: profileData?.data?.results?.app_user_id,
        [docType]: status,
      };

      try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append(
          "Authorization",
          localStorage.getItem(`${localStorage.getItem('user_phone')}_token`)
        );
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(updateData);

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch(
          "https://ecommstagingapi.tboo.com/admin/update-profile-details",
          requestOptions
        );
        const result = await response.json();

        if (result.status === "success") {
          Swal.fire("Approved!", "The document has been approved successfully.", "success");
        } else {
          Swal.fire("Error!", "Failed to approve the document.", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "An error occurred while updating the status.", "error");
      } finally {
        setCount(count + 1); // Increment count to trigger re-render
      }
    }
  };


  // Display loading or error message
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <Layout>
      <div className="flex space-x-8 mb-6 border-b-2 pb-4">
        <button
          onClick={() => setTab("assign_profile")}
          className={`lg:text-xl text-sm font-medium ${tab === "assign_profile" ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
        >
          Approval Pending
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`lg:text-xl text-sm font-medium ${tab === "approved" ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`lg:text-xl text-sm font-medium ${tab === "pending" ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-600'}`}
        >
          Pending
        </button>
      </div>
      {profileData?.data?.assigned_id && tab === "assign_profile" &&
        <div className="container mx-auto p-6">


          <div className="mb-6">
            <div className="text-lg font-semibold">User Number: {profileData?.data?.results?.app_user_id}</div>
            {/* <div className="text-lg font-semibold">Order Id: 845</div> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg border ${profileData?.data?.results?.profile_photo_url_status === "approved" ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className="font-semibold mb-2 capitalize">Customer Profile: {profileData?.data?.results?.profile_photo_url_status}</div>
              <Image width={1000} height={1000} src={profileData?.data?.results?.profile_photo_url} alt="Profile" className="w-full h-48 object-cover rounded-lg mb-4" />
              <div className="flex flex-col gap-y-3">
                <button
                  onClick={() => handleApproveReject('profile_status', 'rejected')}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveReject('profile_status', 'approved')}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Approve
                </button>

              </div>
            </div>

            {/* Aadhaar */}
            <div className={`p-4 rounded-lg border ${profileData?.data?.results?.aadhar_front_image_url_status === 'approved' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className="font-semibold mb-2 capitalize">Aadhaar : {profileData?.data?.results?.aadhar_front_image_url_status}</div>
              <ul className='flex flex-col gap-y-2 py-2'>
                <li>
                  <Image width={1000} height={1000} src={profileData?.data?.results?.aadhar_front_image_url} alt="Aadhaar Front" className="w-full h-48 object-contain mb-4" />
                </li>
                <li>Name : <span className='font-bold'>{profileData?.data?.results?.aadhar_api_returned_name}</span></li>
                <li>Aadhar Number : <span className='font-bold'>{profileData?.data?.results?.aadhar_number}</span> </li>
                <li>DOB : <span className='font-bold'> {profileData?.data?.results?.aadhar_api_returned_dob}</span></li>
                {/* <li>Gender :</li> */}
                <li>Location : {profileData?.data?.results?.aadhar_response_address}</li>
              </ul>

              <div className="flex flex-col gap-y-3">
                <button
                  onClick={() => handleApproveReject('aadhar_status', 'rejected')}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveReject('aadhar_status', 'approved')}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Approve
                </button>

              </div>
            </div>
            {/* License */}
            <div className={`p-4 rounded-lg border ${profileData?.data?.results?.licence_front_image_url_status === 'approved' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className="font-semibold mb-2 capitalize">License : {profileData?.data?.results?.licence_front_image_url_status}</div>
              <ul className='flex flex-col gap-y-2 py-2'>
                <li>
                  <Image width={1000} height={1000} src={profileData?.data?.results?.licence_image_url} alt="Licence Front" className="w-full h-48 object-cover rounded-lg mb-4" />
                </li>
                <li>Name : <span className='font-bold'>{profileData?.data?.results?.dl_api_returned_name}</span></li>
                <li>Name : <span className='font-bold'>{profileData?.data?.results?.dl_api_returnede}</span></li>
                <li>Licence Number : <span className='font-bold'>{profileData?.data?.results?.licence_number}</span> </li>
                <li>Location : {profileData?.data?.results?.aadhar_response_address}</li>
              </ul>
              <div className="flex flex-col gap-y-3">
                <button
                  onClick={() => handleApproveReject('license_status', 'rejected')}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Rejected
                </button>
                <button
                  onClick={() => handleApproveReject('license_status', 'approved')}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Approved
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {
        !profileData?.data?.assigned_id && tab == 'pending' &&
        <p className="">
          {profileData?.message}
        </p>
      }
      {
        tab === "approved" &&
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4'>{PendingData?.data?.results?.map((item, index) => (
          // <span>{item?.aadhar_api_returned_name}</span>
          <div key={index} className='flex gap-x-3 bg-[#F5F5F5] rounded-l-xl rounded-bl-xl'>
            <Image src={item?.profile_photo_url} width={500} height={500} className='lg:h-[250px] h-[150px] lg:w-[200px] w-[100px] object-cover rounded-xl' />
            <ul className='flex flex-col gap-y-2 p-3'>
              <li className='flex flex-col'>
                <span>{item?.profile_name}</span>
                <span className='font-light text-[#6B767B] text-xs'>Delivery Boy Name</span>
              </li>
              <li className='flex flex-col'>
                <span>{item?.app_users?.user_phone}</span>
                <span className='font-light text-[#6B767B] text-xs'>Customer Number</span>
              </li>
              <li className='flex flex-col'>
                <span>{item?.licence_number || 'NA'}</span>
                <span className='font-light text-[#6B767B] text-xs'>Licence Number</span>
              </li>
            </ul>
          </div>
        ))}</div>
      }
      {
        tab === "pending" &&
        <div className='flex flex-wrap gap-5 pt-4'>{PendingData?.data?.results?.map((item, index) => (
          // <span>{item?.aadhar_api_returned_name}</span>
          <div key={index} className='flex gap-x-3 bg-[#F5F5F5] rounded-l-xl rounded-bl-xl'>
            <Image src={item?.profile_photo_url} width={500} height={500} className='h-[250px] w-[200px] object-cover rounded-xl' />
            <ul className='flex flex-col gap-y-2 p-3'>
              <li className='flex flex-col'>
                <span>{item?.profile_name}</span>
                <span className='font-light text-[#6B767B] text-xs'>Delivery Boy Name</span>
              </li>
              <li className='flex flex-col'>
                <span>{item?.app_users?.user_phone}</span>
x                <span className='font-light text-[#6B767B] text-xs'>Customer Number</span>
              </li>
              <li className='flex flex-col'>
                <span>{item?.licence_number || 'NA'}</span>
                <span className='font-light text-[#6B767B] text-xs'>Licence Number</span>
              </li>
            </ul>
          </div>
        ))}</div>
      }
    </Layout>

  );
}
// pages / profile.js


