// src/app/dashboard/page.tsx
'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/isAuth';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
          <p className="mb-4">Welcome, {user?.name}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">My Reservations</h2>
              <p>View your current and past reservations</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Favorite Cars</h2>
              <p>View your saved favorite cars</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
              <p>Manage your payment options</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
              <p>Update your personal information</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}