import axios from "axios";

// 🔍 DEBUG: Check if the env variable is loaded correctly in the browser console
console.log(
  "🔍 Frontend API URL:",
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
);

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ===== Career Types & API =====
export interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: "Full Time" | "Internship";
  experience: string;
  openings: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  skills: string[];
  salary?: string;
  status: "Active" | "Closed";
  formFields?: FormField[];
  lastDate: string;
  createdAt: string;
  updatedAt: string;
}

export const getCareers = async (): Promise<Career[]> => {
  const res = await api.get("/careers?status=Active");
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
  status: "Draft" | "Published";
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export const getBlogs = async (): Promise<Blog[]> => {
  const res = await api.get("/blogs?limit=100");
  return res.data.data.blogs;
};

export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  // Call the single-blog endpoint directly — returns full document
  // (content, featuredImage, etc.) without needing to fetch all blogs first.
  const res = await api.get(`/blogs/${slug}`);
  return res.data.data;
};

// ===== Job Application Types & API =====
export interface JobApplicationInput {
  careerId?: string;
  jobId?: string;
  fullName?: string;
  candidateName?: string;
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
  resume: File; // Native File object from upload input
}

export const submitApplication = async (
  input: JobApplicationInput,
): Promise<any> => {
  const formData = new FormData();
  formData.append("jobId", input.jobId || input.careerId || "");
  formData.append("candidateName", input.candidateName || input.fullName || "");
  formData.append("email", input.email);
  formData.append("phone", input.phone);
  formData.append("experience", input.experience);

  if (input.coverLetter) formData.append("coverLetter", input.coverLetter);
  if (input.portfolio) formData.append("portfolio", input.portfolio);
  if (input.linkedin) formData.append("linkedin", input.linkedin);
  if (input.github) formData.append("github", input.github);
  if (input.noticePeriod) formData.append("noticePeriod", input.noticePeriod);
  if (input.expectedCTC) formData.append("expectedCTC", input.expectedCTC);
  if (input.answers) formData.append("answers", JSON.stringify(input.answers));

  formData.append("resume", input.resume);

  const res = await api.post("/applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ===== Lead/Contact Types & API =====
export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const submitLead = async (input: LeadInput): Promise<any> => {
  const res = await api.post("/leads", input);
  return res.data;
};

// ===== Quote Types & API =====
export interface QuoteInput {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceInterest: string;
  message: string;
}

export const submitQuote = async (input: QuoteInput): Promise<any> => {
  const res = await api.post("/quotes", input);
  return res.data;
};

// ===== Event Types & API =====
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "number"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "date"
    | "url"
    | "file";
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
  status: "Draft" | "Published";
  formFields: FormField[];
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
  faqs?: FaqItem[];
  createdAt: string;
  updatedAt: string;
  // Fallbacks
  image?: string;
  date?: string;
  content?: string;
}

export interface EventRegistrationInput {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  answers: Record<string, any>;
  file?: File;
}

export const getEvents = async (): Promise<Event[]> => {
  const res = await api.get("/events");
  return res.data.data;
};

export const getEventBySlug = async (slug: string): Promise<Event> => {
  const res = await api.get(`/events/${slug}`);
  return res.data.data;
};

export const registerForEvent = async (
  input: EventRegistrationInput,
): Promise<any> => {
  const formData = new FormData();
  formData.append("eventId", input.eventId);
  formData.append("name", input.name);
  formData.append("email", input.email);
  formData.append("phone", input.phone);
  formData.append("answers", JSON.stringify(input.answers));
  if (input.file) {
    formData.append("file", input.file);
  }

  const res = await api.post("/event-registrations", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getVisitorCount = async (): Promise<number> => {
  try {
    const res = await api.get("/visitors");
    return res.data.count;
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return 0;
  }
};

export default api;
