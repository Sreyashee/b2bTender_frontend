'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [showApply, setShowApply] = useState(false);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [proposal, setProposal] = useState('');

  useEffect(() => {
    axios.get('/tenders/others')
      .then((res) => setTenders(res.data.tenders))
      .catch(() => alert('Failed to load tenders'));
  }, []);

  const handleApply = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    setShowApply(true);
  };

const submitApplication = async () => {
  if (!selectedTenderId) {
    alert('No tender selected');
    return;
  }

  try {
    const res = await axios.post(`/tenders/${selectedTenderId}/apply`, {
      proposal_text: proposal,
    });
    alert('Proposal submitted ✅');
    setShowApply(false);
    setProposal('');
  } catch (err: any) {
    alert('❌ Submission failed');
    console.error('Submit error:', err); // Log full error object
    console.log('Selected tender ID:', selectedTenderId);
    console.log('Proposal text:', proposal);
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">📂 Available Tenders</h1>

  {tenders.length === 0 ? (
    <p className="text-center text-gray-500 italic">No tenders available at the moment.</p>
  ) : (
    tenders.map((tender, idx) => (
      <div
        key={tender.id || idx}
        className="border border-gray-200 p-5 rounded-lg bg-gray-50 hover:shadow transition duration-200 mb-6"
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-1">{tender.title}</h2>
        <p className="text-sm text-gray-700">{tender.description}</p>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <div>
            <strong>💰 Budget:</strong> ₹{tender.budget}
          </div>
          <div>
            <strong>📅 Deadline:</strong>{' '}
            {new Date(tender.deadline).toLocaleDateString()}
          </div>
        </div>

        <button
          onClick={() => handleApply(tender.id)}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </div>
    ))
  )}



      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative">
            <button
              onClick={() => setShowApply(false)}
              className="absolute top-2 right-3 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Submit Proposal</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Write your proposal..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />
            <button
              onClick={async () => {
                const result = await submitApplication();
                // if (result === true) {
                //   alert('Proposal submitted successfully!');
                // } else if (result === false) {
                //   alert('❌ Submission failed');
                // }
              }}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
