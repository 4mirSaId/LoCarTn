'use client'
import React, { useEffect, useState } from 'react';
import axios from '../../../../axios';
import { useAppSelector } from '../../features/redux/hooks';

interface Reservation {
  _id: string;
  carId: {
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl?: string;
    agency?: { name: string };
  };
  period: { from: string; to: string };
  cost: number;
  status: string;
  createdAt: string;
  agencyName?: string;
}

const ClientReservationsList: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;
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

   if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }


  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Reservations</h2>
      {reservations.length === 0 ? (
        <div className="text-gray-600">No reservations found.</div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li key={r._id} className="p-4 border rounded bg-white shadow">
              <div className="font-semibold">
                {r.carId ? (
                  <>
                    {r.carId.brand} {r.carId.model} ({r.carId.year})
                  </>
                ) : (
                  <span className="text-gray-400">Unknown Car</span>
                )}
              </div>
              <div className="text-sm text-gray-500">From: {new Date(r.period.from).toLocaleDateString()} To: {new Date(r.period.to).toLocaleDateString()}</div>
              <div className="text-sm">Cost: <span className="font-semibold">{r.cost}DT</span></div>
              <div className="text-sm">Agency: <span className="font-semibold">{r.agencyName || r.carId?.agency?.name || 'N/A'}</span></div>
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
