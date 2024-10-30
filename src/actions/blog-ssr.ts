import axios from '@/utils/axios';

// Fetch all blogs
export async function getBlogs() {
  const res = await axios.get('http://127.0.0.1:8000/api/blogs/');
  return res.data;

}

// Fetch a single blog by ID
export async function getBlog(id: string) {
  const URL = id ? `http://127.0.0.1:8000/api/blogs/${id}/` : '';
  const res = await axios.get(URL);
  return res.data;
  console.log(res.data)
}
