// This is the admin dashboard page
// It is protected by the ProtectedRoute component
'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/isAuth';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <p className="mb-4">Welcome, {user?.name}!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/admin/agencies" className="bg-blue-100 p-4 rounded-lg hover:shadow">
              <h2 className="text-xl font-semibold mb-2">Agencies</h2>
              <p>View and manage agencies</p>
            </Link>
            <Link href="/dashboard/admin/clients" className="bg-green-100 p-4 rounded-lg hover:shadow">
              <h2 className="text-xl font-semibold mb-2">Clients</h2>
              <p>Manage clients</p>
            </Link>
            <Link href="/dashboard/admin/reservations" className="bg-yellow-100 p-4 rounded-lg hover:shadow">
              <h2 className="text-xl font-semibold mb-2">Reservations</h2>
              <p>View and manage reservations</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

