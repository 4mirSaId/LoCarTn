import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createReservation } from '../../redux/reservationSlice';

interface ReservationFormProps {
  carId: string;
  agencyId: string;
  pricePerDay: number;
  caution: number;
  onSuccess: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ carId, pricePerDay, caution, onSuccess }) => {
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.reservation);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const calcDays = () => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (fromDate > toDate) return 0;
    return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const cost = (pricePerDay * calcDays()) + caution;

  React.useEffect(() => {
    if (success) {
      setFrom('');
      setTo('');
      onSuccess();
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, onSuccess, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    try {
      await dispatch(createReservation({ carId, from, to, token })).unwrap();
    } catch (err) {
      const errorMsg =
        typeof err === 'string'
          ? err
          : (err as { message?: string })?.message || 'Reservation failed.';
      if (errorMsg.includes('Not available')) {
        setValidationError('Not available for these days!');
      } else {
        setValidationError(errorMsg);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-2 border rounded bg-gray-50 text-sm max-w-xs mx-auto relative">
      {showSuccess && (
        <div className="absolute top-0 left-0 w-full flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-2 z-50">
          <span>Reserved with success, please check your reservations and wait for the agency to confirm your request</span>
          <button
            type="button"
            className="ml-4 text-green-900 hover:text-green-700 font-bold text-lg focus:outline-none"
            onClick={() => setShowSuccess(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
      {validationError && <div className="text-red-600 text-xs">{validationError}</div>}
      {error && <div className="text-red-600 text-xs">{error}</div>}
      <div>
        <label className="block font-medium">From</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1 w-full text-xs" required />
      </div>
      <div>
        <label className="block font-medium">To</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1 w-full text-xs" required />
      </div>
      <div className="text-gray-700">Total: <span className="font-semibold">{cost}Dt</span></div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60 text-xs">
        {loading ? 'Reserving...' : 'Reserve'}
      </button>
    </form>
  );
};

export default ReservationForm;
