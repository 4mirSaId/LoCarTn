'use client'
import React, { useEffect, useState } from 'react';
import axios from '../../../../../axios';
import { useAppSelector } from '../../../features/redux/hooks';

interface Reservation {
  _id: string;
  carId: {
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl?: string;
  };
  clientId: {
    name: string;
    email: string;
    phone: string;
  };
  period: { from: string; to: string };
  cost: number;
  status: string;
  createdAt: string;
}

const AgencyReservationsList: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/reservations/agency', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setReservations(res.data);
    } catch {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, [token]);

  const handleStatus = async (reservationId: string, status: 'confirmed' | 'denied') => {
    setActionLoading(reservationId + status);
    try {
      await axios.patch(`/api/reservations/${reservationId}/status`, { status }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchReservations();
    } catch {
      alert('Failed to update reservation status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reservations for Your Cars</h2>
      {reservations.length === 0 ? (
        <div className="text-gray-600">No reservations found.</div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li key={r._id} className="p-4 border rounded bg-white shadow">
              <div className="font-semibold">{r.carId.brand} {r.carId.model} ({r.carId.year})</div>
              <div className="text-sm text-gray-500">From: {new Date(r.period.from).toLocaleDateString()} To: {new Date(r.period.to).toLocaleDateString()}</div>
              <div className="text-sm">Cost: <span className="font-semibold">${r.cost}</span></div>
              <div className="text-sm">Client: <span className="font-semibold">{r.clientId.name}</span> (<span className="text-blue-700">{r.clientId.email}</span>, <span className="text-green-700">{r.clientId.phone}</span>)</div>
              <div className="text-sm">Status: <span className={`font-semibold ${r.status === 'pending' ? 'text-yellow-600' : r.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>{r.status}</span></div>
              <div className="text-xs text-gray-400 mt-1">Reserved on: {new Date(r.createdAt).toLocaleString()}</div>
              {r.status === 'pending' && (
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-60"
                    disabled={actionLoading === r._id + 'confirmed'}
                    onClick={() => handleStatus(r._id, 'confirmed')}
                  >
                    {actionLoading === r._id + 'confirmed' ? 'Confirming...' : 'Confirm'}
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-60"
                    disabled={actionLoading === r._id + 'denied'}
                    onClick={() => handleStatus(r._id, 'denied')}
                  >
                    {actionLoading === r._id + 'denied' ? 'Denying...' : 'Deny'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgencyReservationsList;
