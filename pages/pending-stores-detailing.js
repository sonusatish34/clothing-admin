import React, { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import Image from "next/image";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/router";
import { useState } from "react";
import { ImCross } from "react-icons/im";
const ComponentName = (props) => {
  const [status, setStatus] = useState(1);
  const [showGst, setShowGst] = useState(false);
  const router = useRouter();
  // const { data: assignDoc, isLoading, error } = useQuery({
  //     queryKey: ['assign-store'],
  //     queryFn: fetchAssignStore,
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error loading store data</p>;
  const [assignDoc, setAssignDoc] = useState("");
  useEffect(() => {
    const fetchAssignStore = async () => {
      const user_phone = localStorage.getItem("user_phone");
      const token = localStorage.getItem(user_phone + "_token");
      const response = await fetch(
        `https://ecommstagingapis.tboo.com/admin/assign-store`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            app_user_id: 19,
            role_id: 5,
          }),
        }
      );

      const data = await response.json();
      setAssignDoc(data?.data);
    };
    fetchAssignStore();
    // console.log(localStorage.getItem("user_phone" + _token),'localStorage.getItem("user_phone" + _token)');
  }, [status]);
  console.log(assignDoc, "00");

  useEffect(() => {
    const UpdateStore = async () => {
      const user_phone = localStorage.getItem("user_phone");
      const token = localStorage.getItem(user_phone + "_token");
      const response = await fetch(
        `https://ecommstagingapis.tboo.com/admin/update-store-status`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: assignDoc?.assigned_id,
            store_id: assignDoc?.results?._id,
            status: status,
            reject_reason: "",
          }),
        }
      );
    };
    if (status == "approved" || status == "rejected") {
      UpdateStore();
    }
    const user_phone = localStorage.getItem("user_phone");
    const token = localStorage.getItem(user_phone + "_token");
    console.log(token, "token");
  }, [status]);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  return (
    <Layout>
      {assignDoc?.assigned_id ? (
        <div className="">
          {/* <PendingStores /> */}
          <p className="lg:text-xl text-xs flex gap-x-3 items-center">
            <span className="cursor-pointer">
              <IoArrowBackSharp
                onClick={() => {
                  router.back();
                }}
                className="size-6 lg:size-8"
              />
            </span>
            <span className="text-[#6B757C]">Pending Stores</span>
            <span className="text-[#6B757C]">{" > "}</span>
            <span className="font-bold ">
              KLM Shopping Mall, Medipally
            </span>{" "}
          </p>
          <div className="flex flex-col gap-y-5 pt-8">
            {showGst && (
              <div className="fixed top-0 w-full h-full left-0  bg-black bg-opacity-0 flex justify-center items-center z-50">
                <Image
                  src={
                    "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp"
                  }
                  alt="line"
                  width={500}
                  height={300}
                  className="rounded-lg w-fit h-fit "
                />
                <div
                  className="absolute top-5 right-5 cursor-pointer"
                  onClick={() => {
                    setShowGst(false);
                  }}
                >
                  <IoArrowBackSharp className="size-6 lg:size-8 text-white" />
                </div>
              </div>
            )}
            <div className="flex gap-x-6">
              <Image
                src={
                  "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp"
                }
                alt="line"
                width={500}
                height={300}
                className="rounded-lg  object-cover w-1/2 h-[400px] "
              />
              <div className="w-full flex flex-col gap-y-3">
                <ul className="p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-1.5">
                  <li className="text-2xl font-semibold">Store Details</li>
                  <li className="text-[#6B767B]">
                    {console.log(assignDoc.message,"assignDoc")
                    }
                    Store Id : {assignDoc.results?._id}
                  </li>
                  <li className="w-56">{assignDoc.results?.address}</li>
                </ul>
                <ul className="p-4 border-2 border-gray-100 rounded-lg flex flex-col gap-y-2">
                  <li className="text-2xl font-semibold">GST Details</li>
                  <li className="">Number : {assignDoc.results?.gst_number}</li>
                  <li className="">
                    Name As Per Gst : {assignDoc.results?.name_as_per_gst}
                  </li>
                  <li className="">
                    <button
                      onClick={() => {
                        setShowGst(true);
                      }}
                      className="bg-[#F5F5F5] rounded-md p-2 text-xl flex justify-between w-full items-center pr-10"
                    >
                      <span>View GST Image</span> <IoIosArrowForward />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex gap-x-2">
              <Image
                src={
                  "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp"
                }
                alt="line"
                width={500}
                height={300}
                className="rounded-lg  object-cover w-1/4 h-[250px] "
              />
              <Image
                src={
                  "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp"
                }
                alt="line"
                width={500}
                height={300}
                className="rounded-lg  object-cover w-1/4 h-[250px]  "
              />
              <Image
                src={
                  "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp"
                }
                alt="line"
                width={500}
                height={300}
                className="rounded-lg  object-cover w-1/4 h-[250px]  "
              />
              <Image
                src={
                  "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp"
                }
                alt="line"
                width={500}
                height={300}
                className="rounded-lg  object-cover w-1/4 h-[250px]  "
              />
            </div>
            <div className="flex gap-x-2">
              <button
                onClick={() => {
                  setShowReject(true);
                  console.log();
                }}
                className="cursor-pointer p-3 py-5 rounded-lg border-2 border-gray-100 w-full hover:bg-red-500 hover:text-white"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setStatus("approved");
                }}
                className="hover:underline cursor-pointer p-3 py-5 rounded-lg border-2 border-gray-100 w-full bg-[#793FDF] text-white"
              >
                Approve
                
              </button>
              

              <div class="content">
                <h3>stuff goes in here!</h3>
              </div>
            </div>
            {/* {showReject && (
              <div className="fixed  top-50 w-[400px] h-[200px] left-60 rounded-md p-  bg-gray-200 text-black bg-opacity-0 z-50">
                <div className="flex flex-col gap-y-3 p-4">
                    <p className="flex cursor-pointer justify-end"><ImCross onClick={()=>{setShowReject(false)}}/></p>
                  <p>Reject Reason</p>
                  <textarea
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                    }}
                    className="bg-white rounded-md"
                    type=""
                    value={rejectReason}
                  />
                  {console.log(rejectReason, "rejectReason")}

                  <button
                    onClick={() => {
                      setStatus("rejected");
                    }}
                    className="w-full p-2 bg-blue-400 rounded-md cursor-pointer"
                  >
                    submit
                  </button>
                </div>
              </div>
            )} */}
            {showReject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray- bg-opacity-90 backdrop-blur-sm">
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
                      onClick={() => {
                        setShowReject(false);
                      }}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setStatus("rejected");
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
        </div>
      ) : (
        <div>
          <p>No documents to assign</p>
          {/* <div class="loading">Loading&#8230;</div> */}
        </div>
      )}
    </Layout>
  );
};

export default ComponentName;
