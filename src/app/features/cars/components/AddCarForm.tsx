// src/features/cars/components/AddCarForm.tsx
'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAddCarMutation } from '../carsApi';
import { useAuthStore } from '@/store/isAuth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Car } from '@/types/car';

export default function AddCarForm({ onSuccess }: { onSuccess?: (car: Car) => void }) {
  const [addCar, { isLoading }] = useAddCarMutation();
  const { user } = useAuthStore();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploadProgress(0);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const imageFile = formData.get('image') as File;
    const carData = {
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      pricePerDay: parseFloat(formData.get('pricePerDay') as string),
      agencyId: user?.id || '',
    };

    try {
      let imageUrl = '';
      if (imageFile.size > 0) {
        const uploadResponse = await uploadToCloudinary(
          imageFile) as string | { secure_url: string };
        imageUrl = typeof uploadResponse === 'string' ? uploadResponse : uploadResponse.secure_url;
      }

      const response = await addCar({ 
        ...carData, 
        image: imageUrl 
      }).unwrap();

      formRef.current?.reset();
      setImagePreview(null);
      setUploadProgress(null);
      
      if (onSuccess) onSuccess(response);
    } catch (err) {
      console.error('Car submission failed:', err);

      type ApiError = {
        data?: { message?: string };
        message?: string;
      };

      const errorObj = err as ApiError;

      setError(
        (typeof err === 'object' && err !== null && 'data' in err && typeof errorObj.data?.message === 'string')
          ? errorObj.data!.message!
          : (typeof err === 'object' && err !== null && 'message' in err && typeof errorObj.message === 'string')
            ? errorObj.message!
            : 'Failed to add car. Please try again.'
      );
      setUploadProgress(null);
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold">Add New Car</h2>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Model */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model *
          </label>
          <input
            id="model"
            name="model"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min="1990"
            max={new Date().getFullYear() + 1}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-1">
            Price Per Day ($) *
          </label>
          <input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            min="1"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Car Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagePreview && (
          <div className="mt-4 relative h-48 w-full">
            <Image
              src={imagePreview}
              alt="Car preview"
              fill
              className="object-contain rounded-md border border-gray-200"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        )}
        {uploadProgress !== null && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            'Add Car'
          )}
        </button>
      </div>
    </form>
  );
}