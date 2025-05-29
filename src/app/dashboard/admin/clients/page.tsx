"use client";

import React, { useEffect, useState } from "react";
import axios from "@/../axios";
import { useAuthStore } from "@/store/isAuth";

interface Client {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const AdminClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sort, setSort] = useState<'created' | 'name'>('created');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchClients = async () => {
      if (!token) return;
      const res = await axios.get('/api/admin/clients', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setClients(res.data);
    };
    fetchClients();
  }, [token]);

  const sorted = [...clients].sort((a, b) => {
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Clients</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setSort('created'); setOrder(order === 'asc' ? 'desc' : 'asc'); }} className="px-3 py-1 bg-blue-100 rounded">Created {sort === 'created' ? (order === 'asc' ? '↑' : '↓') : ''}</button>
        <button onClick={() => { setSort('name'); setOrder(order === 'asc' ? 'desc' : 'asc'); }} className="px-3 py-1 bg-green-100 rounded">Name {sort === 'name' ? (order === 'asc' ? 'A→Z' : 'Z→A') : ''}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorted.map(client => (
          <div key={client._id} className="bg-white p-4 rounded shadow border flex flex-col gap-2">
            <div className="font-semibold text-lg">{client.name}</div>
            <div className="text-xs text-gray-500">ID: {client._id}</div>
            <div className="text-xs text-gray-500">Email: {client.email}</div>
            <div className="text-xs text-gray-500">Created: {new Date(client.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClientsPage;
