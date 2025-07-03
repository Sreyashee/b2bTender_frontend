'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company_name: '',
    industry: '',
    industry_description: '',
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (logo) formData.append('logo', logo);

    try {
      await axios.post('https://b2btender-backend.onrender.com/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
  <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
    <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Your Account</h1>

    {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
    {success && <p className="text-green-600 text-sm text-center mb-2">Signup successful!</p>}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password (atleast 6 letter)"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
      <input
        name="company_name"
        placeholder="Company Name"
        value={form.company_name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
      <input
        name="industry"
        placeholder="Industry"
        value={form.industry}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
      <textarea
        name="industry_description"
        placeholder="Industry Description"
        value={form.industry_description}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Company Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Create Account
      </button>
    </form>
  </div>
);

}
