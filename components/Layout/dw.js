import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'your-menu-library';  // Replace with actual imports
import { IoIosArrowForward } from 'react-icons/io';

const SidebarMenu = () => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleSubMenuClick = (label) => {
    // Toggle submenu open/close by setting the active submenu
    if (activeSubMenu === label) {
      setActiveSubMenu(null); // Close the submenu if it's already open
    } else {
      setActiveSubMenu(label); // Open the clicked submenu
    }
  };

  return (
    <Sidebar width='175px' className='text-sm pt-5 text-black'>
      <Menu>
        <MenuItem>
          <p className='flex items-center justify-between'>
            <span>Dashboard</span>
            <span><IoIosArrowForward /></span>
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
  );
};

export default SidebarMenu;
