'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import HandlePagination from '@/components/Other/HandlePagination';
import { useGetPosts, useCategories, useTags } from '@/actions/blog';
import BlogItem from '@/components/Blog/BlogItem';

const BlogGridF = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 20;
    const offset = currentPage * productsPerPage;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentTag = searchParams.get('tags');
    
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { tags, isLoading: tagsLoading } = useTags();

    const { posts, postsLoading, totalCount } = useGetPosts({
        page: currentPage + 1,
        order_by: '-publish',
        ...(currentCategory ? { category: currentCategory } : {}),
        ...(currentTag ? { tags: currentTag } : {}),
    });

    const handleBlogClick = (blogId: string) => {
        router.push(`/blog/${blogId}`);
    };

    const handleTagClick = (tagId: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        
        if (tagId) {
            current.set('tags', tagId.toString());
        } else {
            current.delete('tags');
        }
        
        const search = current.toString();
        const query = search ? `?${search}` : '';
        
        router.push(`${pathname}${query}`);
    };

    useEffect(() => {
        if (postsLoading || categoriesLoading || tagsLoading) {
            // Display a skeleton loading state
            return (
                <div className='blog grid md:py-20 py-10 sm:pt-[200px]'>
                    <div className="container">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    }, [postsLoading, categoriesLoading, tagsLoading]);

    if (!posts || posts.length === 0) {
        return (
            <div className='blog grid md:py-20 py-10 sm:pt-[200px]'>
                <div className="container">
                    <div className="flex justify-center items-center h-screen">
                        No blog posts match your filter criteria.
                    </div>
                </div>
            </div>
        );
    }

    const pageCount = Math.ceil(totalCount / productsPerPage);
    const currentProducts = posts.slice(offset, offset + productsPerPage);
    const defaultImage = '/images/other/404-img.png';

    // Separate featured post and regular posts
    const [featuredPost, ...regularPosts] = currentProducts;

    return (
        <div className='blog list md:py-10 py-1 pt-20'>
            <div className="flex justify-between max-xl:flex-col gap-y-12">
                <div className="left xl:w-3/4 xl:pr-2">
                    {/* Featured Post */}
                    {featuredPost && (
                        <BlogItem 
                            data={featuredPost} 
                            type="featured"
                        />
                    )}

                    {/* Regular Posts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {regularPosts.map(item => (
                            <BlogItem 
                                key={item.id}
                                data={item}
                                type="grid"
                            />
                        ))}
                    </div>

                    {pageCount > 1 && (
                        <div className="list-pagination w-full flex items-center md:mt-10 mt-6">
                            <HandlePagination
                                pageCount={pageCount}
                                onPageChange={(selected: number) => setCurrentPage(selected)}
                            />
                        </div>
                    )}
                </div>

                {/* Recent Posts in Sidebar */}
                <div className="list-recent pt-1">
                    {posts.slice(1, 6).map(item => (
                        <BlogItem 
                            key={item.id}
                            data={item}
                            type="recent"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogGridF;