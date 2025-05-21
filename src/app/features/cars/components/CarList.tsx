'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/isAuth';
import axios from '../../../../../axios';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  isRented: boolean;
  imageUrl: string;
  
}
interface CarListProps {
  agencyId?: string;
}

export default function CarList({ agencyId }: CarListProps) {
  const { user } = useAuthStore();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`/api/cars/agency/${agencyId}`);
        setCars(response.data);
      } catch (err) {
        setError('Failed to fetch cars');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [user, agencyId]);

  const handleDelete = async (carId: string) => {
    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars(cars.filter(car => car.id !== carId));
    } catch {
      setError('Failed to delete car');
    }
  };

  const handlePriceUpdate = async (carId: string) => {
    try {
      await axios.patch(`http://localhost:7000/api/cars/${carId}`, { pricePerDay: newPrice });
      setCars(cars.map(car => 
        car.id === carId ? { ...car, pricePerDay: newPrice } : car
      ));
      setEditingCarId(null);
    } catch {
      setError('Failed to update price');
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cars ({cars.length})</h2>
      
      {cars.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No cars added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={car.imageUrl || '/car-placeholder.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                  car.isRented ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {car.isRented ? 'Rented' : 'Available'}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {car.brand} {car.model}
                </h3>
                <p className="text-gray-600 text-sm mb-2">Year: {car.year}</p>

                <div className="flex items-center justify-between mt-3">
                  {editingCarId === car.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        step="0.01"
                      />
                      <button
                        onClick={() => handlePriceUpdate(car.id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">${car.pricePerDay}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                      <button
                        onClick={() => {
                          setEditingCarId(car.id);
                          setNewPrice(car.pricePerDay);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}