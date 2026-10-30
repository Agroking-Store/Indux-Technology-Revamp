import axios from "axios";

const resolvedApiBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: resolvedApiBase,
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

export const updateCareerStatus = async (id: string, status: "Active" | "Closed") => {
  const res = await api.patch(`/careers/${id}/status`, { status });
  return res.data;
};

export const incrementCareerView = async (id: string) => {
  const res = await api.patch(`/careers/${id}/view`);
  return res.data;
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

export const incrementBlogView = async (id: string) => {
  const res = await api.patch(`/blogs/${id}/view`);
  return res.data;
};

// ===== Case Study Types & API =====
export interface CaseStudy {
  _id: string;
  name: string;
  slug: string;
  headline: string;
  challenge: string;
  solution: string; // What we built
  result: string; // The result
  image?: string;
  status: "Draft" | "Published";
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export const getCaseStudies = async (): Promise<CaseStudy[]> => {
  const res = await api.get("/case-studies?limit=100&status=Published");
  return res.data.data.caseStudies;
};

export const getCaseStudyBySlug = async (slug: string): Promise<CaseStudy> => {
  const res = await api.get(`/case-studies/${slug}`);
  return res.data.data;
};

export const incrementCaseStudyView = async (id: string) => {
  const res = await api.patch(`/case-studies/${id}/view`);
  return res.data;
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
  skills?: string;
  preferredLocation?: string;
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
  if (input.skills) formData.append("skills", input.skills);
  if (input.preferredLocation) formData.append("preferredLocation", input.preferredLocation);
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
  companyName?: string;
  service?: string;
  source?: "Get Quote" | "Contact Us";
  message: string;
}

export const submitLead = async (input: LeadInput): Promise<any> => {
  const res = await api.post("/leads", input);
  return res.data;
};

// ===== Quote Types & API =====
export interface QuoteInput {
  name: string;
  workEmail: string;
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
  isPaid?: boolean;
  registrationFee?: number;
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

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
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

export const verifyPaymentSignature = async (
  input: VerifyPaymentInput,
): Promise<any> => {
  const res = await api.post("/event-registrations/verify-payment", input);
  return res.data;
};

export const cancelRegistration = async (razorpayOrderId: string): Promise<any> => {
  const res = await api.post("/event-registrations/cancel", { razorpayOrderId });
  return res.data;
};

export const getVisitorCount = async (log = true): Promise<number> => {
  try {
    const res = await api.get(`/visitors?log=${log}`);
    return res.data.count;
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return 0;
  }
};

export default api;

// ===== Dynamic Products & Recent Works Types & API =====
export const formatLiveUrl = (url?: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export interface DynamicProduct {
  _id?: string;
  id?: number | string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  themeColor: "blue" | "emerald" | "cyan" | "indigo";
  iconName?: string;
  image: string;
  features: { title: string; desc: string }[];
  stats: { label: string; value: string }[];
  faq: { q: string; a: string }[];
  tech: string[];
  liveUrl?: string;
  status?: "Draft" | "Published";
  order?: number;
}

export interface DynamicRecentWork {
  _id?: string;
  id?: number | string;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  image: string;
  client: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  technologies: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  status?: "Draft" | "Published";
  order?: number;
}

export const getFullImageUrl = (img?: string): string => {
  if (!img) return "/placeholder.svg";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
    return img;
  }
  const rawApi =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1";
  const base = rawApi.replace(/\/api\/v1\/?$/, "");
  if (img.startsWith("/uploads/")) {
    return `${base}/api/v1${img}`;
  }
  return img.startsWith("/") ? img : `/${img}`;
};

export const getDynamicProducts = async (): Promise<DynamicProduct[]> => {
  try {
    const res = await api.get("/products?status=Published");
    const list = res.data?.data?.products || (Array.isArray(res.data?.data) ? res.data.data : []);
    if (list && list.length > 0) {
      return list;
    }
  } catch (error) {
    console.warn("Could not fetch dynamic products, using fallback static data.", error);
  }
  return [];
};

export const getDynamicProductBySlug = async (slug: string): Promise<DynamicProduct | null> => {
  try {
    const res = await api.get(`/products/${slug}`);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error) {
    console.warn(`Could not fetch dynamic product for slug ${slug}:`, error);
  }
  return null;
};

export const getDynamicRecentWorks = async (): Promise<DynamicRecentWork[]> => {
  try {
    const res = await api.get("/recent-works?status=Published");
    const list = res.data?.data?.recentWorks || (Array.isArray(res.data?.data) ? res.data.data : []);
    if (list && list.length > 0) {
      return list;
    }
  } catch (error) {
    console.warn("Could not fetch dynamic recent works, using fallback static data.", error);
  }
  return [];
};
