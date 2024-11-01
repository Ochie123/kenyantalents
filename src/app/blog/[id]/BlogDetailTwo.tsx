'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getBlog } from '@/actions/blog-ssr';
import { useGetPosts } from '@/actions/blog';
import Social from '@/components/helpers/Socials';
import { Products } from '@/components/Home1/homepage';
import BlogLikes from './BlogLikes';
import EnhancedMarkdownViewer from '@/components/EnhancedMarkdownViewer';


type Props = {
  params: { id: string };
};

interface Tag {
  id: number;
  title: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface Blog {
  id: number;
  user: User;
  user_full_name: string;
  category: string;
  tags: Tag[];
  title: string;
  slug: string;
  cover_image: string;
  description: string;
  is_active: boolean;
  toprated: boolean;
  bestseller: boolean;
  publish: string;
  created: string;
  updated: string;
  status: string;
  like_count: number,
  is_liked: boolean;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Fetch blog data in SSR and pass it to a client component
export default async function BlogDetailPage({ params }: Props) {
  const { id } = params;
  const blog = await getBlog(id);

  return <BlogDetailTwo blog={blog} />;
}

// Separate client component to handle client-side fetching and rendering
function BlogDetailTwo({ blog }: { blog: Blog }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultImage = '/images/other/404-img.png';

  const [likeCount, setLikeCount] = useState(blog.like_count);
  const [isLiked, setIsLiked] = useState(blog.is_liked);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      const response = await fetch(`/api/blog/${blog.id}/toggle_like/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to toggle like');
      
      const data = await response.json();
      setLikeCount(data.like_count);
      setIsLiked(data.status === 'liked');
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBlogClick = (blogId: string, title: string) => {
    const slug = generateSlug(title);
    router.push(`/blog/${blogId}/${slug}`);
  };
  
  const { posts, postsLoading, totalCount } = useGetPosts({
    order_by: '-publish',
  });

  const handleTagClick = (tagId: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
  
    if (tagId) {
      current.set('tags', tagId.toString());
    } else {
      current.delete('tags');
    }
  
    const search = current.toString();
    const query = search ? `?${search}` : '';
  
    router.push(`/blog/front${query}`);
  };

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.slice(0, maxLength) + '...';
  };


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blog) {
      setIsLoading(false);
    }
  }, [blog]);

  if (isLoading) {
    return (

        <div className="flex flex-col lg:flex-row gap-8 pt-1">
          {/* Main Content - 7 columns */}
          <div className="lg:w-8/12">
            <div className="animate-pulse bg-gray-200 rounded-lg h-12 mb-5"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="animate-pulse bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32 mb-1"></div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-24"></div>
              </div>
            </div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-72 mb-8"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full mb-4"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full mb-4"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full mb-4"></div>
            <div className="flex items-center gap-4 mt-8 flex-wrap">
              <div className="animate-pulse bg-gray-200 rounded-full px-3 py-1 h-6 w-24"></div>
              <div className="animate-pulse bg-gray-200 rounded-full px-3 py-1 h-6 w-24"></div>
              <div className="animate-pulse bg-gray-200 rounded-full px-3 py-1 h-6 w-24"></div>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="animate-pulse bg-gray-200 rounded-full px-4 py-2 h-8 w-32"></div>
              <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-8"></div>
              <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-8"></div>
              <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-8"></div>
            </div>
            <div className="pages font-medium hidden gap-8 lg:flex mt-4 border-t border-line gap-5 py-4">
              <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32"></div>
            </div>
            <div className="list-recent pt-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="item flex gap-4 mt-5 cursor-pointer animate-pulse">
                  <div className="animate-pulse bg-gray-200 rounded-lg w-20 h-20 flex-shrink-0"></div>
                  <div>
                    <div className="animate-pulse bg-gray-200 rounded-full px-3 py-1 h-6 w-24 mb-1"></div>
                    <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-48"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - 5 columns */}
          <div className="lg:w-4/12">
            <div className="sticky top-24">
              {/* Author Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="animate-pulse bg-gray-200 rounded-full w-20 h-20"></div>
                  <div>
                    <div className="animate-pulse bg-gray-200 rounded-lg h-6 w-32 mb-1"></div>
                    <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-20"></div>
                    <div className="animate-pulse bg-gray-200 rounded-full px-4 py-1 h-8 w-24 mt-2"></div>
                  </div>
                </div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full mb-2"></div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full mb-2"></div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full mb-2"></div>
              </div>
            </div>
          </div>
        </div>
  
    );
  }

  return (
    <>
        <div className="flex flex-col lg:flex-row gap-8 pt-1">
          {/* Main Content - 7 columns */}
          <div className="lg:w-8/12">
            <h1 className="text-2xl lg:text-4xl font-bold text-black mt-4 mb-5">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Image
                  src={blog.cover_image || defaultImage}
                  alt="author"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{blog.user_full_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.publish).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Image
              src={blog.cover_image || defaultImage}
              width={1000}
              height={600}
              alt={blog.title}
              className="w-full rounded-lg mb-8"
            />

            <EnhancedMarkdownViewer content={blog.description} />

            {/* Tags */}
            <div className="flex items-center gap-4 mt-8 flex-wrap">
              <span className="font-medium">Tags:</span>
              {blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                  onClick={() => handleTagClick(tag.id)}
                >
                  {tag.title}
                </span>
              ))}
            </div>
            {/* Share buttons */}
            <div className="flex items-center gap-4 mt-8">
              <span className="font-medium">Share:</span>
              <div className="flex gap-3">
                <Social socialName={blog.title} className="social-icons" />
              </div>
            </div>
            <div className="pages font-medium hidden gap-8 lg:flex mt-4 border-t border-line gap-5 py-4">Recent Posts</div>
            <div className="list-recent pt-1">
              {posts.slice(0, 5).map((item) => (
                <div
                  className="item flex gap-4 mt-5 cursor-pointer"
                  key={item.id}
                  onClick={() => handleBlogClick(item.id, item.title)} 
                >
                  <Image
                    src={item.cover_image}
                    width={500}
                    height={400}
                    alt={item.title}
                    className="w-20 h-20 object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="blog-tag whitespace-nowrap bg-green py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">
                      {item.tag}
                    </div>
                    <div className="text-title mt-1">{truncateTitle(item.title, 80)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - 5 columns */}
          <div className="lg:w-4/12">
            <div className="sticky top-24">
              {/* Author Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={blog.cover_image || defaultImage}
                    alt={blog.user_full_name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{blog.user_full_name}</h3>
                    <div className="mt-2 px-4 py-1 border rounded-full text-sm hover:bg-gray-50">
                    <BlogLikes blog={blog}/>
                    </div>
                    <div className="flex pt-5">
                <Social socialName={blog.title} className="social-icons" />
              </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className='lg:pb-2 md:pb-1 pb-1 pt-5'>
                <Products />
                </div>
    </>
  );
}