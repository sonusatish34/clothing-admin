"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { GrClose } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { FaUserCircle, FaUserCheck } from "react-icons/fa";
import { useRouter } from "next/router";
import { GrUserAdmin } from "react-icons/gr";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

const Layout = ({ Content, children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const sidebarRef = useRef(null);
  const [openZones, setOpenZones] = useState(false);

  const allowedPathsForApproval = useMemo(
    () => ["/pending-stores-detailing", "/delivery-boy", "/store-bank-details"],
    []
  );

  // Authentication check
  useEffect(() => {
    if (!router.isReady) return;
    const usermobile = window.localStorage.getItem("user_phone");
    const usertoken = usermobile
      ? window.localStorage.getItem(`${usermobile}_token`)
      : null;

    if (!usermobile || !usertoken) {
      router.push("/");
    }
  }, [router.isReady, router]);

  // Set user role
  useEffect(() => {
    const roleId = localStorage.getItem("user_role_id");
    setRole(roleId === "5" ? "approval" : "admin");
  }, []);

  // Enforce role-based routing permissions
  useEffect(() => {
    if (!role || !router.isReady) return;
    try {
      const path = router.asPath ? router.asPath.split("?")[0].split("#")[0] : "/";
      if (role === "approval") {
        const allowedMatch = allowedPathsForApproval.some((p) => path.startsWith(p));
        if (!allowedMatch) {
          router.push("/pending-stores-detailing");
        }
      }
    } catch (err) {
      // router may be undefined briefly; ignore
    }
  }, [role, router.asPath, router.isReady, allowedPathsForApproval, router]);

  // Handle outside sidebar clicks to close drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const showLink = (path) => {
    if (!role) return false;
    if (role === "admin") return true;
    if (role === "approval") return allowedPathsForApproval.includes(path);
    return false;
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const getLinkClass = (path) => {
    const isActive = router.asPath === path || (path !== "/dashboard" && router.asPath.includes(path));
    return `py-2 px-3 h-9 rounded-lg p-1 hover:shadow-[0_0_10px_#493D9E4D] hover:text-[#793FDF] hover:font-bold cursor-pointer flex items-center justify-between w-full transition-all ${isActive ? "text-[#793FDF] shadow-[0_0_10px_#493D9E4D] font-bold" : ""
      }`;
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/9782010.jpg')", backgroundSize: '25%', backgroundRepeat: 'repeat' }}
      ></div>

      <div className="flex h-full lg:pl-4 px-4 pt-8 pb-5 relative text-black bg-white/90">

        {/* Desktop Sidebar */}
        <nav className="h-screen pb-10 text-2xl lg:flex hidden flex-col gap-2 items-start w-48 rounded-t-xl rounded-b-xl fixed top-10">
          <div className="h-full w-full overflow-y-auto overflow-x-hidden pt-2 pr-1">
            <div className="text-center bg-[#793FDF] text-white hover:scale-95 rounded-full py-2">
              <Link href="/">Zuget</Link>
            </div>
            <ul className="px-2 text-sm lg:pt-2 flex flex-col gap-1 z-50">
              {showLink('/dashboard') && (
                <li className="py-1">
                  <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                    <span>Dashboard</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}

              {showLink('/orders') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/orders" className={getLinkClass("orders")}>
                    <span>Orders</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}

              {showLink('/pending-stores-detailing') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/pending-stores-detailing" className={getLinkClass("pending-stores")}>
                    <span>Pending Stores</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/total-stores') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/total-stores" className={getLinkClass("/total-stores")}>
                    <span>Total Stores</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/delivery-boy') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/delivery-boy" className={getLinkClass("/delivery-boy")}>
                    <span>Delivery Boys</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/store-admin') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/store-admin" className={getLinkClass("/store-admin")}>
                    <span>Store Admin</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/system-configs') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/system-configs" className={getLinkClass("/system-configs")}>
                    <span>System Configs</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/discounts') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/discounts" className={getLinkClass("/discounts")}>
                    <span>Discounts</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/store-bank-details') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/store-bank-details" className={getLinkClass("store-bank-details")}>
                    <span>Store Bank Details</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/dashboard') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <Link href="/dashboard" className={getLinkClass("/das2hboard")}>
                    <span>Ads Manager</span>
                    <IoIosArrowForward />
                  </Link>
                </li>
              )}
              {showLink('/map') && (
                <li className="py-1 border-t-2 border-t-gray-50">
                  <button
                    onClick={() => setOpenZones(!openZones)}
                    className={`${getLinkClass("/map")} w-full flex justify-between items-center`}
                  >
                    <span>Zones Map</span>
                    {openZones ? <IoIosArrowDown /> : <IoIosArrowForward />}
                  </button>

                  {openZones && (
                    <ul className="ml-5 mt-2">
                      <li className="py-1">
                        <Link href="/map/slot" className={getLinkClass("/map")}>
                          Map
                        </Link>
                      </li>

                      <li className="py-1">
                        <Link href="/map/all-zones" className={getLinkClass("/zones")}>
                          Zones
                        </Link>
                      </li>

                      <li className="py-1">
                        <Link href="/map/slot" className={getLinkClass("/slots")}>
                          Slots
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              <li onClick={handleLogout} className="px-1 mt-6">
                <p className="bg-red-500 text-white py-2 px-3 rounded-lg p-1 cursor-pointer flex items-center justify-between w-full">
                  <span>Logout</span>
                  <IoIosArrowForward />
                </p>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Workspace Frame */}
        <main className="flex-1 overflow-auto lg:px-10">
          {/* Desktop Top Header Bar */}
          <div className="lg:block hidden z-10 bg-white pt-10 fixed left-56 top-0">
            <div className="flex justify-between xl:w-[1236px] lg:w-[764px] items-center border-2 border-[#F5F5F5] p-2 rounded-xl">
              <div className="flex items-center gap-2 text-black relative">
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
                <p className="border-black bg-gray-200 rounded-full p-2 flex justify-center items-center">
                  {role === 'admin' ? <GrUserAdmin className="text-gray-900" size={20} /> : <FaUserCheck className="text-gray-900" size={20} />}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Top Header Navigation */}
          <div className="lg:hidden z-10 bg-white w-full flex flex-col gap-y-3">
            <div className="flex justify-between items-center w-full gap-2 text-black">
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
            <div className="flex items-center gap-2 text-black w-full py-5 relative">
              <FiSearch className="font-light absolute left-6 size-6" />
              <input
                type="text"
                className="bg-gray-100 rounded-xl w-full py-3 pl-12 outline-none"
                placeholder="Search..."
              />
            </div>

            {/* Mobile Drawer Slide-out Sidebar */}
            <div>
              <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-10 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
              >
                <button onClick={() => setIsOpen(false)} className="text-black absolute top-5 right-5">
                  <GrClose size={20} />
                </button>
                <div className="lg:p-6 flex flex-col h-full space-y-6 overflow-y-auto">
                  <ul className="px-2 text-sm pt-12 flex flex-col gap-1">
                    {showLink('/dashboard') && (
                      <li className="py-1">
                        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                          <span>Dashboard</span>
                          <IoIosArrowForward />
                        </Link>
                      </li>
                    )}
                    {showLink('/orders') && (
                      <li className="py-1 border-t-2 border-t-gray-50">
                        <Link href="/orders" className={getLinkClass("/orders")}>
                          <span>Orders</span>
                          <IoIosArrowForward />
                        </Link>
                      </li>
                    )}
                    {showLink('/pending-stores-detailing') && (
                      <li className="py-1 border-t-2 border-t-gray-50">
                        <Link href="/pending-stores-detailing" className={getLinkClass("/das2hboard")}>
                          <span>Pending Stores</span>
                          <IoIosArrowForward />
                        </Link>
                      </li>
                    )}
                    {showLink('/total-stores') && (
                      <li className="py-1 border-t-2 border-t-gray-50">
                        <Link href="/total-stores" className={getLinkClass("/das2hboard")}>
                          <span>Total Stores</span>
                          <IoIosArrowForward />
                        </Link>
                      </li>
                    )}
                    {showLink('/delivery-boy') && (
                      <li className="py-1 border-t-2 border-t-gray-50">
                        <Link href="/delivery-boy" className={getLinkClass("/delivery-boy")}>
                          <span>Delivery Boys</span>
                          <IoIosArrowForward />
                        </Link>
                      </li>
                    )}
                    <li className="py-1 border-t-2 border-t-gray-50">
                      <Link href="/dashboard" className={getLinkClass("/das2hboard")}>
                        <span>Add Store Admin</span>
                        <IoIosArrowForward />
                      </Link>
                    </li>
                    <li className="py-1 border-t-2 border-t-gray-50">
                      <Link href="/dashboard" className={getLinkClass("/das2hboard")}>
                        <span>System Configs</span>
                        <IoIosArrowForward />
                      </Link>
                    </li>
                    <li className="py-1 border-t-2 border-t-gray-50">
                      <Link href="/store-bank-details" className={getLinkClass("/das2hboard")}>
                        <span>Store Bank Details</span>
                        <IoIosArrowForward />
                      </Link>
                    </li>
                    <li className="py-1 border-t-2 border-t-gray-50">
                      <Link href="/dashboard" className={getLinkClass("/das2hboard")}>
                        <span>Ads Manager</span>
                        <IoIosArrowForward />
                      </Link>
                    </li>
                    <li className="py-1 border-t-2 border-t-gray-50">
                      <Link href="/dashboard" className={getLinkClass("/das2hboard")}>
                        <span>Customer Details</span>
                        <IoIosArrowForward />
                      </Link>
                    </li>
                    <li className="px-1 mt-6">
                      <button onClick={handleLogout} className="text-left text-white exhibitors pl-3 py-2 rounded-lg bg-[#DA3647] w-full">
                        Logout
                      </button>
                    </li>
                  </ul>
                  <div className="flex-grow" />
                </div>
              </div>
            </div>
          </div>

          {/* Children and Render Layer Content */}
          <div className="lg:mt-28 lg:ml-[170px]">{Content || children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;