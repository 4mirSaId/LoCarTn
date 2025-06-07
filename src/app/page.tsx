'use client'
import { useRouter } from "next/navigation";
import Image from "next/image";
import About from "./about";
import { useAppSelector } from './features/redux/hooks';

export default function Home() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role === "client") {
      router.push("/cars");
    } else if (user?.role === "agency") {
      router.push("/dashboard/agency");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-[60vh] max-h-[70vh] py-2 overflow-hidden">
        <Image
          src="/Rental-Car-Industry-3127x1344.jpg"
          alt="Car Rental Hero"
          fill
          style={{ objectFit: 'cover', zIndex: 0 }}
          priority
          className="absolute inset-0 w-full h-full"
        />
        {/* Full overlay shadow for hero */}
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] w-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Welcome to LoCarTn</h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 drop-shadow-lg">Your Car Rental Solution</p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
      <About />
      <button
        onClick={handleGetStarted}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold shadow-lg mx-auto block my-8"
      >
        Get Started
      </button>
    </>
  );
}