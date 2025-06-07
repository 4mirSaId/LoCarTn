"use client";

import React, { useEffect, useState } from "react";
import axios from "@/../axios";
import { useAppSelector } from '../../../features/redux/hooks';

interface Reservation {
  _id: string;
  carId: {
    agency: {
      name: string;
    } | null;
  };
  clientId: {
    name: string;
  };
  period: { from: string; to: string };
  status: 'pending' | 'confirmed' | 'denied';
  createdAt: string;
}

const statusOptions = ["all", "pending", "confirmed", "denied"] as const;
type StatusFilter = typeof statusOptions[number];

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;

  useEffect(() => {
    const fetchReservations = async () => {
      if (!token) return;
      const res = await axios.get('/api/admin/reservations', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReservations(res.data);
    };
    fetchReservations();
  }, [token]);

  const filtered = reservations.filter(r =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    return sortOrder === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Reservations</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="px-3 py-1 bg-blue-100 rounded">Time {sortOrder === 'asc' ? '↑' : '↓'}</button>
        {statusOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setStatusFilter(opt)}
            className={`px-3 py-1 rounded ${statusFilter === opt ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorted.map(r => (
          <div key={r._id} className="bg-white p-4 rounded shadow border flex flex-col gap-2">
            <div className="font-semibold text-lg">Client: {r.clientId?.name || 'N/A'}</div>
            <div className="text-sm text-gray-700">Agency: {r.carId?.agency?.name || 'N/A'}</div>
            <div className="text-xs text-gray-500">Reserved: {new Date(r.createdAt).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Period: {new Date(r.period.from).toLocaleDateString()} - {new Date(r.period.to).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">Status: <span className={`font-semibold ${r.status === 'pending' ? 'text-yellow-600' : r.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>{r.status}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReservationsPage;
