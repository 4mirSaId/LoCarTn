'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationForm from '../features/reservations/components/ReservationForm';
import { useAuthStore } from '@/store/isAuth';

const CarList = () => {
    const [cars, setCars] = useState<Array<{
        _id: string;
        brand: string;
        model: string;
        year: number;
        pricePerDay: number;
        // add imageUrl if needed
    }>>([]);
    const [showFormFor, setShowFormFor] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        axios.get('/api/cars')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.error('Error fetching cars:', error);
            });
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Car List</h2>
            <ul className="space-y-4">
                {cars.map((car) => (
                    <li key={car._id} className="p-4 border border-gray-200 rounded-md">
                        <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
                        <p className="text-sm text-gray-500">Year: {car.year}</p>
                        <p className="text-sm text-gray-500">Price: ${car.pricePerDay} / day</p>
                        {user?.role === 'client' && (
                          <>
                            <button
                              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                              onClick={() => setShowFormFor(showFormFor === car._id ? null : car._id)}
                            >
                              {showFormFor === car._id ? 'Cancel' : 'Reserve'}
                            </button>
                            {showFormFor === car._id && (
                              <div className="mt-3">
                                <ReservationForm
                                  carId={car._id}
                                  pricePerDay={car.pricePerDay}
                                  onSuccess={() => setShowFormFor(null)}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </li>
                ))}
            </ul>
        </div>
    );
};

export default CarList;