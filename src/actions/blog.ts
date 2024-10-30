import useSWR from 'swr';
import { useMemo } from 'react';
import type { IPostItem } from '@/types/blog';

const API_URL = 'http://127.0.0.1:8000/api/blogs/';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CategoriesResponse {
  results: Category[];
}


interface Tag {
  id: number;
  title: string;
}

interface TagsResponse {
  results: Tag[];
}

export function useTags() {
  const { data, error } = useSWR<TagsResponse>('http://127.0.0.1:8000/api/tags/', fetcher);
  
  return {
      tags: data?.results || [],
      isLoading: !error && !data,
      isError: error
  };
}

// hooks/useCategories.ts
export function useCategories() {
  const { data, error } = useSWR<CategoriesResponse>('http://127.0.0.1:8000/api/categories/', fetcher);
  
  return {
      categories: data?.results || [],
      isLoading: !error && !data,
      isError: error
  };
}

interface BlogFilters {
  status?: string;
  category?: string;
  tags?: string | number; // Add tags to existing filters
  toprated?: boolean;
  bestseller?: boolean;
  is_active?: boolean;
  search?: string;
  page?: number;
  order_by?: string;
}

// Update useGetPosts to handle tags
export function useGetPosts(filters: BlogFilters = {}) {
  // Create a stable key for SWR that includes all filter parameters
  const swrKey = useMemo(() => {
      const queryParams = new URLSearchParams();
      
      // Always include is_active
      queryParams.set('is_active', 'true');
      
      // Add all other filters
      Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
              queryParams.set(key, String(value));
          }
      });
      
      return `${API_URL}?${queryParams.toString()}`;
  }, [filters]);

  const { data, error, isValidating } = useSWR(swrKey, fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
  });

  return {
      posts: data?.results || [],
      postsLoading: !error && !data,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !(!error && !data) && !data?.results?.length,
      totalCount: data?.count || 0,
  };
}


export function useSearchPosts(query: string) {
  const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : null;

  const { data, error, isValidating } = useSWR<{
    count: number;
    next: string | null;
    previous: string | null;
    results: IPostItem[];
  }>(url, fetcher, {
    keepPreviousData: true,
  });

  return useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: !error && !data,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !(!error && !data) && !data?.results?.length,
      totalCount: data?.count || 0,
    }),
    [data, error, isValidating]
  );
}

export function useGetPost(slug: string) {
  const url = slug ? `${API_URL}${slug}/` : null;

  const { data, error, isValidating } = useSWR<IPostItem>(url, fetcher);

  return useMemo(
    () => ({
      post: data,
      postLoading: !error && !data,
      postError: error,
      postValidating: isValidating,
    }),
    [data, error, isValidating]
  );
}