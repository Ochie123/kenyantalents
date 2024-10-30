"use client";
import useSWR from 'swr';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import debounce from 'lodash.debounce';
import { MotionDiv } from './animation/Animate';
import BlogItem from '@/components/Blog/BlogItem';

// Function to fetch posts based on the search query
const fetchPosts = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const Search = ({ mount, onClose }) => {
  const searchInputRef = useRef();
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const encodedSearchQuery = encodeURIComponent(query || '');
  const url = query ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kgt.inventoryr.online'}/api/blogs/?search=${encodedSearchQuery}` : null;

  const { data, isLoading, error: swrError } = useSWR(url, fetchPosts, { revalidateOnFocus: false });
  const posts = data?.results || [];

  useEffect(() => {
    if (swrError) {
      setError('Something went wrong. Please try again.');
    }
  }, [swrError]);

  // Debounce function to limit API calls as user types
  const debouncedSearch = useMemo(() => debounce((searchQuery) => setQuery(searchQuery), 300), []);

  const handleInputChange = (e) => {
    const searchQuery = e.target.value;
    debouncedSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push(`/search-result?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <MotionDiv 
      initial={{scale: 0.5, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{duration: 0.5}}
      onClick={(e) => e.stopPropagation()} 
      className='relative border rounded-lg h-[60vh] max-w-[700px] w-full bg-background text-foreground overflow-hidden overflow-y-scroll shadow'
    >
      <div>
        <div className='mb-8'>
          <Input
            ref={searchInputRef}
            placeholder='Search'
            className=''
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
        </div>
        {error && <p className='w-full text-center text-red-500 mb-2'>{error}</p>}
        <hr />
        <div className='mt-8 px-2 w-full'>
          {isLoading ? (
            <Skeleton />
          ) : posts?.length > 0 ? (
            posts.map((post, index) => (
              <BlogItem key={post.id} post={post} data={post} index={index} type="recent"/>
            ))
          ) : (
            <p className='w-full text-center'>No result found</p>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

// A separate component to render each post item, to keep the main component cleaner
const PostItem = ({ post, index, onClick }) => (
  <MotionDiv 
    initial={{ x: -10, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 * index }}
    viewport={{ once: true }}
    onClick={onClick}
    className='w-full cursor-pointer px-2 pt-1 mb-4 flex items-center gap-6'
  >
    <Image src={post.img} alt='post image' width={80} height={80} className='rounded-lg object-cover min-h-full w-full hidden sm:flex' priority />
    <div className='flex flex-col justify-center gap-2'>
      <h2 className='sm:line-clamp-1 line-clamp-2 text-sm md:text-xl font-bold'>{post.title}</h2>
      {post.user && (
        <div className='flex items-center gap-2'>
          <Image src={post.user.image} alt='user image' width={20} height={20} priority className='rounded-full object-cover'/>
          <p className='text-xs md:text-sm text-gray-400 capitalize'>{post.user.name}</p>
        </div>
      )}
    </div>
  </MotionDiv>
);

export default Search;