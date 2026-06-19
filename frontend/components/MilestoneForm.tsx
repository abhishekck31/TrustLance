import React, { useState } from 'react';

interface MilestoneFormProps {
  onSubmit: (milestoneData: { title: string; description: string | null; progress: number }) => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || progress === undefined || progress < 0 || progress > 100) {
      setError('Please fill in all required fields correctly.');
      return;
    }
    setError('');
    onSubmit({ title, description, progress: Number(progress) });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit New Milestone</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Milestone Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="progress" className="block text-sm font-medium text-gray-700">Progress (%)</label>
        <input
          id="progress"
          type="number"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
          max="100"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Milestone
      </button>
    </form>
  );
};

export default MilestoneForm;