'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCar, resetCarState } from '../../redux/carSlice';

interface AddCarFormProps {
  onCarAdded: () => void;
}

const AddCarForm = ({ onCarAdded }: AddCarFormProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.car);
  const [form, setForm] = useState<{
    brand: string;
    model: string;
    year: string;
    pricePerDay: string;
    caution: string;
    location: string; // <-- add location
    image: File | null;
  }>({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    caution: '',
    location: '', // <-- add location
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // Remove agency from form state, since backend sets it from req.user._id
  }, [user]);

  useEffect(() => {
    if (success) {
      setForm({ brand: '', model: '', year: '', pricePerDay: '', caution: '', location: '', image: null });
      setImagePreview(null);
      onCarAdded();
      dispatch(resetCarState());
    }
  }, [success, onCarAdded, dispatch]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!token) {
      setValidationError('You must be logged in as an agency to add a car.');
      return;
    }
    if (!form.brand || !form.model || !form.year || !form.pricePerDay || !form.caution || !form.location || !form.image) {
      setValidationError('All fields are required.');
      return;
    }
    const formData = new FormData();
    formData.append('brand', form.brand);
    formData.append('model', form.model);
    formData.append('year', form.year);
    formData.append('pricePerDay', form.pricePerDay);
    formData.append('caution', form.caution);
    formData.append('location', form.location); // <-- add location
    formData.append('image', form.image);
    dispatch(addCar({ formData, token }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {validationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
            {validationError}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-2">
            Car added successfully!
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
              Price/Day (Dt) *
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
          {/* Caution Input */}
          <div>
            <label htmlFor="caution" className="block text-sm font-medium text-gray-700 mb-1">
              Caution (Dt) *
            </label>
            <input
              id="caution"
              name="caution"
              type="number"
              min="1"
              step="0.01"
              value={form.caution}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
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