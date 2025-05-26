import ClientReservationsList from './ClientReservationsList';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
        <ClientReservationsList />
      </div>
    </div>
  );
}