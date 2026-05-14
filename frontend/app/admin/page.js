'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, loginData);
      setAdminUser(res.data.user);
      fetchStats();
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

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="imjayvyas"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>
          <button onClick={() => setAdminUser(null)} className="bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold mb-2">Total Orders</h3>
              <p className="text-4xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold mb-2">Total Revenue</h3>
              <p className="text-4xl font-bold text-green-600">₹{stats.totalRevenue}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-purple-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold mb-2">Total Services</h3>
              <p className="text-4xl font-bold text-orange-600">{stats.totalServices}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}