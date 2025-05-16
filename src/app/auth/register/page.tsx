'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
        const res = await fetch('http://localhost:7000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            const data = await res.json()
            // Handle successful login (e.g., redirect, show success message)
            console.log('Register successful:', user)
            if (user.role === 'admin') {
                router.push('/dashboard/admin');
            } else if (user.role === 'client') {
                router.push('/dashboard/client');
            } else if (user.role === 'agency') {
                router.push('/dashboard/agency');
            }
        } else {
            console.error('Login failed:', user);
        }
        } catch (error) {
        console.error('Error during login:', error);
        } finally {
        setLoading(false);
    }
}

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                    value={formData.role}
                    onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">You are a :</option>
                    <option value="agency">Agency</option>
                    <option value="client">Client</option>
                </select>
                <p className="block text-sm font-medium text-gray-700">Already have an account ? </p><Link href="/auth/login" className="">Login</Link>
                <button type="submit" 
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}>
                    {loading ? 
                    (<div className="w-5 h-5 border-2 border-white border-t-transparent rouned-full animate-spin"></div>): ('Register')}
                </button>
            </div>
        </form>
    )
}