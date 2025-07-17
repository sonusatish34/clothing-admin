"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { RxHamburgerMenu } from "react-icons/rx";
import { GrClose } from "react-icons/gr";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/router";
const Layout = ({ Content, children }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [hideHamb, setHideHamb] = useState(false);
  const handleSubMenuClick = (label) => {
    setActiveSubMenu(activeSubMenu === label ? null : label);
  };
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const sidebarRef = useRef(null);

  // Close sidebar on outside click
  useEffect(() => {
    localStorage.getItem("user_role_id") === "5"
      ? setRole("approval")
      : setRole("admin");
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-y-0">
      <div className="flex h-full lg:pl-4 px-4 pt-8 pb-5">
        {/* desktop side bar */}
        <p className="fixed top-1 w-fit  lg:left-16 right-4 capitalize border text-sm lg:text-lg p-1 py-[1px] rounded-md">{role}</p>

        <nav className="h-screen pb-10 text-2xl  lg:flex hidden flex-col gap-2 items-start w-48  rounded-t-xl rounded-b-xl fixed top-10">
          <div className="h-full w-full overflow-hidden">
            <div className="h-20 bg-black w-full rounded-lg">
              <Link href={"/"}>
                <Image
                  src={
                    "https://st3.depositphotos.com/9223672/17315/v/1600/depositphotos_173155438-stock-illustration-dress-suit-icons-isolated-white.jpg"
                  }
                  alt="line"
                  width={500}
                  height={300}
                  className="rounded-t-lg w-full h-full object-cover"
                />
              </Link>
            </div>
            <ul className="px-2 text-sm pt-6 flex flex-col gap-1">
              <li className=" py-1">
                <Link
                  href={"/dashboard"}
                  className={` py-2 px-3 ${
                    router.asPath === "/dashboard"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Dashboard</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>

              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/orders"}
                  className={` py-2 px-3 ${
                    router.asPath === "/orders"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Orders</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              {role === "approval" && (
                <li className=" py-1 border-t-2 border-t-gray-50">
                  <Link
                    href={"/pending-stores-detailing"}
                    className={` py-2 px-3 ${
                      (router.asPath.includes('pending-stores'))
                        ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                        : ""
                    }  h-9 rounded-lg p-1 hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                  >
                    <span>Pending Stores</span>
                    <span>
                      <IoIosArrowForward />
                    </span>
                  </Link>
                </li>
              )}
              {role == "admin" && (
                <li className=" py-1 border-t-2 border-t-gray-50">
                  <Link
                    href={"/total-stores"}
                    className={` py-2 px-3 ${
                      router.asPath === "/total-stores"
                        ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                        : ""
                    }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                  >
                    <span>Total Stores</span>
                    <span>
                      <IoIosArrowForward />
                    </span>
                  </Link>
                </li>
              )}
              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/dashboard"}
                  className={` py-2 px-3 ${
                    router.asPath === "/das2hboard"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Delivery Boys</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/store-admin"}
                  className={` py-2 px-3 ${
                    router.asPath === "/store-admin"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Store Admin</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/dashboard"}
                  className={` py-2 px-3 ${
                    router.asPath === "/das2hboard"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>System Configs</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/dashboard"}
                  className={` py-2 px-3 ${
                    router.asPath === "/das2hboard"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Store Bank Details</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/dashboard"}
                  className={` py-2 px-3 ${
                    router.asPath === "/das2hboard"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Ads Manager</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              <li className=" py-1 border-t-2 border-t-gray-50">
                <Link
                  href={"/dashboard"}
                  className={` py-2 px-3 ${
                    router.asPath === "/das2hboard"
                      ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                      : ""
                  }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Customer Details</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>
              <li
                onClick={() => {
                  localStorage.clear();
                  router.push("/");
                }}
                className=" px-1 mt-6"
              >
                <p
                  className={`bg-red-500 text-white py-2 px-3 rounded-lg p-1  cursor-pointer flex items-center justify-between w-full`}
                >
                  <span>Logout</span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </nav>
        <main className="flex-1 overflow-auto lg:px-10">
          <div className="lg:block hidden z-50 bg-white pt-10 fixed left-56 top-0">
            <div className="flex justify-between xl:w-[1236px] lg:w-[764px]  items-center bg- border-2 border-[#F5F5F5] p-2 rounded-xl ">
              <div className="flex items-center gap-2 text-black">
                <FiSearch className="font-light absolute left-4 size-6" />
                <input
                  type="text"
                  className="bg-gray-100 outline-none rounded-lg xl:w-96 lg:w-64 h-10 pl-12 lg:block hidden"
                  placeholder="Search..."
                />
                <button className="bg-[#793FDF] h-10 px-4 rounded-lg text-white cursor-pointer w-28 lg:block hidden">
                  Search
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 pr-5 text-white">
                <select className="rounded-lg h-10 bg-[#793FDF] p-2 w-32 outline-none">
                  <option value="option1">All Cities</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                  <option value="option4">Option 4</option>
                  <option value="option5">Option 5</option>
                </select>
                <FaUserCircle className="text-gray-500" size={30} />
              </div>
            </div>
          </div>
          <div className="lg:hidden z-30 bg-white w-full flex flex-col gap-y-3">
            <div className="flex justify-between items-center w-full j gap-2 text-black">
              <div className="flex items-center gap-5 text-black">
                <RxHamburgerMenu onClick={() => setIsOpen(!isOpen)} size={30} />
                <div className="text-white">
                  <select className="rounded-lg h-10 bg-[#793FDF] p-2 w-32 outline-none">
                    <option value="option1">All Cities</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                    <option value="option5">Option 5</option>
                  </select>
                </div>
              </div>
              <div>
                <FaUserCircle className="text-gray-500" size={30} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-black w-full py-5">
              <FiSearch className="font-light absolute left-6 size-6" />
              <input
                type="text"
                className="bg-gray-100 rounded-xl w-full py-3 pl-12 outline-none"
                placeholder="Search..."
              />
            </div>
            <div>
              <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-40 transform transition-transform duration-300 ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className=" text-black absolute top-5 right-5"
                >
                  <GrClose size={20} />
                </button>
                <div className="lg:p-6 flex flex-col h-full space-y-6">
                  <ul className="px-2 text-sm  pt-12 flex flex-col gap-1">
                    <li className=" py-1">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/dashboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Dashboard</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/orders"}
                        className={` py-2 px-3 ${
                          router.asPath === "/orders"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Orders</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    {
                      <li className=" py-1 border-t-2 border-t-gray-50">
                        <Link
                          href={"/pending-stores-detailing"}
                          className={` py-2 px-3 ${
                            router.asPath === "/das2hboard"
                              ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                              : ""
                          }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                        >
                          <span>Pending Stores</span>
                          <span>
                            <IoIosArrowForward />
                          </span>
                        </Link>
                      </li>
                    }
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Total Stores</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Delivery Boys</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Add Store Admin</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>System Configs</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Store Bank Details</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Ads Manager</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" py-1 border-t-2 border-t-gray-50">
                      <Link
                        href={"/dashboard"}
                        className={` py-2 font-bod px-3 ${
                          router.asPath === "/das2hboard"
                            ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold"
                            : ""
                        }  h-9 rounded-lg p-1  hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full`}
                      >
                        <span>Customer Details</span>
                        <span>
                          <IoIosArrowForward />
                        </span>
                      </Link>
                    </li>
                    <li className=" px-1 mt-6">
                      <button
                        onClick={() => {
                          localStorage.clear();
                          router.push("/");
                        }}
                        className="text-left text-white  pl-3 py-2 rounded-lg bg-[#DA3647] w-full"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                  <div className="flex-grow" />
                  <button
                    onClick={() => {
                      localStorage.clear();
                      router.push("/");
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:mt-28 lg:ml-[170px]">{Content || children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
