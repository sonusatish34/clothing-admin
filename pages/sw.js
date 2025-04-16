import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const dailyData = [
  { name: 'Mon', orders: 12, returns: 5 },
  { name: 'Tue', orders: 15, returns: 7 },
  { name: 'Wed', orders: 10, returns: 6 },
  { name: 'Thu', orders: 20, returns: 8 },
  { name: 'Fri', orders: 18, returns: 10 },
  { name: 'Sat', orders: 25, returns: 15 },
  { name: 'Sun', orders: 30, returns: 18 },
];

const weeklyData = [
  { name: 'Week 1', orders: 10, returns: 5 },
  { name: 'Week 2', orders: 20, returns: 10 },
  { name: 'Week 3', orders: 15, returns: 7 },
  { name: 'Week 4', orders: 25, returns: 12 },
];

const monthlyData = [
  { name: 'Jan', orders: 10, returns: 20 },
  { name: 'Feb', orders: 15, returns: 22 },
  { name: 'Mar', orders: 5, returns: 18 },
  { name: 'Apr', orders: 65, returns: 35 },
  { name: 'May', orders: 45, returns: 15 },
  { name: 'Jun', orders: 90, returns: 55 },
  { name: 'Jul', orders: 60, returns: 52 },
  { name: 'Aug', orders: 85, returns: 75 },
  { name: 'Sep', orders: 90, returns: 100 },
  { name: 'Oct', orders: 90, returns: 100 },
  { name: 'Nov', orders: 90, returns: 100 },
  { name: 'Dec', orders: 90, returns: 100 },
];

const yearlyData = [
  { name: '2021', orders: 450, returns: 300 },
  { name: '2022', orders: 520, returns: 310 },
  { name: '2023', orders: 610, returns: 400 },
  { name: '2024', orders: 700, returns: 450 },
];

const OrdersReturnsChart = () => {
  const [filter, setFilter] = useState('monthly');

  const getFilteredData = () => {
    switch (filter) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'yearly':
        return yearlyData;
      case 'monthly':
      default:
        return monthlyData;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="filter">Select Time Range: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width={1000} height={600}>
        <LineChart data={getFilteredData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="returns" stroke="#f06292" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersReturnsChart;
