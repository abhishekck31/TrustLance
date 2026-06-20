'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchMutation, SearchQuery } from '@tanstack/react-query';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent,SelectItem, SelectTrigger } from '@/components/ui/select';

interface Category {
  id: number;
  name: string;
}

interface Listing {
  id: number;
  title: string;
  price: number;
  categoryName: string;
  sellerAddress: string;
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['marketplaceData'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  const mutations = useSearchMutation();

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory('category_' + categoryId);
    setListings([]); // Clear listings when category changes
  };

  // Fetch Listings based on the selected category
  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/categories?category=${selectedCategory}`)
        .then(res => res.json())
        .then(data => setListings(data))
        .catch(err => setError('Failed to load listings'));
    } else {
      setListings([]);
    }
  }, [selectedCategory]);

  if (loading) return <div>Loading Marketplace...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900">TrustLance Marketplace</h1>
        <p className="text-gray-600 mt-2">Discover and trade digital assets across categories.</p>
      </header>

      {/* Category Selection */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            {query.data?.categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Listings Display */}
      {listings.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Listings in {selectedCategory?.split('_')[1] || 'Marketplace'}</h2>
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-blue-600">{listing.title}</h3>
                <p className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    listing.status === 'Sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {listing.status}
                </p>
              </div>
              <p className="text-gray-600 mb-4">Category: {listing.categoryName}</p>
              <div className="flex justify-between items-end border-t pt-3">
                <div className="text-xl font-extrabold text-red-600">
                  Price: ${listing.price.toFixed(2)} ETH/Token
                </div>
                <Button onClick={() => console.log(`View details for listing ${listing.id}`)}>View Details</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No listings found for this category.</p>
        </div>
      )}
    </div>
  );
}