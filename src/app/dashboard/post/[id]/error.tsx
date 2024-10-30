// /app/dashboard/post/[id]/edit/error.tsx
'use client';

import { useEffect } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('PostEditPage error:', error);
  }, [error]);

  return (
    <Container>
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          minHeight: '100vh',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" paragraph>
          Sorry, something went wrong!
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
          There was an error loading this post. Please try again later.
        </Typography>

        <Button
          variant="contained"
          onClick={() => reset()}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
}
