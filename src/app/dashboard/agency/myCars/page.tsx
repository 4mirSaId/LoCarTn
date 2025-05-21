
'use client';

import { useAuthStore } from '@/store/isAuth';
import AddCarForm from '../../../features/cars/components/AddCarForm';
import CarList from '../../../features/cars/components/CarList';

export default function AgencyCarsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Manage Your Cars</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
        <AddCarForm agencyId={user?.id} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Cars</h2>
        <CarList agencyId={user?.id} />
      </div>
    </div>
  );
}