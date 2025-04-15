import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
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


const OrdersReturnsChart = () => (
  <ResponsiveContainer width={1000} height={600}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
      <Line type="monotone" dataKey="returns" stroke="#f06292" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default OrdersReturnsChart;
