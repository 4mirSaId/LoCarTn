'use client'
import React, { useEffect, useState } from 'react';
import axios from '../../../../axios';
import { useAuthStore } from '@/store/isAuth';

interface Reservation {
  _id: string;
  carId: {
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl?: string;
  };
  period: { from: string; to: string };
  cost: number;
  status: string;
  createdAt: string;
}

const ClientReservationsList: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/reservations/client', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setReservations(res.data);
      } catch {
        setError('Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [token]);

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Reservations</h2>
      {reservations.length === 0 ? (
        <div className="text-gray-600">No reservations found.</div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li key={r._id} className="p-4 border rounded bg-white shadow">
              <div className="font-semibold">{r.carId.brand} {r.carId.model} ({r.carId.year})</div>
              <div className="text-sm text-gray-500">From: {new Date(r.period.from).toLocaleDateString()} To: {new Date(r.period.to).toLocaleDateString()}</div>
              <div className="text-sm">Cost: <span className="font-semibold">${r.cost}</span></div>
              <div className="text-sm">Status: <span className={`font-semibold ${r.status === 'pending' ? 'text-yellow-600' : r.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>{r.status}</span></div>
              <div className="text-xs text-gray-400 mt-1">Reserved on: {new Date(r.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientReservationsList;
