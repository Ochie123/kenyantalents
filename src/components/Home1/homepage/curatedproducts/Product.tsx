'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';

interface Blog {
  id: string;
  title: string;
  thumbImg: string;
}

interface ProductProps {
  blog: Blog;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const truncateTitle = (title: string, maxLength: number) => {
  if (title.length <= maxLength) {
    return title;
  }
  return title.slice(0, maxLength) + '...';
};


function Product({ blog }: ProductProps) {
  const router = useRouter();

  const handleBlogClick = (blogId: string, title: string) => {
    const slug = generateSlug(title);
    router.push(`/blog/${blogId}/${slug}`);

};
  return (
    <Card
      orientation="vertical"
      key={blog.id}
      sx={{
        gap: 2,
        '--Card-padding': (theme) => theme.spacing(1),
        width: '250px',  // Set a fixed width for the card
        height: '350px', // Set a fixed height for the card
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onClick={() => handleBlogClick(blog.id, blog.title)}
    >
        <AspectRatio
          ratio="4/3"
          variant="soft"
          sx={{
            width: '100%',
            height: 'auto',
          }}
        >
          {blog.thumbImg && (
            <img
              src={blog.thumbImg}
              className="card-img-top"
              alt={blog.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </AspectRatio>

      <Box sx={{ padding: 1 }}>
        <Typography fontWeight="xl">{truncateTitle(blog.title, 40)}</Typography>
      </Box>
    </Card>
  );
}

export default Product;
