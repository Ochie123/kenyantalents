'use client';

import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetPosts, useSearchPosts, useCategories } from '@/actions/blog';

import { Iconify } from '@/components/iconify';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { DashboardContent } from '@/layouts/dashboard';

import { PostSearch } from '../post-search';
import { PostListHorizontal } from '../post-list-horizontal';

export function PostListView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    page: 1,
  });
  const [childCategories, setChildCategories] = useState([]);

  const debouncedQuery = useDebounce(searchQuery);

  // Fetch categories
  const { categories } = useCategories();

  // Extract category ID from URL
  const getCategoryId = (url) => {
    if (!url) return null;
    const matches = url.match(/\/categories\/(\d+)\//);
    return matches ? matches[1] : null;
  };

  // Filter out and set child categories whenever categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Filter to only include categories that have a parent
      const children = categories.filter(category => category.parent !== null);
      setChildCategories(children);
    }
  }, [categories]);

  // Get posts with current filters
  const { 
    posts, 
    postsLoading, 
    totalCount 
  } = useGetPosts({
    ...filters,
    is_active: true,
  });

  // Get search results when there's a search query
  const { 
    searchResults, 
    searchLoading,
    totalCount: searchCount 
  } = useSearchPosts(debouncedQuery);

  const handleSearch = (inputValue) => {
    setSearchQuery(inputValue);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (field) => (event) => {
    setSearchQuery('');
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // Get parent category title
  const getParentCategoryTitle = (parentUrl) => {
    const parentCategory = categories.find(cat => cat.url === parentUrl);
    return parentCategory ? parentCategory.title : 'Unknown Parent';
  };

  // Determine which posts to show
  const displayPosts = searchQuery ? searchResults : posts;
  const isLoading = searchQuery ? searchLoading : postsLoading;
  const displayCount = searchQuery ? searchCount : totalCount;
  const totalPages = Math.ceil(displayCount / 10);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Blog Posts"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Post
          </Button>
        }
      />

      <Stack spacing={3}>
        <PostSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(title) => paths.dashboard.post.details(title)}
        />

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={handleFilterChange('status')}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PB">Published</MenuItem>
              <MenuItem value="DR">Draft</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={handleFilterChange('category')}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {childCategories.map(category => (
                <MenuItem 
                  key={category.url} 
                  value={getCategoryId(category.url)} // Just send the ID
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <span>{category.title}</span>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    in {getParentCategoryTitle(category.parent)}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <div>Total Posts: {displayCount}</div>
        </Stack>

        <PostListHorizontal 
          posts={displayPosts}
          loading={isLoading}
          page={filters.page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </Stack>
    </DashboardContent>
  );
}