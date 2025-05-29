import React, { useState } from 'react';
import axios from '../../../../../axios';
import { useAuthStore } from '@/store/isAuth';

interface ReservationFormProps {
  carId: string;
  pricePerDay: number;
  onSuccess: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ carId, pricePerDay, onSuccess }) => {
  const token = useAuthStore((state) => state.token);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const calcDays = () => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (fromDate > toDate) return 0;
    return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const cost = pricePerDay * calcDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!token) {
      setError('You must be logged in as a client to reserve.');
      setIsSubmitting(false);
      return;
    }
    try {
      await axios.post(`/api/reservations/${carId}`, { from, to }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Reservation submitted!');
      setFrom('');
      setTo('');
      onSuccess();
    } catch (err) {
      let msg = 'Failed to reserve car';
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
        msg = (err.response as any).data?.message || msg;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-2 border rounded bg-gray-50 text-sm max-w-xs mx-auto">
      {error && <div className="text-red-600 text-xs">{error}</div>}
      {success && <div className="text-green-600 text-xs">{success}</div>}
      <div>
        <label className="block font-medium">From</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1 w-full text-xs" required />
      </div>
      <div>
        <label className="block font-medium">To</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1 w-full text-xs" required />
      </div>
      <div className="text-gray-700">Total: <span className="font-semibold">{cost}Dt</span></div>
      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60 text-xs">
        {isSubmitting ? 'Reserving...' : 'Reserve'}
      </button>
    </form>
  );
};

export default ReservationForm;
