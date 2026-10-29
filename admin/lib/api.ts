import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor – attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // When sending FormData (file uploads), remove the default
    // 'application/json' Content-Type so the browser can set
    // 'multipart/form-data; boundary=...' automatically. If left as
    // 'application/json', the backend's multer middleware won't parse
    // the body as multipart and req.file will be undefined.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – global error toast
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as any)?.message || error.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Helper type
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'url' | 'file';
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
}

export interface Speaker {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  type: string;
  category: string;
  coverImage: string;
  bannerImage: string;
  shortDescription: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  organizer: string;
  location: string;
  status: 'Draft' | 'Published';
  isPaid?: boolean;
  registrationFee?: number;
  formFields: FormField[];
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
  faqs?: FaqItem[];
  registrationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  _id: string;
  eventId: string | Event;
  name: string;
  email: string;
  phone: string;
  answers: Record<string, any>;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Attended';
  paymentStatus?: 'None' | 'Pending' | 'Paid' | 'Failed';
  amountPaid?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: 'Full Time' | 'Internship';
  experience: string;
  openings: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  skills: string[];
  salary?: string;
  status: 'Active' | 'Closed';
  formFields?: FormField[];
  applicationsCount?: number;
  views?: number;
  lastDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  _id: string;
  jobId: string | Career;
  careerId?: string | Career; // compatibility
  candidateName: string;
  fullName?: string; // compatibility
  email: string;
  phone: string;
  experience: string;
  coverLetter?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  noticePeriod?: string;
  expectedCTC?: string;
  answers?: Record<string, any>;
  resume: string;
  resumeUrl: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Interview Scheduled' | 'Interview Completed' | 'Offered' | 'Hired' | 'Rejected';
  notes?: string;
  matchScore?: number;
  rating?: number;
  scoreBreakdown?: {
    experienceScore: number;
    skillsScore: number;
    experienceMax: number;
    skillsMax: number;
  };
  skills?: string;
  preferredLocation?: string;
  createdAt: string;
  updatedAt: string;
}


export interface ProductFeature {
  title: string;
  desc: string;
}

export interface ProductStat {
  label: string;
  value: string;
}

export interface ProductFaq {
  q: string;
  a: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  themeColor: "blue" | "emerald" | "cyan" | "indigo";
  iconName?: string;
  image: string;
  features: ProductFeature[];
  stats: ProductStat[];
  faq: ProductFaq[];
  tech: string[];
  liveUrl?: string;
  status: "Draft" | "Published";
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecentWorkMetric {
  label: string;
  value: string;
}

export interface RecentWork {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  client: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  highlights: string[];
  technologies: string[];
  metrics: RecentWorkMetric[];
  liveUrl?: string;
  status: "Draft" | "Published";
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Products API
export const getAdminProducts = async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  const res = await api.get('/products', { params });
  return res.data.data;
};

export const getAdminProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
};

export const createProduct = async (data: FormData | any) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id: string, data: FormData | any) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const updateProductStatus = async (id: string, status: 'Draft' | 'Published') => {
  const res = await api.patch(`/products/${id}/status`, { status });
  return res.data;
};

// Recent Works API
export const getAdminRecentWorks = async (params?: { page?: number; limit?: number; search?: string; category?: string; status?: string }) => {
  const res = await api.get('/recent-works', { params });
  return res.data.data;
};

export const getAdminRecentWorkById = async (id: string) => {
  const res = await api.get(`/recent-works/${id}`);
  return res.data.data;
};

export const createRecentWork = async (data: FormData | any) => {
  const res = await api.post('/recent-works', data);
  return res.data;
};

export const updateRecentWork = async (id: string, data: FormData | any) => {
  const res = await api.put(`/recent-works/${id}`, data);
  return res.data;
};

export const deleteRecentWork = async (id: string) => {
  const res = await api.delete(`/recent-works/${id}`);
  return res.data;
};

export const updateRecentWorkStatus = async (id: string, status: 'Draft' | 'Published') => {
  const res = await api.patch(`/recent-works/${id}/status`, { status });
  return res.data;
};

export default api;