import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaCloudUploadAlt } from "react-icons/fa";

const ComponentName = () => {
  const [status, setStatus] = useState(1);
  const [showGst, setShowGst] = useState(false);
  const [assignDoc, setAssignDoc] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showGstImage, setShowGstImage] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const router = useRouter();

  const uploadImg = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingKey(key);

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const res = await fetch("https://ecommstagingapis.tboo.com/s3/image-file", {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg"
        },
        body: formdata
      });

      const result = await res.json();
      const imageUrl = result?.data?.image_link;

      await fetch("https://ecommstagingapis.tboo.com/admin/replace-image", {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          store_id: assignDoc?.results?._id,
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

  const fetchAssignStore = async () => {
    const response = await fetch("https://ecommstagingapis.tboo.com/admin/assign-store", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ app_user_id: 27, role_id: 5 })
    });

    const data = await response.json();
    setAssignDoc(data?.data);
  };

  useEffect(() => {
    fetchAssignStore();
  }, [status]);

  useEffect(() => {
    if (status === "approved" || status === "rejected") {
      const UpdateStore = async () => {
        await fetch("https://ecommstagingapis.tboo.com/admin/update-store-status", {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTE4MjQ1MDc3MCJ9.RjEl6Sl5oNBj-_lW7-gKHqS5PcBU6TVYHwaPFPdmsTg",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: assignDoc?.assigned_id,
            store_id: assignDoc?.results?._id,
            status,
            reject_reason: rejectReason
          })
        });
      };
      UpdateStore();
    }
  }, [status]);

  return (
    <Layout>
      {showGstImage && (
        <div className="absolute top-10 z-50 bg-gray-100 p-10">
          <button onClick={() => setShowGstImage(false)}>X</button>
          <Image
            width={500}
            height={500}
            className="h-[600px] object-contain z-auto"
            src={assignDoc?.results?.store_image}
            alt="GST"
          />
        </div>
      )}

      {assignDoc?.assigned_id ? (
        <div>
          <p className="lg:text-xl text-sm flex gap-x-3 items-center mb-4">
            <IoArrowBackSharp onClick={() => router.back()} className="size-6 lg:size-8 cursor-pointer" />
            <span className="text-[#6B757C]">Pending Stores &gt;</span>
            <span className="font-bold capitalize">{assignDoc.results?.name_as_per_gst}</span>
          </p>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative w-full lg:max-w-[500px]">
              <Image
                src={assignDoc?.results?.store_image || "/placeholder.png"}
                alt="store_image"
                width={500}
                height={300}
                className="rounded-lg w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover"
              />
              {uploadingKey === "store_image" && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-lg">
                  Uploading...
                </div>
              )}
              <label
                htmlFor="upload-store_image"
                className="absolute bottom-4 right-4 text-sm rounded cursor-pointer text-white border justify-center shadow-md flex items-center p-1"
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
                <li className="text-[#6B767B] text-sm">Store Id: {assignDoc.results?._id}</li>
                <li className="text-sm">{assignDoc.results?.address}</li>
              </ul>
              <ul className="p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-2">
                <li className="text-xl md:text-2xl font-semibold">GST Details</li>
                <li className="text-sm">Number: {assignDoc.results?.gst_number}</li>
                <li className="text-sm">Name As Per GST: {assignDoc.results?.name_as_per_gst}</li>
                <li>
                  <button
                    onClick={() => {
                      setShowGstImage(true);
                      setShowGst(true);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {["store_top_image_1", "store_top_image_2", "store_top_image_3", "store_top_image_4"].map((key) => (
              <div key={key} className="relative w-full">
                <Image
                  src={assignDoc?.results?.[key] || "/placeholder.png"}
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
                <label
                  htmlFor={`upload-${key}`}
                  className="absolute bottom-4 right-4 text-sm rounded cursor-pointer text-white border justify-center shadow-md flex items-center p-1"
                >
                  <FaCloudUploadAlt size={30} />
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

          {/* Approve/Reject Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <button
              onClick={() => setShowReject(true)}
              className="p-3 w-full sm:w-1/2 border-2 rounded-lg hover:bg-red-500 hover:text-white"
            >
              Reject
            </button>
            <button
              onClick={() => setStatus("approved")}
              className="p-3 w-full sm:w-1/2 bg-[#793FDF] text-white rounded-lg"
            >
              Approve
            </button>
          </div>

          {/* Reject Modal */}
          {showReject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-70">
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
                    onClick={() => setStatus("rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No documents to assign</p>
      )}
    </Layout>
  );
};

export default ComponentName;
