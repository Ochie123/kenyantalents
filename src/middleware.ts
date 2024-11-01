// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBlog } from '@/actions/blog-ssr'; // Your API fetch function

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Redirect to login if accessing dashboard without a token
  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing login with a token
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if this is a blog detail page without a slug
  const blogMatch = request.nextUrl.pathname.match(/^\/blog\/(\d+)$/)
  
  if (blogMatch) {
    const id = blogMatch[1]
    
    try {
      // Fetch the post to get its title
      const post = await getBlog(id)
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      // Redirect to the URL with slug
      return NextResponse.redirect(
        new URL(`/blog/${id}/${slug}`, request.url)
      )
    } catch (error) {
      // If post not found, continue to 404 page
      return NextResponse.next()
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/blog/:id'],
  //matcher: '/blog/:id',
};