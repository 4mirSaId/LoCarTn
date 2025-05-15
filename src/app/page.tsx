export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to LoCarTn</h1>
      <p className="text-lg text-gray-700 mb-8">Your Car Rental Solution</p>
      <a href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Get Started
      </a>
    </div>
  );
}