'use client'
import Link from 'next/link'
import React from 'react'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'

const Navbar:React.FC = () => {
    const [userRole, setUserRole]=useState(null);
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
        <nav className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg flex items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold text-blue-600">LoCarTn</Link>
            <Link href="/about" className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">About</Link>
            <div className="space-x-4">{!userRole && (
                <>
                <Link href="/auth/login" className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex">Login</Link>
                <Link href="/auth/register" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Register</Link>
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