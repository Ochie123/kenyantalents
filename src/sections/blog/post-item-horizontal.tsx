import type { IPostItem } from '@/types/blog';
import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';
import { fDate } from '@/utils/format-time';
import { maxLine } from '@/theme/styles';
import { Label } from '@/components/label';
import { Image } from '@/components/image';
import { Iconify } from '@/components/iconify';
import { usePopover, CustomPopover } from '@/components/custom-popover';

type PostItemProps = {
  post: IPostItem;
  onDeleteSuccess?: () => void; // Callback for after successful deletion
};

export function PostItemHorizontal({ post, onDeleteSuccess }: PostItemProps) {
  const theme = useTheme();
  const popover = usePopover();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    id,
    title,
    user,
    category,
    tags,
    slug,
    category_title,
    user_full_name,
    cover_image,
    description,
    is_active,
    publish,
    status
  } = post;

  // Status functions remain the same...
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PB':
        return 'success';
      case 'DR':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PB':
        return 'Published';
      case 'DR':
        return 'Draft';
      default:
        return 'Unknown';
    }
  };

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.post.edit(id));
    },
    [router]
  );

  const handleOpenDeleteDialog = () => {
    popover.onClose();
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${post.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleCloseDeleteDialog();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Show success notification (you can implement your own notification system)
      console.info('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      // Show error notification
    } finally {
      setIsDeleting(false);
    }
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.slice(0, maxLength) + '...';
  };

  return (
    <>
      <Card sx={{ display: 'flex', mb: 2 }}>
        {/* Image Section */}
        <Box
          sx={{
            p: 1,
            width: 180,
            height: 240,
            flexShrink: 0,
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Image
            alt={title}
            src={cover_image || '/path/to/default/image.jpg'}
            sx={{ height: 1, borderRadius: 1.5 }}
          />
        </Box>
        
        {/* Rest of the card content remains the same... */}
        <Stack spacing={2} sx={{ p: 3, flexGrow: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Label variant="soft" color={getStatusColor(status)}>
              {getStatusText(status)}
            </Label>
            <Typography variant="caption" color="text.secondary">
              {fDate(publish)}
            </Typography>
          </Box>
          <Stack spacing={1}>
            <Link
              component={RouterLink}
              href={paths.dashboard.post.details(slug)}
              color="inherit"
              variant="h6"
              sx={{
                ...maxLine(2),
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {title}
            </Link>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ ...maxLine(2) }}
            >
              <div className="body1 text-secondary mt-4" dangerouslySetInnerHTML={{ __html: truncateDescription(description, 40)}}></div>
              
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={category_title}
              color="primary"
              variant="outlined"
            />
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                size="small"
                label={tag.title}
                variant="outlined"
              />
            ))}
          </Stack>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              By {user_full_name}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Popover Menu */}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
      >
        <MenuList>
     
          <MenuItem
            onClick={() => {
              popover.onClose();
              handleEdit(String(post.id));
            }}
          >
            <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={handleOpenDeleteDialog}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            loading={isDeleting}
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}