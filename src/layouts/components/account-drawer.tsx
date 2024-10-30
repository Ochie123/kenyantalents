'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useAppSelector } from "@/Redux/Hooks";
import { paths } from '@/routes/paths';
import { useRouter, usePathname } from '@/routes/hooks';

import { varAlpha } from '@/theme/styles';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { Scrollbar } from '@/components/scrollbar';
import { AnimateAvatar } from '@/components/animate';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
import axios from 'axios';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const { claims } = useAppSelector((state) => state.auth);
  const theme = useTheme();

  const router = useRouter();

  const pathname = usePathname();

  const [user, setUser] = useState<{ displayName: string; email: string; photoURL: string } | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router]
  );

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/apis/users/${claims.user_id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser({
          displayName: response.data.first_name, // Adjust according to your API response
          email: response.data.email, // Adjust according to your API response
          photoURL: response.data.photoURL // Adjust according to your API response
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (claims?.user_id) {
      fetchUserDetails();
    }
  }, [claims]);

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: user?.photoURL, alt: user?.displayName },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8 }}>
            {renderAvatar}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.displayName || 'Loading...'}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email || 'Loading...'}
            </Typography>
          </Stack>

          <Stack
            sx={{
              py: 3,
              px: 2.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            {data.map((option) => {
              const rootLabel = pathname.includes('/dashboard') ? 'Home' : 'Dashboard';

              const rootHref = pathname.includes('/dashboard') ? '/dashboard' : paths.dashboard.root;

              return (
                <MenuItem
                  key={option.label}
                  onClick={() => handleClickItem(option.label === 'Home' ? rootHref : option.href)}
                  sx={{
                    py: 1,
                    color: 'text.secondary',
                    '& svg': { width: 24, height: 24 },
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  {option.icon}

                  <Box component="span" sx={{ ml: 2 }}>
                    {option.label === 'Home' ? rootLabel : option.label}
                  </Box>
                </MenuItem>
              );
            })}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
