'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlog } from '@/actions/blog-ssr';
import { useGetPosts } from '@/actions/blog';
import Social from '@/components/helpers/Socials';

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
}

// Fetch blog data in SSR and pass it to a client component
export default async function BlogDetailPage({ params }: Props) {
  const { id } = params;
  const blog = await getBlog(id);

  return <BlogDetailTwo blog={blog} />;
}

// Separate client component to handle client-side fetching and rendering
function BlogDetailTwo({ blog }: { blog: Blog }) {
  const router = useRouter();
  const defaultImage = '/images/other/404-img.png';

  const { posts, postsLoading, totalCount } = useGetPosts({
    order_by: '-publish',
  });

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.slice(0, maxLength) + '...';
  };
  
  const handleBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
};

  return (
    <>
      <div className='container'>
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

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.description }}></div>

            {/* Tags */}
            <div className="flex items-center gap-4 mt-8 flex-wrap">
              <span className="font-medium">Tags:</span>
              {blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tag.title}
                </span>
              ))}
            </div>
            <div className="pages font-medium hidden gap-8 lg:flex mt-4">Recent Posts</div>
            <div className="list-recent pt-1">
            
           


                                    {posts.slice(0, 5).map(item => (
                                        <div className="item flex gap-4 mt-5 cursor-pointer" key={item.id} onClick={() => handleBlogClick(item.id)}>
                                            <Image
                                                src={item.cover_image}
                                                width={500}
                                                height={400}
                                                alt={item.title}
                                                className='w-20 h-20 object-cover rounded-lg flex-shrink-0'
                                            />
                                            <div>
                                                <div className="blog-tag whitespace-nowrap bg-green py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">{item.tag}</div>
                                                <div className="text-title mt-1">{truncateTitle(item.title, 80)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

            {/* Share buttons */}
            <div className="flex items-center gap-4 mt-8">
              <span className="font-medium">Share:</span>
              
              <div className="flex gap-3">
              <Social socialName={blog.title} className="social-icons" />
              </div>
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
                    <p className="text-gray-500">245 Likes</p>
                    <button className="mt-2 px-4 py-1 border rounded-full text-sm hover:bg-gray-50">
                      Like
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">In sleek lines and soft hues I find, A story told through space, refined.</p>
              </div>

              {/* Recent Posts */}
   
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
