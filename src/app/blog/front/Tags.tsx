"use client"
import React, { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useGetPosts, useCategories, useTags } from '@/actions/blog';


const Tags = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentTag = searchParams.get('tags');
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { tags, isLoading: tagsLoading } = useTags();

    const { posts, postsLoading, totalCount } = useGetPosts({
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

   


    return (
<>
<div className='container'>
<div className="filter-tags md:mt-10 mt-6">
<div className="heading6">Tags Cloud</div>
<div className="list-tags flex items-center flex-wrap gap-3 mt-4">
    {tags.map(tag => (
        <div
            key={tag.id}
            className={`tag ${currentTag === tag.id.toString() ? 'active' : ''}`}
            onClick={() => handleTagClick(tag.id)}
        >
            {tag.title}
        </div>
    ))}
</div>
</div>
</div>
</>
    )
}

export default Tags;