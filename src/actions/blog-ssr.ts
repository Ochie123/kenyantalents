import axios from '@/utils/axios';

// Fetch all blogs
export async function getBlogs() {
  const res = await axios.get('https://api.moderndecordiaries.com/api/blogs/');
  return res.data;

}

// Fetch a single blog by ID
export async function getBlog(id: string) {
  const URL = id ? `https://api.moderndecordiaries.com/api/blogs/${id}/` : '';
  const res = await axios.get(URL);
  return res.data;
  console.log(res.data)
}
