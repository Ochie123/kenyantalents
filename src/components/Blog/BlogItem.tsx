'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { BlogType } from '@/type/BlogType'
import { useRouter } from 'next/navigation'
import { getBlog } from '@/actions/blog-ssr';

// Custom hook to handle intersection observer
const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const ref = useRef(null);
  
    useEffect(() => {
      if (!ref.current) return;
  
      const observer = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting);
      }, options);
  
      observer.observe(ref.current);
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref, options]);
  
    return [ref, isIntersecting];
  };
  
  // Prefetch manager specifically for blog content
  const BlogPrefetchManager = {
    cache: new Map<string, any>(),
    
    prefetch: async (blogId: string) => {
      if (BlogPrefetchManager.cache.has(blogId)) return;
      
      try {
        const data = await getBlog(blogId);
        BlogPrefetchManager.cache.set(blogId, data);
      } catch (error) {
        console.error('Error prefetching blog:', error);
      }
    }
  };
  
  // Modified BlogItem component with prefetching
  interface BlogItemProps {
    data: BlogType;
    type: string;
  }


const BlogItem: React.FC<BlogProps> = ({ data, type }) => {
    const router = useRouter();
    const [ref, isIntersecting] = useIntersectionObserver({
      rootMargin: '50px',
      threshold: 0.1,
    });
  
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    };
  
    const handleBlogClick = (blogId: string, title: string) => {
      const slug = generateSlug(title);
      router.push(`/blog/${blogId}/${slug}`);
    };
  
    // Prefetch when the blog item comes into view
    useEffect(() => {
      if (isIntersecting) {
        BlogPrefetchManager.prefetch(data.id.toString());
      }
    }, [isIntersecting, data.id]);
  
    const handleMouseEnter = () => {
      BlogPrefetchManager.prefetch(data.id.toString());
    };
  
    const truncateDescription = (description: string, maxLength: number) => {
      if (description.length <= maxLength) return description;
      return description.slice(0, maxLength) + '...';
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
      });
  };

    const defaultImage = '/images/other/404-img.png';
    
    if (type === "featured") {
        return (
            <div 
                className="max-w-full flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-11 bg-white shadow-sm rounded-sm p-4 lg:p-2 mb-8 cursor-pointer"
                onClick={() => handleBlogClick(data.id.toString(), data.title)}
            >
                <div className="lg:max-w-[650px] w-full">
                <Image
                    src={data.cover_image && data.cover_image.length > 0 ? data.cover_image : defaultImage}
                    width={536}
                    height={320}
                    alt={data.title}
                    className='w-full duration-500 flex-shrink-0'
                    priority={isIntersecting} // Prioritize loading for visible images
                />
                </div>
                <div className="lg:max-w-[540px] w-full">
                    <h1 className="font-bold text-2xl xl:text-3xl text-black mb-4">
                        {data.title}
                    </h1>
                    <p className="max-w-[524px]">{data.excerpt}</p>
                    <div className="flex items-center gap-2 mt-5 text-gray-500">
                        <div className="flex items-center gap-3">
                            <p className="text-sm">By {data.user_full_name}</p>
                        </div>
                        <span className="flex w-[3px] h-[3px] rounded-full bg-gray-500"/>
                        <p className="text-sm">{formatDate(data.publish)}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (type === "grid") {
        return (
            <div 
                className="flex flex-col bg-white shadow-1 rounded-sm overflow-hidden cursor-pointer h-full"
                onClick={() => handleBlogClick(data.id.toString(), data.title)}
            >
                <div className="aspect-w-16 aspect-h-9 w-full">
                    <Image
                        src={data.cover_image || defaultImage}
                        alt={data.title}
                        width={238}
                        height={180}
                        className="w-full h-48 object-cover"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="inline-flex text-blue-500 bg-blue-500/[0.08] font-medium text-sm py-1 px-3 rounded-full mb-4 self-start">
                        {data.category_title}
                    </div>
                    <h2 className="font-semibold text-lg text-black mb-3 flex-grow">
                        {data.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-auto text-gray-500">
                        <div className="flex items-center gap-3">
                            <p className="text-sm">By {data.user_full_name}</p>
                        </div>
                        <span className="flex w-[3px] h-[3px] rounded-full bg-gray-500"/>
                        <p className="text-sm">{formatDate(data.publish)}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (type === "recent") {
        return (
            <div 
                className="item flex gap-4 mt-5 cursor-pointer bg-white shadow-sm rounded-sm p-2"
                onClick={() => handleBlogClick(data.id.toString(), data.title)}
            >
                <Image
                    src={data.cover_image || defaultImage}
                    width={500}
                    height={400}
                    alt={data.title}
                    className="w-20 h-20 object-cover flex-shrink-0"
                />
                <div>
                    <div className="blog-tag whitespace-nowrap bg-green-500/[0.08] text-green-500 py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">
                        {data.category_title}
                    </div>
                    <div className="text-title mt-1">
                        {data.title}
                    </div>
                </div>
            </div>
        )
    }

    return null;
}

export default BlogItem;