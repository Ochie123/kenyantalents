'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import HandlePagination from '@/components/Other/HandlePagination';
import { useSearchPosts } from '@/actions/blog';
import Image from 'next/image';
//import LiveSearch from '@/components/Header/New/LiveSearch';
import "../globals.css";

const defaultImage = '/images/other/404-img.png';

const SearchResult = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 20;
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const {
    searchResults,
    searchLoading,
    searchError,
    totalCount
  } = useSearchPosts(query);

  useEffect(() => {
    setCurrentPage(0);
  }, [query]);

  // Calculate pagination
  const pageCount = Math.ceil(totalCount / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = searchResults.slice(offset, offset + productsPerPage);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const handleBlogClick = (id) => {
    router.push(`/blog/${id}`);
  };

  return (
    <>
      <div className='blog grid md:py-20 py-10 pb-8 sm:pt-[30px]'>
        <div className="container">
          {/* Add the LiveSearch component here <div className="mb-8">  <LiveSearch />  </div>*/}
  
          <div className="heading flex flex-col items-center mb-6 pt-10">
            {searchLoading ? (
              <div className="heading4 text-center">Searching...</div>
            ) : searchError ? (
              <div className="heading4 text-center text-red-500">Error occurred while searching</div>
            ) : (
              <div className="heading4 text-center">
                Found {totalCount} results for <strong>'{query}'</strong>
              </div>
            )}
          </div>

          {searchLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="loading-spinner">Loading...</div>
            </div>
          ) : searchError ? (
            <div className="text-center text-red-500">
              An error occurred while fetching search results. Please try again later.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-gray-500">
              No blog posts match your search criteria.
            </div>
          ) : (
            <>
              <div className="list-blog grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                {currentProducts.map(item => (
                  <div className="item flex gap-4 mt-5 cursor-pointer" key={item.id} onClick={() => handleBlogClick(item.id)}>
                    <Image
                      src={item.cover_image && item.cover_image.length > 0 ? item.cover_image : defaultImage}
                      width={500}
                      height={400}
                      alt={item.title}
                      className='w-20 h-20 object-cover rounded-lg flex-shrink-0'
                    />
                    <div>
                      <div className="blog-tag whitespace-nowrap bg-green py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">
                        {item.category_title}
                      </div>
                      <div className="text-title mt-1">
                        {truncateTitle(item.title, 220)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-10">
                  <HandlePagination 
                    pageCount={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResult;