'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function OrderPage({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload files
      let uploadedFiles = [];
      if (files.length > 0) {
        const formDataFiles = new FormData();
        files.forEach(file => formDataFiles.append('files', file));
        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formDataFiles);
        uploadedFiles = uploadRes.data.files;
      }

      // Create order
      const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        userId: 'user_id_here',
        serviceId: params.id,
        customerDetails: formData,
        uploadedFiles,
        notes: formData.notes,
      });

      // Redirect to payment
      router.push(`/payment/${orderRes.data._id}`);
    } catch (err) {
      alert('Error creating order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Order Details</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-semibold mb-2">Upload Documents</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                <ul className="space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx} className="text-sm">✓ {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}