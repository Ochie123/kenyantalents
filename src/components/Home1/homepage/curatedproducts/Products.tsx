
import * as React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useGetPosts } from '@/actions/blog'; // Import the hook
import Product from './Product'; // Adjust the path if necessary

const Main = styled.main`
  margin: 1em;
`;

interface Blog {
  id: string;
  title: string;
  thumbImg: string;
}

function Products() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(0);
  const productsPerPage = 10;

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

  // Render the products
  return (
    <>
      <div className="page-width">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={5}>
          <Typography variant="h5" fontWeight="bold">MORE TOP READS</Typography>
        </Box>
      </div>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          py: 1,
          mt: 4,
          overflow: 'auto',
          width: 'auto',
          margin: 0,
          scrollSnapType: 'x mandatory',
          '& > *': {
            scrollSnapAlign: 'center',
          },
          '::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {posts.slice(0, productsPerPage).map((blog) => (
          <div key={blog.id} onClick={() => handleBlogClick(blog.id)}>
            <Product
              blog={{
                id: blog.id,
                title: blog.title,
                thumbImg: blog.cover_image || '/default-image.jpg', // Fallback image if none is provided
              }}
            />
          </div>
        ))}
      </Box>
    </>
  );
}

export default Products;