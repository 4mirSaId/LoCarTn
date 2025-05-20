'use client';

import Image from 'next/image';
import { Car } from '@/types/car';
import { useUpdateCarPriceMutation, useDeleteCarMutation } from '../carsApi';

export default function CarList({ cars }: { cars: Car[] }) {
  const [updatePrice] = useUpdateCarPriceMutation();
  const [deleteCar] = useDeleteCarMutation();

  const handlePriceChange = async (carId: string, newPrice: number) => {
    try {
      await updatePrice({ id: carId, pricePerDay: newPrice }).unwrap();
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    try {
      await deleteCar(carId).unwrap();
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <div key={car.id} className="border p-4 rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Cars ({cars.length})</h2>
        
        {cars.length === 0 ? (
          <p>No cars added yet</p>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => (
              <div key={car.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <Image 
                    src={car.image || '/car-placeholder.jpg'} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-40 h-30 object-cover rounded"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
                  <p className="text-gray-600">Year: {car.year}</p>
                  <div className="flex items-center mt-2">
                    <span className="font-medium">Price/Day: $</span>
                    <input
                      type="number"
                      value={car.pricePerDay}
                      onChange={(e) => handlePriceChange(car.id, parseFloat(e.target.value))}
                      className="ml-2 w-20 p-1 border rounded"
                    />
                  </div>
                  <p className={`mt-2 ${car.isRented ? 'text-red-500' : 'text-green-500'}`}>
                    {car.isRented ? 'Currently Rented' : 'Available'}
                  </p>
                </div>
                
                <div className="flex-shrink-0 self-end">
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      ))}
    </div>
  );
}