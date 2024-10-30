import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useSearchPosts } from '@/actions/blog';

const LiveSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const router = useRouter();

  const {
    searchResults,
    searchLoading,
    searchError,
    totalCount
  } = useSearchPosts(debouncedSearch);

  // Handle input change for live search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission for navigation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-result?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search posts..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* Live search results dropdown */}
      {searchTerm && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : searchError ? (
            <div className="p-4 text-center text-red-500">Error loading results</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : (
            <div className="py-2">
              {searchResults.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/blog/${item.id}`)}
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.category_title}</div>
                </div>
              ))}
              {totalCount > 5 && (
                <div
                  className="px-4 py-2 text-center text-blue-500 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/search-result?query=${encodeURIComponent(searchTerm)}`)}
                >
                  View all {totalCount} results
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveSearch;