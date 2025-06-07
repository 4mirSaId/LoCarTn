'use client';

import { useAppSelector } from '../../../features/redux/hooks';
import AddCarForm from '../../../features/cars/components/AddCarForm';
import CarList from '../../../features/cars/components/CarList';
import { useState, useEffect, useCallback } from 'react';
import axios from '../../../../../axios';

export default function AgencyCarsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCars = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/cars/agency/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCars(response.data);
    } catch (err) {
      const errorMsg =
        typeof err === 'object' &&
        err &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response
          ? (err.response as { data?: { message?: string } }).data?.message
          : 'Failed to fetch cars';
      setError(errorMsg || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Manage Your Cars</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className={`mb-4 px-6 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            ${showForm ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {showForm ? 'Hide Add Car Form' : 'Show Add Car Form'}
        </button>
        {showForm && (
          <div className="mt-4 animate-fade-in-down relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-0 right-0 mt-2 mr-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close Add Car Form"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AddCarForm onCarAdded={fetchCars} />
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Cars</h2>
        <CarList
          cars={cars}
          loading={loading}
          error={error}
          refreshCars={fetchCars}
        />
      </div>
    </div>
  );
}