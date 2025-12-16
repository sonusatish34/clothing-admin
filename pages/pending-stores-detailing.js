import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaCloudUploadAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { CgCloseO } from "react-icons/cg";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Loading from '../components/Loader'
const ComponentName = () => {

  const [status, setStatus] = useState(1);
  const [assignDoc, setAssignDoc] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showGstImage, setShowGstImage] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [resp, setResp] = useState(null)
  const router = useRouter();

  const uploadImg = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingKey(key);

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const res = await fetch("https://api.zuget.com/s3/image-file", {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: localStorage.getItem(`${localStorage.getItem('user_phone')}_token`)
        },
        body: formdata
      });

      const result = await res.json();
      const imageUrl = result?.data?.image_link;

      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
      myHeaders.append("Content-Type", "application/json");
      await fetch("https://api.zuget.com/admin/replace-image", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          store_id: assignDoc?.data?.results?._id,
          key,
          url: imageUrl
        })
      });

      fetchAssignStore();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingKey(null);
    }
  };
  console.log(assignDoc, "assignDoc");

  const fetchAssignStore = async () => {
    const response = await fetch("https://api.zuget.com/admin/assign-store", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem(`${localStorage.getItem('user_phone')}_token`)
      },
      body: JSON.stringify({ app_user_id: localStorage.getItem('app_user_id'), role_id: localStorage.getItem('user_role_id') })
    });

    const data = await response.json();
    setResp(data)
    setAssignDoc(data);
  };


  const updateStoreStatus = async (newStatus) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("Authorization", localStorage.getItem(`${localStorage.getItem('user_phone')}_token`));
      myHeaders.append("Content-Type", "application/json");
      await fetch("https://api.zuget.com/admin/update-store-status", {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify({
          id: assignDoc?.data?.assigned_id,
          store_id: assignDoc?.data?.results?._id,
          status: newStatus,
          reject_reason: rejectReason
        })
      });

      Swal.fire(
        newStatus === "approved" ? "Approved!" : "Rejected!",
        `The store has been ${newStatus}.`,
        "success"
      );
      fetchAssignStore();
      setShowReject(false);
      setRejectReason("");
    } catch (err) {
      console.error("Status update failed", err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  useEffect(() => {
    fetchAssignStore();
  }, []);
  const [sliderRef, slider] = useKeenSlider({
    loop: false,
    slides: {
      perView: 1.8, // default (mobile)
      spacing: 3,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 4.2, // tablet
          spacing: 5,
        }
      }
    }

  })

  return (
    <Layout>
      {assignDoc?.data?.assigned_id && <div>
        {showGstImage && (
          <div className="fixed inset-0 z-10 bg-white bg-opacity-50 flex items-center justify-center">
            <button
              onClick={() => setShowGstImage(false)}
              className="absolute top-5 right-5 text-black text-2xl font-bold cursor-pointer lg:hover:scale-105"
            >
              <CgCloseO color="red" size={40} />
            </button>
            <Image
              width={1000}
              height={1000}
              className="object-contain w-full h-full py-4"
              src={assignDoc?.data?.results?.gst_certificate}
              alt="GST"
            />
          </div>
        )}

        {
          <div>
            <p className="lg:text-xl text-sm flex gap-x-3 items-center mb-4">
              <IoArrowBackSharp onClick={() => router.back()} className="size-6 lg:size-8 cursor-pointer" />
              <span className="text-[#6B757C]">Pending Stores &gt;</span>
              <span className="font-bold capitalize">{assignDoc?.data.results?.name_as_per_gst}</span>
            </p>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative w-full lg:max-w-[500px]">
                <Image
                  src={assignDoc?.data?.results?.store_image || "/placeholder.png"}
                  alt="store_image"
                  width={500}
                  height={300}
                  className="rounded-lg w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover"
                />
                {/* <p className="py-2">store_image</p> */}
                {uploadingKey === "store_image" && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-lg">
                    Uploading...
                  </div>
                )}
                <label
                  htmlFor="upload-store_image"
                  className="absolute bottom-4 right-4 text-sm rounded cursor-pointer bg-black/40 text-white border justify-center shadow-md flex items-center p-1"
                >
                  <FaCloudUploadAlt size={30} />
                </label>
                <input
                  type="file"
                  id="upload-store_image"
                  className="hidden"
                  onChange={(e) => uploadImg(e, "store_image")}
                />
              </div>

              <div className="w-full flex flex-col gap-y-3">
                <ul className="p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-1.5">
                  <li className="text-xl md:text-2xl font-semibold">Store Details</li>
                  <li className="text-[#6B767B] text-sm">Store Id: {assignDoc?.data.results?._id}</li>
                  <li className="text-sm">{assignDoc?.data.results?.address}</li>
                </ul>
                <ul className="p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-2">
                  <li className="text-xl md:text-2xl font-semibold">GST Details</li>
                  <li className="text-sm">Number: {assignDoc?.data.results?.gst_number}</li>
                  <li className="text-sm capitalize">Name As Per GST: {assignDoc?.data.results?.name_as_per_gst}</li>
                  <li>
                    <button
                      onClick={() => {
                        setShowGstImage(true);
                      }}
                      className="bg-[#F5F5F5] rounded-md p-2 text-sm md:text-lg flex justify-between w-full items-center pr-4 md:pr-10"
                    >
                      <span>View GST Image</span> <IoIosArrowForward />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Top 4 Images */}
            <div ref={sliderRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 keen-slider">
              {["store_top_image_1", "store_top_image_2", "store_top_image_3", "store_top_image_4"].map((key) => (
                <div key={key} className="relative w-full keen-slider__slide">
                  <Image
                    src={assignDoc?.data?.results?.[key] || "/placeholder.png"}
                    alt={key}
                    width={500}
                    height={300}
                    className="rounded-lg w-full h-[200px] sm:h-[250px] object-cover"
                  />
                  {uploadingKey === key && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-lg">
                      Uploading...
                    </div>
                  )}
                  {/* <p className="py-2">{key}</p> */}
                  <label
                    htmlFor={`upload-${key}`}
                    className="absolute bottom-4 right-4 text-sm rounded cursor-pointer bg-black/20 text-white border justify-center shadow-md flex items-center p-1"
                  >
                    <FaCloudUploadAlt size={20} />
                  </label>
                  <input
                    type="file"
                    id={`upload-${key}`}
                    className="hidden"
                    onChange={(e) => uploadImg(e, key)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                onClick={() => setShowReject(true)}
                className="p-3 w-full sm:w-1/2 border-2 rounded-lg hover:bg-red-500 hover:text-white"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You are about to approve this store.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, approve it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      updateStoreStatus("approved");
                    }
                  });
                }}
                className="p-3 w-full sm:w-1/2 bg-[#793FDF] text-white rounded-lg"
              >
                Approve
              </button>
            </div>

            {/* Reject Modal */}
            {showReject && (
              <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-700/80">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4">Reject Reason</h2>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    rows={4}
                    placeholder="Enter reject reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowReject(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!rejectReason.trim()) {
                          Swal.fire("Missing Reason", "Please enter a reject reason.", "warning");
                          return;
                        }
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This will reject the store.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, reject it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            updateStoreStatus("rejected");
                          }
                        });
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        }

      </div>}
      {
        !assignDoc?.data?.assigned_id &&
        <p className="">
          {assignDoc?.message}
        </p>
      }
    </Layout>
  );
};

export default ComponentName;
