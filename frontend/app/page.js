'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Navbar */}
      <nav className="bg-navy-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏢 JaySoftShine</h1>
          <div className="space-x-4">
            <Link href="/portal" className="hover:text-blue-300">Services</Link>
            <Link href="/admin" className="hover:text-blue-300">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Welcome to JaySoftShine</h1>
        <p className="text-xl mb-8 text-blue-100">Your Trusted Business Consultant</p>
        <p className="text-lg mb-12 text-blue-100 max-w-2xl mx-auto">
          Expert tax consultancy, GST services, compliance, and document processing solutions for growing businesses
        </p>
        <Link href="/portal" className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-50">
          Browse Services →
        </Link>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Income Tax Returns</h3>
              <p className="text-gray-600">Expert ITR filing for individuals & businesses</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">GST Services</h3>
              <p className="text-gray-600">Complete GST compliance & filing support</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Compliance</h3>
              <p className="text-gray-600">Full regulatory compliance management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}