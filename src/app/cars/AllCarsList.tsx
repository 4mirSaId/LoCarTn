'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationForm from '../features/reservations/components/ReservationForm';
import { useAppSelector } from '../features/redux/hooks';
import Image from 'next/image';

const CarList = () => {
    const [cars, setCars] = useState<Array<{
        _id: string;
        brand: string;
        model: string;
        year: number;
        pricePerDay: number;
        caution?: number;
        imageUrl?: string;
        agencyId?: string;
        location?: string;
    }>>([]);
    const [showFormFor, setShowFormFor] = useState<string | null>(null);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [showStates, setShowStates] = useState(false);
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        axios.get('/api/cars')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.error('Error fetching cars:', error);
            });
    }, []);

    // Find the selected car for the reservation form
    const selectedCar = cars.find(car => car._id === showFormFor);

    return (
        <div>
            {/* Location Filter */}
            <div className="mb-6 flex flex-col items-center">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none"
                  onClick={() => setShowStates((prev) => !prev)}
                  type="button"
                >
                  {showStates ? 'Hide' : 'Filter by location'}
                </button>
                {showStates && (
                  <div className="flex flex-wrap gap-2 mt-4 bg-white border border-gray-200 rounded p-3 shadow-md z-10 relative justify-center">
                    {["Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"].map(state => (
                      <button
                        key={state}
                        className={`px-3 py-1 rounded border text-sm ${selectedStates?.includes(state) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setSelectedStates(prev => prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state])}
                        type="button"
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {(selectedStates && selectedStates.length > 0 ? cars.filter(car => car.location && selectedStates.includes(car.location)) : cars).map((car) => (
                    <div key={car._id} className="bg-white p-4 border border-gray-200 rounded-md shadow-md flex flex-col">
                        <Image
                          width={300}
                          height={200}
                          src={car.imageUrl || '/rental.png'}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-40 object-cover rounded mb-3 bg-gray-100"
                        />
                        <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
                        <p className="text-sm text-gray-500">Year: {car.year}</p>
                        <p className="text-sm text-gray-500">Price: {car.pricePerDay}DT / day</p>
                        <p className="text-sm text-gray-500">Caution: {car.caution ?? 0}DT</p>
                        <p className="text-sm text-gray-500">Location: {car.location || 'N/A'}</p>
                        {user && user.role === 'client' && (
                            <button
                              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                              onClick={() => setShowFormFor(car._id)}
                            >
                              Reserve
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for ReservationForm */}
            {showFormFor && selectedCar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-2xl relative w-full max-w-md">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowFormFor(null)}
                  >
                    &times;
                  </button>
                  <ReservationForm
                    carId={selectedCar._id}
                    pricePerDay={selectedCar.pricePerDay}
                    caution={selectedCar.caution ?? 0}
                    agencyId={selectedCar.agencyId || ''}
                    onSuccess={() => setShowFormFor(null)}
                  />
                </div>
              </div>
            )}
        </div>
    );
};

export default CarList;