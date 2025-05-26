'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from '../../../../../axios';
import { useAuthStore } from '@/store/isAuth';

interface AddCarFormProps {
  onCarAdded: () => void;
}

const AddCarForm = ({ onCarAdded }: AddCarFormProps) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [form, setForm] = useState<{
    brand: string;
    model: string;
    year: string;
    pricePerDay: string;
    image: File | null;
  }>({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Remove agency from form state, since backend sets it from req.user._id
  }, [user]);


  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      const file = files[0];
      setForm(f => ({ ...f, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(typeof reader.result === 'string' ? reader.result : null);
      };
      reader.readAsDataURL(file);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!token) {
      setError('You must be logged in as an agency to add a car.');
      setIsSubmitting(false);
      return;
    }
    try {
      const data = new FormData();
      data.append('brand', form.brand);
      data.append('model', form.model);
      data.append('year', form.year);
      data.append('pricePerDay', form.pricePerDay);
      if (form.image) data.append('image', form.image);

      const response = await axios.post('/api/cars', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && (response.data.error || response.data.message)) {
        setError(
          typeof response.data.error === 'object'
            ? JSON.stringify(response.data.error)
            : response.data.error || response.data.message
        );
        setSuccess(null);
      } else {
        setError(null);
        setSuccess('Car added successfully!');
        setForm({ brand: '', model: '', year: '', pricePerDay: '', image: null });
        setImagePreview(null);
        onCarAdded();
      }
    } catch (err) {
      // TypeScript-safe error handling
      let errData: any = null;
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response
      ) {
        // @ts-expect-error: dynamic error shape from axios
        errData = err.response.data;
      }
      if (errData) {
        setError(
          typeof errData.error === 'object'
            ? JSON.stringify(errData.error)
            : errData.error || errData.message || 'Failed to add car'
        );
        setSuccess(null);
      } else {
        setError('Failed to add car');
        setSuccess(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Car</h2>
      

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-2">
            {success}
          </div>
        )}
        {/* Brand Input */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={form.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Model Input */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model *
          </label>
          <input
            id="model"
            name="model"
            type="text"
            value={form.model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Year Input */}
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
              value={form.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price Input */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price/Day ($) *
            </label>
            <input
              id="price"
              name="pricePerDay"
              type="number"
              min="1"
              step="0.01"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Car Image *
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          {imagePreview && (
            <div className="mt-3">
              <Image
                width={200}
                height={200}
                src={imagePreview || ''}
                alt="Car preview"
                className="h-40 w-full object-contain rounded border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Image Preview</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
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
    </div>
  );
};

export default AddCarForm;