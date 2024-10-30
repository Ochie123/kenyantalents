"use client"
import * as React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useGetPosts } from '@/actions/blog';
import BlogItem from '@/components/Blog/BlogItem';

interface Blog {
    id: string;
    thumbImg: string;
    category: string,
    title: string;
    author: string;
    date: string;
    tag: string;
    cover_image: string; // Add this if it's missing
    shortDesc: string;
    description: string,
  }
  


const NewsInsight: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(0);
  const productsPerPage = 9; // Set limit to 9

  // Fetch posts using the hook
  const { posts, postsLoading, totalCount } = useGetPosts({
    page: currentPage + 1,
    order_by: '-publish',
  });

  const handleBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  // Handle loading state
  if (postsLoading) {
    return <div>Loading...</div>;
  }

  // Handle no posts state
  if (!posts || posts.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <>
      <div className="news-block md:pt-20 pt-10">
  
          <div className="heading3 text-center">More Top Reads</div>
          <Divider />
          <div className="list-blog grid md:grid-cols-3 gap-[30px] md:mt-10 mt-6">
            
            {posts.slice(0, productsPerPage).map((blog, index) => (
              <div key={blog.id} onClick={() => handleBlogClick(blog.id)}>
                <BlogItem
                  key={index}
                  data={{
                    id: blog.id,
                    title: blog.title,
                    thumbImg: blog.cover_image || '/default-image.jpg', // Fallback image if none is provided
                    category: blog.category_title,
                    author: blog.user_full_name,
                    date: blog.publish,
                    tag: blog.tags,
                    shortDesc: blog.description
                  }}
                  type="style-default"
                />
              </div>
            ))}
          </div>
      </div>
    </>
  );
}

export default NewsInsight;
