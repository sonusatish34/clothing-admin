import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from 'react';
const Layout = ({ Content, children }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleSubMenuClick = (label) => {
    if (activeSubMenu === label) {
      setActiveSubMenu(null); 
    } else {
      setActiveSubMenu(label); 
    }
  };
  return (
    <div className='flex flex-col gap-y-'>
      <div className="flex h-full pl-4 pt-5  bg-[#EEF3FE] pb-5">
        <nav className='h-full text-2xl hidden lg:flex flex-col gap-2 items-start transition-all duration-300 ease-in-out w-52 bg-white rounded-t-xl rounded-b-xl '>
          <div className='h-20 bg-black w-full rounded-t-2xl'></div>
          <Sidebar width='210px' className='text-sm pt-5 text-black'>
            <Menu>
              <MenuItem>
                <p className='flex items-center justify-between'>
                  <span>Dashboard</span>
                  <span><IoIosArrowForward /></span>
                  <p></p>
                </p>
              </MenuItem>

              <SubMenu
                label="Orders"
                isOpen={activeSubMenu === "Orders"}
                onClick={() => handleSubMenuClick("Orders")}
              >
                <MenuItem>Confirmed</MenuItem>
                <MenuItem>In Delivery</MenuItem>
                <MenuItem>Confirmed</MenuItem>
                <MenuItem>In Progress</MenuItem>
                <MenuItem>Completed</MenuItem>
                <MenuItem>Cancelled</MenuItem>
              </SubMenu>

              <SubMenu
                label="Pending Stores"
                isOpen={activeSubMenu === "Pending Stores"}
                onClick={() => handleSubMenuClick("Pending Stores")}
              >
                <MenuItem>Pie charts</MenuItem>
                <MenuItem>Line charts</MenuItem>
              </SubMenu>

              <SubMenu
                label="Delivery Boys"
                isOpen={activeSubMenu === "Delivery Boys"}
                onClick={() => handleSubMenuClick("Delivery Boys")}
              >
                <MenuItem>Pie charts</MenuItem>
                <MenuItem>Line charts</MenuItem>
              </SubMenu>

              <SubMenu
                label="Add Store Admin"
                isOpen={activeSubMenu === "Add Store Admin"}
                onClick={() => handleSubMenuClick("Add Store Admin")}
              >
                <MenuItem>Pie charts</MenuItem>
                <MenuItem>Line charts</MenuItem>
              </SubMenu>

              <SubMenu
                label="System Configs"
                isOpen={activeSubMenu === "System Configs"}
                onClick={() => handleSubMenuClick("System Configs")}
              >
                <MenuItem>Pie charts</MenuItem>
                <MenuItem>Line charts</MenuItem>
              </SubMenu>

              <SubMenu
                label="Store Bank Details"
                isOpen={activeSubMenu === "Store Bank Details"}
                onClick={() => handleSubMenuClick("Store Bank Details")}
              >
                <MenuItem>Pie charts</MenuItem>
                <MenuItem>Line charts</MenuItem>
              </SubMenu>

              <MenuItem>Pending Stores</MenuItem>
              <MenuItem>Total Stores</MenuItem>
              <MenuItem>Calendar</MenuItem>
            </Menu>
          </Sidebar>
          <div className='flex items-center justify-center w-full px-2'>
            <button className='bg-[#DA3647] h-10 px-4 rounded-lg text-white cursor-pointer w-full text-left text-lg'>Logout</button>
          </div>
        </nav>
        <main className="flex-1 overflow-auto  px-10">
          <div className='flex justify-between xl:gap-x-[520px] items-center bg-white p-2  rounded-xl fixed'>
            <div className='flex items-center gap-2  text-black'>
              <GiHamburgerMenu className='font-light' size={30} />
              <input type="text" className='bg-gray-100 rounded-lg w-96 h-10 pl-2' placeholder='Search...' />
              <button className='bg-[#493D9E] h-10 px-4 rounded-lg text-white cursor-pointer w-28'>Search</button>
            </div>
            <div className='flex items-center justify-center gap-2 pr-5 text-white'>
              <select className='rounded-lg h-10 bg-[#493D9E] p-2 w-32'>
                <option value="option1">All Cities</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
                <option value="option5">Option 5</option>
              </select>
              <CgProfile className='text-gray-500' size={30} />
            </div>
          </div>
          <div className='pt-20'>{Content || children}
          </div>
        </main>

      </div>
      {/* <div className=' text-center pt-5'>Copyright © 2025 Tboo Services Private Limited | All Rights Reserved.</div> */}
    </div>
  );
};

export default Layout;