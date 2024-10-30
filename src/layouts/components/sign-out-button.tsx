import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from '@/components/snackbar';
import { useCallback } from 'react';

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const router = useRouter();

  const LogOutUser = useCallback(() => {
    try {
      // Clear localStorage
      localStorage.clear();

      // Remove the token from cookies
      Cookies.remove('token');

      // Redirect to the login page
      onClose?.();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Unable to logout!');
    }
  }, [onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={LogOutUser}
      {...other}
    >
      Logout
    </Button>
  );
}
