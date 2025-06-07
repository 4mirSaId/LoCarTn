'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from '../../../../../axios';
import { useAppSelector } from '../../redux/hooks';

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  caution: number;
  isRented: boolean;
  imageUrl: string;
}

interface CarListProps {
  cars: Car[];
  loading: boolean;
  error: string | null;
  refreshCars: () => void;
}

export default function CarList({ cars, loading, error, refreshCars }: CarListProps) {
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [imgSrcs, setImgSrcs] = useState<Record<string, string>>(() =>
    Object.fromEntries(cars.map((car) => [car._id, car.imageUrl || '/car-placeholder.jpg']))
  );

  // Update imgSrcs if cars prop changes
  useEffect(() => {
    setImgSrcs(Object.fromEntries(cars.map((car) => [car._id, car.imageUrl || '/car-placeholder.jpg'])));
  }, [cars]);

  const handleDelete = async (carId: string) => {
    if (!token) {
      alert('You must be logged in as an agency to delete a car.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await axios.delete(`/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshCars();
    } catch {
      alert('Failed to delete car');
    }
  };

  const handlePriceUpdate = async (carId: string) => {
    if (!token) {
      alert('You must be logged in as an agency to update the price.');
      return;
    }
    try {
      await axios.patch(`/api/cars/${carId}/price`, { pricePerDay: newPrice }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingCarId(null);
      setNewPrice('');
      refreshCars();
    } catch {
      alert('Failed to update price');
    }
  };

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
      <h2 className="text-2xl font-bold mb-4">Car List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={
                  imgSrcs[car._id] && imgSrcs[car._id].trim() !== ''
                    ? imgSrcs[car._id]
                    : '/rental.png'
                }
                alt={`${car.brand} ${car.model}`}
                className="object-cover w-full h-full"
                width={400}
                height={300}
                onError={() =>
                  setImgSrcs((prev) => ({
                    ...prev,
                    [car._id]: '/car-placeholder.jpg',
                  }))
                }
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{car.brand} {car.model}</h3>
              <p className="text-gray-600 text-sm mb-2">Year: {car.year}</p>
              <p className="text-gray-600 text-sm mb-2">Caution: {car.caution}DT</p>
              <div className="flex items-center justify-between mt-3">
                {editingCarId === car._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      step="0.01"
                    />
                    <button
                      onClick={() => handlePriceUpdate(car._id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingCarId(null); setNewPrice(''); }}
                      className="px-2 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{car.pricePerDay}DT</span>
                    <span className="text-gray-500 text-sm">/day</span>
                    <button
                      onClick={() => { setEditingCarId(car._id); setNewPrice(car.pricePerDay.toString()); }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(car._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}