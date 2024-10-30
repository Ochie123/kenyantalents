'use client'
import { useForm } from 'react-hook-form';
import { useMemo, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { IPostItem } from '@/types/blog';


import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
// editor
import 'react-quill/dist/quill.snow.css';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { useBoolean } from '@/hooks/use-boolean';
import { Form, Field } from '@/components/hook-form';
import EditorView from '../_examples/extra/editor-view';

const STATUS_OPTIONS = [
  { value: 'DF', label: 'Draft' },
  { value: 'PB', label: 'Published' },
];

type Props = {
  currentPost?: IPostItem;
};

export function PostNewEditForm({ currentPost }: Props) {
  const router = useRouter();
  const preview = useBoolean();
  
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  // Enhanced category and data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get('https://kgt.inventoryr.online/api/categories/'),
          axios.get('https://kgt.inventoryr.online/api/tags/')
        ]);
        
        const allCategories = categoriesRes.data.results;
       // console.log('All categories:', allCategories);
        setCategories(allCategories);
        setAvailableTags(tagsRes.data.results);

        // If we have a currentPost with a category, set it up
        if (currentPost?.category) {
          console.log('Current post category ID:', currentPost.category);
          
          // Find the category object that matches the currentPost's category ID
          const currentCategory = allCategories.find(cat => 
            cat.id === currentPost.category || 
            String(cat.id) === String(currentPost.category)
          );
          
          console.log('Found category object:', currentCategory);
          
          if (currentCategory) {
            setSelectedCategory(currentCategory);
            
            // If the category has a parent, find and set it
            if (currentCategory.parent) {
              const parent = allCategories.find(cat => cat.url === currentCategory.parent);
              setParentCategory(parent);
              console.log('Found parent category:', parent);
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPost]);

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      content: currentPost?.content || '',
      coverUrl: currentPost?.cover_image || null,
      category: currentPost?.category || '',
      tags: currentPost?.tags || [],
      metaTitle: currentPost?.metaTitle || '',
      metaDescription: currentPost?.metaDescription || '',
      status: currentPost?.status || 'DF',
      is_active: currentPost?.is_active ?? true,
      toprated: currentPost?.toprated ?? false,
      bestseller: currentPost?.bestseller ?? false,
    }),
    [currentPost]
  );

  const methods = useForm({
    defaultValues,
  });


  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
  
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === 'tags') {
          data[key].forEach(tag => {
            formData.append('tags', tag.id);
          });
        } else if (key === 'coverUrl') {
          // Only append cover_image if it's a new file
          if (data[key] instanceof File) {
            formData.append('cover_image', data[key]);
          }
        } else if (key === 'category' && selectedCategory) {
          formData.append('category', selectedCategory.id);
        } else {
          formData.append(key, data[key]);
        }
      });
  
      const token = localStorage.getItem('token');
      const baseUrl = 'https://kgt.inventoryr.online/api/blogs/';
      
      let response;
      if (currentPost) {
        // If editing, use PATCH request
        response = await axios({
          method: 'patch',
          url: `${baseUrl}${currentPost.id}/`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // If creating new, use POST request
        response = await axios.post(baseUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      console.log('Server response:', response.data);
  
      reset();
      preview.onFalse();
      router.push(paths.dashboard.post.root);
    } catch (error) {
      console.error('Submission error:', error.response?.data || error);
    }
  };
  
  
  const handleCategoryChange = (event, newValue) => {
    if (newValue) {
      // Extract the ID from the URL
      const categoryId = newValue.url.split('/').filter(Boolean).pop(); // Extracts the numeric ID from the URL
  
      // Set selected category with the extracted ID
      setSelectedCategory({ ...newValue, id: categoryId });
  
      // Find the parent category if available
      const parent = categories.find(cat => cat.url === newValue.parent);
      setParentCategory(parent);
  
      console.log('Selected category:', {
        id: categoryId,
        title: newValue.title,
        parent: parent ? { 
          id: parent.url.split('/').filter(Boolean).pop(), 
          title: parent.title 
        } : null,
      });
    } else {
      setSelectedCategory(null);
      setParentCategory(null);
    }
  };

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Post title" />
        <Stack spacing={1.5}>
        <EditorView />
      </Stack>

        <Stack spacing={1}>
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.title}
          value={selectedCategory}
          onChange={handleCategoryChange}
          renderOption={(props, option) => {
            const parentCategory = categories.find(cat => cat.url === option.parent);
            return (
              <li {...props}>
                <Stack>
                  <Typography variant="body1">
                    {option.title}
                  </Typography>
                  {option.parent && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      in {parentCategory?.title || 'Unknown Parent'}
                    </Typography>
                  )}
                </Stack>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category" />
          )}
        />
        {selectedCategory && parentCategory && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Selected: {selectedCategory.title} (in {parentCategory.title})
          </Typography>
        )}
      </Stack>
        {/* Tags Selection */}
        <Autocomplete
          multiple
          options={availableTags}
          getOptionLabel={(option) => option.title}
          value={values.tags}
          onChange={(event, newValue) => {
            setValue('tags', newValue);
          }}
          isOptionEqualToValue={(option, value) => 
            option.id === value.id
          }
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.id}
                label={option.title}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Tags" 
              error={values.tags?.length === 0}
              helperText={values.tags?.length === 0 ? 'At least one tag is required' : ''}
            />
          )}
        />
        
        
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Cover</Typography>
          <Field.Upload name="coverUrl" maxSize={3145728} onDelete={handleRemoveFile} />
        </Stack>


        <Field.Select name="status" label="Status">
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader title="Properties" />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <FormControlLabel
          control={
            <Switch
              name="is_active"
              checked={values.is_active}
              onChange={(e) => setValue('is_active', e.target.checked)}
            />
          }
          label="Active"
        />
        <FormControlLabel
          control={
            <Switch
              name="toprated"
              checked={values.toprated}
              onChange={(e) => setValue('toprated', e.target.checked)}
            />
          }
          label="Top Rated"
        />
        <FormControlLabel
          control={
            <Switch
              name="bestseller"
              checked={values.bestseller}
              onChange={(e) => setValue('bestseller', e.target.checked)}
            />
          }
          label="Bestseller"
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
      >
        {!currentPost ? 'Create Post' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={5}>
        {renderDetails}
        {renderProperties}
        {renderActions}
      </Stack>
    </Form>
  );
}