
'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tenderForm, setTenderForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [tenders, setTenders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch user info
    type User = {
  id: string;
  name: string;
  email: string;
  company_name: string;
  industry: string;
  industry_description: string;
  logo?: string;
};
    const [user, setUser] = useState<User | null>(null);

   axios
  .get('/api/dashboard/me')
  .then((res: { data: { user: User } }) => setUser(res.data.user))
  .catch(() => {
    localStorage.removeItem('token');
    router.push('/login');
  });


    // Fetch my tenders
    axios
      .get('/tenders/my')
      .then((res) => setTenders(res.data.tenders))
      .catch((err) => console.error('Tenders load failed', err))
      .finally(() => setLoading(false));
  }, []);

  const handleTenderInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTenderForm({ ...tenderForm, [e.target.name]: e.target.value });
  };

  const handleTenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure deadline is in yyyy-mm-dd format
      let formattedDeadline = tenderForm.deadline;
      // If deadline is in dd-mm-yyyy, convert to yyyy-mm-dd
      if (/^\d{2}-\d{2}-\d{4}$/.test(formattedDeadline)) {
        const [day, month, year] = formattedDeadline.split('-');
        formattedDeadline = `${year}-${month}-${day}`;
      }

      const payload = {
        ...tenderForm,
        deadline: formattedDeadline,
        budget: Number(tenderForm.budget),
      };

      await axios.post('/tenders', payload);
      alert('Tender created successfully!');
      setShowModal(false);
      setTenderForm({ title: '', description: '', budget: '', deadline: '' });

      const res = await axios.get('/tenders/my');
      setTenders(res.data.tenders);
    } catch (err) {
      console.error('Tender creation failed', err);
      alert('Failed to create tender');
    }
  };


  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(`/tenders/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.tenders || []);
    } catch (err) {
      console.error('Search failed', err);
      alert('Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) return <p className="p-6">Loading...</p>;
return (
<div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
  <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-blue-800 tracking-tight">
    Welcome, {user?.name}
  </h1>

  {/* 👤 Profile Information Card */}
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
    <div className="text-gray-700 text-lg">
      <span className="font-semibold text-gray-800">Email:</span> {user?.email}
    </div>
    <div className="text-gray-700 text-lg">
      <span className="font-semibold text-gray-800">Company Name:</span> {user?.company_name}
    </div>
    <div className="text-gray-700 text-lg">
      <span className="font-semibold text-gray-800">Industry:</span> {user?.industry}
    </div>
    <div className="text-gray-700 text-lg">
      <span className="font-semibold text-gray-800">Description:</span> {user?.industry_description}
    </div>
    
    {user?.logo && (
      <div>
        <span className="font-semibold text-gray-800 block mb-1">Logo:</span>
        <div className="border rounded-md overflow-hidden w-32 h-32 bg-white shadow-sm">
          <img
            src={user.logo}
            alt="Company Logo"
            className="object-contain w-full h-full p-2"
          />
        </div>
      </div>
    )}
  </div>



    {/* 🔍 Search Section */}
    <div className="mb-10 pt-10">
      <form onSubmit={handleSearch}>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenders by tender name"
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* 🔍 Results */}
      {searchResults.length > 0 && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">🔍 Search Results</h2>
    <div className="space-y-6">
      {searchResults.map((tender) => (
        <div
          key={tender.id || `${tender.title}-${Math.random()}`}
          className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold text-blue-800">{tender.title}</h3>
          <p className="text-gray-600 mt-1">{tender.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-sm text-gray-700">
            <span><strong>💰 Budget:</strong> ₹{tender.budget}</span>
            <span><strong>📅 Deadline:</strong> {new Date(tender.deadline).toLocaleDateString()}</span>
            {tender.users && (
              <>
                <span><strong>🏢 Company:</strong> {tender.users.company_name}</span>
                <span><strong>🌐 Industry:</strong> {tender.users.industry}</span>
              </>
            )}
          </div>

      
        </div>
      ))}
    </div>
  </div>
)}

{searchQuery && !isSearching && searchResults.length === 0 && (
  <p className="text-center text-gray-500 mt-6 italic">
    No tenders found matching <strong>"{searchQuery}"</strong>
  </p>
)}
</div>

    {/* ➕ Create Tender */}
    <button
      onClick={() => setShowModal(true)}
      className="w-full mb-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Create Tender
    </button>

    {/* 📋 My Tenders */}
 <div className="space-y-6 mb-12">
  <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 My Tenders</h2>

  {tenders.length === 0 ? (
    <p className="text-center text-sm text-gray-500 italic">You haven't created any tenders yet.</p>
  ) : (
    tenders.map((tender) => (
      <div
        key={tender.id || `${tender.title}-${Math.random()}`}
        className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
      >
        <h3 className="text-lg font-semibold text-blue-800">{tender.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{tender.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">💰 Budget:</span> ₹{tender.budget}
          </div>
          <div>
            <span className="font-medium">📅 Deadline:</span> {new Date(tender.deadline).toLocaleDateString()}
          </div>
        </div>
      </div>
    ))
  )}
</div>


    {/* 🌍 Navigation */}
    <div className="flex flex-col gap-3">
      <button
        onClick={() => router.push('/tenders')}
        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        View Other Tenders
      </button>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>

    {/* 🪟 Create Tender Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-3 text-xl font-bold text-gray-700"
          >
            ×
          </button>
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Create New Tender
          </h2>
          <form onSubmit={handleTenderSubmit} className="space-y-4">
            <input
              name="title"
              value={tenderForm.title}
              onChange={handleTenderInput}
              placeholder="Tender Title"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
              required
            />
            <textarea
              name="description"
              value={tenderForm.description}
              onChange={handleTenderInput}
              placeholder="Tender Description"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              name="budget"
              value={tenderForm.budget}
              onChange={handleTenderInput}
              placeholder="Budget (in INR)"
              type="number"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              name="deadline"
              type="date"
              value={
                tenderForm.deadline
                  ? (() => {
                      // Normalize to yyyy-mm-dd for input type="date"
                      const d = tenderForm.deadline;
                      if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
                        // If dd-mm-yyyy, convert to yyyy-mm-dd
                        const [day, month, year] = d.split('-');
                        return `${year}-${month}-${day}`;
                      }
                      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
                        // Already yyyy-mm-dd
                        return d;
                      }
                      return '';
                    })()
                  : ''
              }
              onChange={handleTenderInput}
              placeholder="Deadline (YYYY-MM-DD)"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
              required
              pattern="\d{4}-\d{2}-\d{2}"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Submit Tender
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);

}
