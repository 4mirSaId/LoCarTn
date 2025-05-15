'use client'
import Link from 'next/link'
import React from 'React'
import {useEffect, useState} from 'React'
import {useRouter} from 'next/navigation'

const Navbar: react.FC = () => {
    const [userRole, setUserRole]=useState<string | null>(null);
    const router = useRouter();

    useEffect(() =>{
        const storedRole = localStorage.getItem("userRole");
        setUserRole(storedRole);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.romoveItem("userRole");
        setUserRole(null);
        router.push('/login');
    };

    return (
        <nav className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <Link href="/" className="text-xl font-bold text-blue-600">LoCarTn</Link>
            <div className="space-x-4">{!userRole && (
                <>
                <Link href="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
                <Link href="/Register" className="text-gray-700 hover:text-blue-500">Register</Link>
                </>
            )}
            {userRole === "admin" && (
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            )}
            {userRole === "agency" && (
                <Link href="/agency/dashbord" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            )}
            {userRole === "client" && (
                <Link href="/agency/dashbord" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            )}
            {userRole && (
                <button onClick={handleLogout} className="text-red-500 hover:underline ml-4">
                    Logout
                </button>
            )}
            </div>
        </nav>
    );
};

export default Navbar;