// app/blog/[id]/[slug]/page.tsx
import { Metadata, ResolvingMetadata } from 'next'
import BlogDetailTwo from '../BlogDetailTwo'
import { getBlog } from '@/actions/blog-ssr'; // Your API fetch function
import BlogDetailSkeleton from '../BlogDetailSkeleton';
import { Suspense } from 'react';

type Props = {
  params: {
    id: string
    slug: string
  }
}

// Set up revalidation
export const revalidate = 3600; // Revalidate every hour


// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const blog = await getBlog(params.id);
    
    return {
      title: blog.title,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        images: blog.cover_image ? [blog.cover_image] : [],
      },
    }
  }

// This is the main page component
export default async function Page({ params }: Props) {
  const { id, slug } = params
  
  // Fetch the blog post
  const post = await getBlog(id)
  
  // Verify the slug matches
  const correctSlug = generateSlug(post.title)
  
  // If the slug doesn't match, you might want to redirect
  if (slug !== correctSlug) {
    return {
      redirect: {
        destination: `/blog/${id}/${correctSlug}`,
        permanent: true,
      },
    }
  }

  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetailTwo params={params} />
    </Suspense>
  );
}

// Helper function to generate slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}