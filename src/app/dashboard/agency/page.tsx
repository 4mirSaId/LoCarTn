// This is the agency dashboard page
// It is protected by the ProtectedRoute component
// It is only accessible by users with the role of AGENCY
'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/isAuth';

export default function AgencyDashboard() {
  const { user } = useAuthStore();
  
  return (
    <ProtectedRoute allowedRoles={['AGENCY']}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Agency Dashboard</h1>
          <p className="mb-4">Welcome, {user?.name}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">My Cars</h2>
              <p>Manage your car listings</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Reservations</h2>
              <p>View and manage reservations</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Earnings</h2>
              <p>View your earnings and payments</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Agency Profile</h2>
              <p>Update your agency information</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}