"use client";

import React, { useEffect, useState } from "react";
import axios from "@/../axios";
import { useAuthStore } from "@/store/isAuth";

interface Agency {
  _id: string;
  name: string;
  createdAt: string;
  // carsCount will be fetched
  carsCount?: number;
}

const AdminAgenciesPage = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [sort, setSort] = useState<'created' | 'name'>('created');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchAgencies = async () => {
      if (!token) return;
      // Get all agencies with admin token
      const res = await axios.get('/api/admin/agencies', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      // For each agency, fetch cars count using the admin proxy route
      const agenciesWithCounts = await Promise.all(res.data.map(async (agency: Agency) => {
        const carsRes = await axios.get(`/api/admin/agencies/${agency._id}/cars`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        return { ...agency, carsCount: carsRes.data.length };
      }));
      setAgencies(agenciesWithCounts);
    };
    fetchAgencies();
  }, [token]);

  const handleDelete = async (agencyId: string) => {
    if (!window.confirm('Are you sure you want to delete this agency and all its cars?')) return;
    await axios.delete(`/api/admin/agencies/${agencyId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    setAgencies(agencies.filter(a => a._id !== agencyId));
  };

  const sorted = [...agencies].sort((a, b) => {
    if (sort === 'created') {
      return order === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Agencies</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setSort('created'); setOrder(order === 'asc' ? 'desc' : 'asc'); }} className="px-3 py-1 bg-blue-100 rounded">Created {sort === 'created' ? (order === 'asc' ? '↑' : '↓') : ''}</button>
        <button onClick={() => { setSort('name'); setOrder(order === 'asc' ? 'desc' : 'asc'); }} className="px-3 py-1 bg-green-100 rounded">Name {sort === 'name' ? (order === 'asc' ? 'A→Z' : 'Z→A') : ''}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorted.map(agency => (
          <div key={agency._id} className="bg-white p-4 rounded shadow border flex flex-col gap-2">
            <div className="font-semibold text-lg">{agency.name}</div>
            <div className="text-xs text-gray-500">ID: {agency._id}</div>
            <div className="text-xs text-gray-500">Created: {new Date(agency.createdAt).toLocaleString()}</div>
            <div className="text-sm text-gray-700">Cars: <b>{agency.carsCount}</b></div>
            <button onClick={() => handleDelete(agency._id)} className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAgenciesPage;
