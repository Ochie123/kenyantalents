'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import 'react-quill/dist/quill.snow.css';

import { paths } from '@/routes/paths';
import { Form, Field } from '@/components/hook-form';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import EditorView from '@/sections/_examples/extra/editor-view';

interface Category {
  id: string;
  title: string;
  parent?: string;
  url: string;
}

interface Tag {
  id: string;
  name: string;
}

interface FormValues {
  title: string;
  description: string;
  content: string;
  coverUrl: File | string | null;
  category: string;
  tags: Tag[];
  status: 'DF' | 'PB';
  is_active: boolean;
  toprated: boolean;
  bestseller: boolean;
}

const STATUS_OPTIONS = [
  { value: 'DF', label: 'Draft' },
  { value: 'PB', label: 'Published' },
];

type Props = {
  post: string;
};

export function PostEditView({ post }: Props) {
  const router = useRouter();
  const [postData, setPostData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);

  const methods = useForm<FormValues>();
  const { reset, setValue, watch, handleSubmit } = methods;

  // Fetch post data and form options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [postRes, categoriesRes, tagsRes] = await Promise.all([
          axios.get(`https://api.moderndecordiaries.com/api/blogs/${post}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://api.moderndecordiaries.com/api/categories/'),
          axios.get('https://api.moderndecordiaries.com/api/tags/')
        ]);

        setPostData(postRes.data);
        setCategories(categoriesRes.data.results);
        setTags(tagsRes.data.results);
        
        // Set existing cover image URL
        if (postRes.data.cover_image) {
          setExistingCoverUrl(postRes.data.cover_image);
        }

        // Find the matching category from the categories list
        const currentCategory = categoriesRes.data.results.find(
          (cat: Category) => cat.title === postRes.data.category
        );
        setSelectedCategory(currentCategory || null);

        // Reset form with fetched data
        reset({
          title: postRes.data.title || '',
          description: postRes.data.description || '',
          content: postRes.data.content || '',
          coverUrl: postRes.data.cover_image || null,
          category: currentCategory?.id || '',
          tags: postRes.data.tags || [],
          status: postRes.data.status || 'DF',
          is_active: postRes.data.is_active ?? true,
          toprated: postRes.data.toprated ?? false,
          bestseller: postRes.data.bestseller ?? false,
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load post data');
        setLoading(false);
      }
    };

    fetchData();
  }, [post, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'tags') {
          value.forEach((tag: Tag) => {
            formData.append('tags', tag.id);
          });
        } else if (key === 'coverUrl') {
          if (value instanceof File) {
            formData.append('cover_image', value);
          } else if (typeof value === 'string' && value !== existingCoverUrl) {
            // Only append if it's a new file path
            formData.append('cover_image', value);
          }
        } else if (key === 'category' && selectedCategory) {
          formData.append('category', selectedCategory.title); // Send category title instead of ID
        } else {
          formData.append(key, value as string);
        }
      });

      const token = localStorage.getItem('token');
      await axios.patch(`https://api.moderndecordiaries.com/api/blogs/${post}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      router.push(paths.dashboard.post.root);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (event: any, newValue: Category | null) => {
    setSelectedCategory(newValue);
    if (newValue) {
      setValue('category', newValue.title); // Set category title instead of ID
    } else {
      setValue('category', '');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!postData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Post not found</Typography>
      </Box>
    );
  }

  // Filter out parent categories
  const childCategories = categories.filter(cat => cat.parent);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Post"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: postData.title || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Card>
            <CardHeader title="Details" />
            <Divider />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text
                name="title"
                label="Title"
                required
              />
        <Stack spacing={1.5}>
        <EditorView />
      </Stack>
 

              <Autocomplete
                options={childCategories}
                getOptionLabel={(option: Category) => option.title}
                value={selectedCategory}
                onChange={handleCategoryChange}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography variant="body1">
                      {option.title}
                    </Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Cover</Typography>
                <Field.Upload
                  name="coverUrl"
                  accept="image/*"
                  maxSize={3145728}
                  preview={existingCoverUrl ? [existingCoverUrl] : undefined}
                />
              </Stack>

              <Field.Select
                name="status"
                label="Status"
                required
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>
          </Card>

          <Card>
            <CardHeader title="Properties" />
            <Divider />
            <Stack spacing={3} sx={{ p: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('is_active')}
                    onChange={(e) => setValue('is_active', e.target.checked)}
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('toprated')}
                    onChange={(e) => setValue('toprated', e.target.checked)}
                  />
                }
                label="Top Rated"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('bestseller')}
                    onChange={(e) => setValue('bestseller', e.target.checked)}
                  />
                }
                label="Bestseller"
              />
            </Stack>
          </Card>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.push(paths.dashboard.post.root)}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </DashboardContent>
  );
}