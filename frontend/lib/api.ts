import axios from 'axios';

// 🔍 DEBUG: Check if the env variable is loaded correctly in the browser console
console.log('🔍 Frontend API URL:', process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ===== Career Types & API =====
export interface Career {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full Time' | 'Internship';
  experience: string;
  openings: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary?: string;
  status: 'Active' | 'Closed';
  lastDate: string;
  createdAt: string;
  updatedAt: string;
}

export const getCareers = async (): Promise<Career[]> => {
  const res = await api.get('/careers');
  return res.data.data.careers;
};

export const getCareerById = async (id: string): Promise<Career> => {
  const res = await api.get(`/careers/${id}`);
  return res.data.data;
};

// ===== Blog Types & API =====
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  featuredImagePublicId?: string;
  category: string;
  tags: string[];
  author: string;
  status: 'Draft' | 'Published';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export const getBlogs = async (): Promise<Blog[]> => {
  const res = await api.get('/blogs');
  return res.data.data.blogs;
};

export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const blogs = await getBlogs();
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) throw new Error('Blog not found');
  return blog;
};

export default api;