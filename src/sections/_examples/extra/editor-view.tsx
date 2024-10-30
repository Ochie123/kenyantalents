import { useFormContext, Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Editor from '@/components/editor1';
import Markdown from '@/components/markdown1';
import Box from '@mui/material/Box';

export default function EditorView() {
  const { control, watch } = useFormContext();
  const description = watch('description');

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card>
          <CardHeader title="Description" />
          <CardContent>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Editor
                  id="full-editor"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={4}>
        <Stack 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            bgcolor: 'background.neutral',
            height: '400px', // Fixed height for the entire preview section
            position: 'sticky',
            top: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preview Plain Text
          </Typography>
          
          <Box 
            sx={{ 
              overflow: 'auto',
              height: 'auto', // Height for markdown preview
              mb: 3,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'background.paper',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.400',
                borderRadius: '4px',
              },
            }}
          >
            <Markdown children={description} />
          </Box>

        </Stack>
      </Grid>
    </Grid>
  );
}