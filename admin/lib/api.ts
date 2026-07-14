import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
  resumeUrl: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Interview Scheduled' | 'Interview Completed' | 'Offered' | 'Hired' | 'Rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default api;