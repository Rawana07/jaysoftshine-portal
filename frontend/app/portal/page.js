'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Portal() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services`);
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading services...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Our Services</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{service.icon || '📋'}</div>
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {service.category}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">₹{service.basePrice}</span>
                <span className="text-sm text-gray-500">{service.turnaroundTime}</span>
              </div>
              <Link href={`/order/${service._id}`} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center block">
                Order Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}