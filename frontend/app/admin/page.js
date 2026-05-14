'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-600 font-semibold mb-2 text-sm">{label}</h3>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, loginData);
      setAdminUser(res.data.user);
      localStorage.setItem('adminToken', res.data.token);
      fetchStats();
      fetchOrders();
      fetchServices();
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services`);
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`, {
        status: newStatus
      });
      fetchOrders();
      alert('Order status updated!');
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-600">🔐 Admin</h1>
          <p className="text-center text-gray-600 mb-8">JaySoftShine Portal</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="imjayvyas"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">📊 JaySoftShine Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-75">Welcome, {adminUser.username}</span>
            <button 
              onClick={() => {
                setAdminUser(null);
                localStorage.removeItem('adminToken');
              }} 
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {['overview', 'orders', 'services'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <h2 className="text-2xl font-bold mb-6">📈 Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Orders" value={stats.totalOrders} color="text-blue-600" />
                <StatCard label="Completed" value={stats.completedOrders} color="text-green-600" />
                <StatCard label="Pending" value={stats.pendingOrders} color="text-yellow-600" />
                <StatCard label="Processing" value={stats.processingOrders} color="text-purple-600" />
              </div>
            </div>

            {/* Revenue */}
            <div>
              <h2 className="text-2xl font-bold mb-6">💰 Revenue</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="text-green-600" />
                <StatCard label="Total Users" value={stats.totalUsers} color="text-purple-600" />
                <StatCard label="Total Services" value={stats.totalServices} color="text-orange-600" />
              </div>
            </div>

            {/* Recent Orders */}
            {stats.recentOrders && (
              <div>
                <h2 className="text-2xl font-bold mb-6">📦 Recent Orders</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Order #</th>
                        <th className="px-6 py-3 text-left font-semibold">Customer</th>
                        <th className="px-6 py-3 text-left font-semibold">Service</th>
                        <th className="px-6 py-3 text-left font-semibold">Amount</th>
                        <th className="px-6 py-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map(order => (
                        <tr key={order._id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-3 font-mono text-sm">{order.orderNumber}</td>
                          <td className="px-6 py-3">{order.customerDetails?.name}</td>
                          <td className="px-6 py-3">{order.serviceId?.name}</td>
                          <td className="px-6 py-3 font-semibold">₹{order.finalAmount}</td>
                          <td className="px-6 py-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">📦 All Orders</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Order #</th>
                    <th className="px-6 py-3 text-left font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold">Service</th>
                    <th className="px-6 py-3 text-left font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm">{order.orderNumber}</td>
                      <td className="px-6 py-3">{order.customerDetails?.name}</td>
                      <td className="px-6 py-3">{order.serviceId?.name}</td>
                      <td className="px-6 py-3 font-semibold">₹{order.finalAmount}</td>
                      <td className="px-6 py-3">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="px-3 py-1 rounded border border-gray-300 text-sm"
                        >
                          <option>pending</option>
                          <option>confirmed</option>
                          <option>processing</option>
                          <option>completed</option>
                          <option>cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <a href={`/orders/${order._id}`} className="text-blue-600 hover:underline text-sm">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">🛍️ Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {service.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">₹{service.basePrice}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}