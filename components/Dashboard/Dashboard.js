"use client";
import React from "react";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { LuCalendarDays } from "react-icons/lu";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dailyData = [
  { name: "Mon", orders: 12, returns: 5 },
  { name: "Tue", orders: 15, returns: 7 },
  { name: "Wed", orders: 10, returns: 6 },
  { name: "Thu", orders: 20, returns: 8 },
  { name: "Fri", orders: 18, returns: 10 },
  { name: "Sat", orders: 25, returns: 15 },
  { name: "Sun", orders: 30, returns: 18 },
];

const weeklyData = [
  { name: "Week 1", orders: 10, returns: 5 },
  { name: "Week 2", orders: 20, returns: 10 },
  { name: "Week 3", orders: 15, returns: 7 },
  { name: "Week 4", orders: 25, returns: 12 },
];

const monthlyData = [
  { name: "Jan", orders: 10, returns: 20 },
  { name: "Feb", orders: 15, returns: 22 },
  { name: "Mar", orders: 5, returns: 18 },
  { name: "Apr", orders: 65, returns: 35 },
  { name: "May", orders: 45, returns: 15 },
  { name: "Jun", orders: 90, returns: 55 },
  { name: "Jul", orders: 60, returns: 52 },
  { name: "Aug", orders: 85, returns: 75 },
  { name: "Sep", orders: 90, returns: 100 },
  { name: "Oct", orders: 90, returns: 100 },
  { name: "Nov", orders: 90, returns: 100 },
  { name: "Dec", orders: 90, returns: 100 },
];

const yearlyData = [
  { name: "2021", orders: 450, returns: 300 },
  { name: "2022", orders: 520, returns: 310 },
  { name: "2023", orders: 610, returns: 400 },
  { name: "2024", orders: 700, returns: 450 },
];

const Dashboard = (props) => {
  const [showCal, setShowCal] = React.useState(false);
  const [value, onChange] = React.useState(new Date());
  const [filter, setFilter] = useState("monthly");

  const getFilteredData = () => {
    switch (filter) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "yearly":
        return yearlyData;
      case "monthly":
      default:
        return monthlyData;
    }
  };
  const Card = ({ count, text }) => {
    return (
      <div className=" rounded-xl shadow p-4 py-7 hover:scale-105 cursor-pointer transition duration-300 ease-in-out">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold">{count}</h2>
            <p className="text-gray-600">{text}</p>
          </div>
          <IoIosArrowForward size={20} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-3 ">
      <div className="flex items-center justify-between">
        <p className="py-5 text-2xl font-bold ">Dashboard</p>
        <p
          onClick={() => {
            setShowCal(!showCal);
          }}
          className="hover:scale-95 cursor-pointer p-2 h-fit w-32 rounded-lg flex items-center gap-x-3 border-2 border-gray-100"
        >
          <LuCalendarDays />
          Today
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10">
        <Card count={"5000"} text={"Today Sales"} />
        <Card count={"500"} text={"Today Sales"} />
        <Card count={"50"} text={"Today Returns Sales"} />
      </div>
      <div className="pt-4 flex gap-y-4 lg:gap-x-16 lg:flex-row flex-col ">
        <div className=" rounded-lg lg:w-[33%]  border-2 border-[#F5F5F5]">
          <p className="font-bold pl-3 pt-3 text-xl">Today orders by city</p>
          <ul className="pt-3 flex flex-col gap-y-2">
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
            <li className="flex justify-between  border-b-2 border-b-gray-100 px-3 pb-2 items-center">
              <span>300 in medipally</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>
          </ul>
        </div>
        <div>
          <div
            className="flex items-end justify-end"
            style={{ marginBottom: "20px" }}
          >
            <label className="pr-2" htmlFor="filter">
              Select Time Range:{" "}
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-200 rounded-lg px-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="w-full lg:w-[700px] lg:h-[400px]  h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="#f06292"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {showCal && (
        <div className="absolute top-48 right-0 z-50 ">
          <Calendar
            className={"bg-red-200"}
            onChange={onChange}
            value={value}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
