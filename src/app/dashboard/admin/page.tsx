// This is the admin dashboard page
// It is protected by the ProtectedRoute component
'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin-specific content */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
              <p>View and manage all users</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Manage Agencies</h2>
              <p>Approve or reject agency applications</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">System Settings</h2>
              <p>Configure application settings</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}