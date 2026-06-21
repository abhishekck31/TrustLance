// Implementing the page component with Framer Motion for content transitions.
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define a transition variant
const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export default function HomePage() {
  const router = useRouter();
  const [page, setPage] = useState('home');

  // Simple state management to trigger transitions (simulating navigation)
  const navigate = (newPage: string) => {
    setPage(newPage);
    // In a real application, this would be handled by Next.js routing, 
    // but here we use state change to demonstrate Framer Motion transitions explicitly.
    setTimeout(() => {
        router.push(`/${newPage}`);
    }, 100); // Slight delay for visual effect before route push
  };

  const itemVariants = {
    animate: {
      transition: {
        duration: 0.3, // Target transition time: 150ms - 300ms range
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* AnimatePresence is crucial for detecting when elements are removed/added */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="p-6 bg-white shadow-xl rounded-lg max-w-4xl mx-auto"
          style={{ opacity: page === 'home' ? 1 : 0 }} // Manual control for visibility during exit
        >
          {page === 'home' && (
            <>
              <h1 className="text-3xl font-bold text-indigo-600 mb-4">Welcome Home</h1>
              <p className="text-gray-700">This is the main landing page. Click navigation to see smooth transitions.</p>
              <button 
                onClick={() => navigate('about')} 
                className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              >
                Go to About Page
              </button>
            </>
          )}

          {page === 'about' && (
            <>
              <h1 className="text-3xl font-bold text-green-600 mb-4">About TrustLance</h1>
              <p className="text-gray-700">TrustLance is a cutting-edge Web3 monorepo built with Next.js, Solidity, and robust backend services.</p>
               <button 
                onClick={() => navigate('home')} 
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Go back Home
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}