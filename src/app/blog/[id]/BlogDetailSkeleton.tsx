// src/components/Blog/BlogDetailSkeleton.tsx
import React from 'react';

export default function BlogDetailSkeleton() {
  return (
    <div className="blog-detail relative md:py-20 py-10">
      <div className="container">
        <div className="content-main flex justify-between">
          <div className="left xl:w-4/5 lg:w-2/3 lg:pr-10">
            <div className="detail-content animate-pulse">
              {/* Cover image skeleton */}
              <div className="bg-img w-full h-[400px] bg-gray-200 rounded-2xl"></div>
              
              {/* Title and meta skeleton */}
              <div className="text-content mt-7">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                
                {/* Content paragraphs skeleton */}
                <div className="mt-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
              
              {/* Tags skeleton */}
              <div className="tag-share flex items-center justify-between flex-wrap gap-5 py-7 mt-8">
                <div className="flex items-center gap-3">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded w-20"></div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}