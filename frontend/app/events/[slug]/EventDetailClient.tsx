"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { registerForEvent, Event, verifyPaymentSignature, cancelRegistration } from "@/lib/api";
import { Calendar, MapPin, Clock, ShieldAlert, Award, FileText, CheckCircle, ChevronDown, User, Sparkles, Building, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// High-quality fallback event image URLs
const fallbackEventImages = [
  "/images/unsplash/img-e25f1ef3.jpg",
  "/images/unsplash/img-56f59048.jpg",
  "https://images.unsplash.com/photo-1591115765373-5209768f73e7?auto=format&fit=crop&w=800&q=80",
];

interface EventDetailClientProps {
  event: Event;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const router = useRouter();
  const slug = event.slug;

  // Form Submission States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [uploadFile, setUploadFile] = useState<File | undefined>(undefined);

  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock Payment Modal States
  const [showMockPayment, setShowMockPayment] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);

  const handleSimulatePaymentSuccess = async () => {
    if (!mockPaymentData) return;
    setRegistering(true);
    setShowMockPayment(false);
    try {
      await verifyPaymentSignature({
        razorpayOrderId: mockPaymentData.orderId,
        razorpayPaymentId: `pay_stub_${Date.now()}`,
        razorpaySignature: "signature_stub_mock_verification_key_success",
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Mock payment verification failed.";
      alert(msg);
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelMockPayment = async () => {
    setShowMockPayment(false);
    setRegistering(false);
    if (mockPaymentData) {
      try {
        await cancelRegistration(mockPaymentData.orderId);
      } catch (e) {
        console.error("Failed to clean up cancelled mock registration:", e);
      }
    }
  };

  // Accordion faq expanded indices
  const [faqExpanded, setFaqExpanded] = useState<Record<number, boolean>>({});

  // Check if deadline is passed
  const isDeadlinePassed = useMemo(() => {
    return new Date() > new Date(event.registrationDeadline);
  }, [event]);

  // Handle dynamic field changes
  const handleAnswerChange = (fieldName: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle checkbox group selection changes
  const handleCheckboxGroupChange = (fieldName: string, option: string, checked: boolean) => {
    const currentList = Array.isArray(answers[fieldName]) ? [...answers[fieldName]] : [];
    if (checked) {
      currentList.push(option);
    } else {
      const idx = currentList.indexOf(option);
      if (idx > -1) currentList.splice(idx, 1);
    }
    handleAnswerChange(fieldName, currentList);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDeadlinePassed) {
      alert("Registrations are closed for this event.");
      return;
    }

    if (!fullName.trim()) return alert("Full Name is required");
    if (!email.trim() || !email.includes("@")) return alert("Valid email address is required");
    if (!phone.trim()) return alert("Phone number is required");

    // Dynamic fields validations
    for (const field of event.formFields) {
      if (field.name === "name" || field.name === "email" || field.name === "phone") continue;
      
      const val = answers[field.name];
      const hasValue = val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0);
      
      if (field.required && !hasValue && field.type !== "file") {
        return alert(`"${field.label}" is required.`);
      }
      if (field.type === "file" && field.required && !uploadFile) {
        return alert(`"${field.label}" upload is required.`);
      }
    }

    setRegistering(true);
    let orderSuccess = false;
    try {
      const res = await registerForEvent({
        eventId: event._id,
        name: fullName,
        email,
        phone,
        answers,
        file: uploadFile,
      });

      const regData = res.data || res;
      const isPaid = event.isPaid || regData?.isPaid;
      const razorpayOrderId = regData?.razorpayOrderId;

      if (isPaid && razorpayOrderId) {
        // Load Razorpay SDK script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
        }

        const isStubOrder = razorpayOrderId.startsWith("order_stub_");

        if (isStubOrder) {
          // Open the beautiful custom mock payment modal instead of ugly window.confirm
          setMockPaymentData({
            orderId: razorpayOrderId,
            amount: regData?.amountPaid || event.registrationFee || 0,
          });
          setShowMockPayment(true);
          orderSuccess = true; // Prevents loader from turning off immediately
        } else {
          // Live/Test Checkout Overlay
          const razorpayKey = regData?.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_stub_key";
          
          const options = {
            key: razorpayKey,
            amount: (regData?.amountPaid || event.registrationFee || 0) * 100, // Razorpay works in paise
            currency: "INR",
            name: "Indux Technology",
            description: `Ticket for ${event.title}`,
            order_id: razorpayOrderId,
            handler: async function (response: any) {
              setRegistering(true);
              try {
                // Call verification endpoint
                await verifyPaymentSignature({
                  razorpayOrderId: razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                setSuccess(true);
              } catch (err: any) {
                alert(err.response?.data?.message || "Payment verification failed. Please contact support.");
              } finally {
                setRegistering(false);
              }
            },
            prefill: {
              name: fullName,
              email: email,
              contact: phone,
            },
            theme: {
              color: "#2563EB",
            },
            modal: {
              ondismiss: async function () {
                setRegistering(false);
                try {
                  await cancelRegistration(razorpayOrderId);
                } catch (e) {
                  console.error("Failed to clean up dismissed registration:", e);
                }
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } else {
        // Free event
        orderSuccess = true;
        setSuccess(true);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to submit registration. Please check inputs.";
      alert(msg);
    } finally {
      if (!orderSuccess) {
        setRegistering(false);
      }
    }
  };

  const toggleFaq = (index: number) => {
    setFaqExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper date formatters
  const formatDateFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-left">
        <button 
          onClick={() => router.push("/events")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Events Feed
        </button>
      </div>

      {/* ===== HERO BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative h-[300px] md:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/40 dark:border-slate-800">
          <img
            src={event.bannerImage || event.coverImage || fallbackEventImages[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/10"></div>
          
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white pr-6 text-left">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white border border-blue-500 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                {event.type}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white border border-white/10 font-bold px-3 py-1 rounded-full text-xs">
                {event.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.2] max-w-4xl text-slate-100">{event.title}</h1>
            <div className="flex items-center gap-2 mt-4 text-xs md:text-sm font-semibold text-slate-300">
              <Building size={16} className="text-blue-500" />
              <span>Organizer: {event.organizer}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENT LAYOUT ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-12 text-left">
          
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-blue-600" /> About The Event
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {event.shortDescription}
            </p>
            <div 
              className="prose dark:prose-invert max-w-none text-slate-650 dark:text-slate-300 leading-relaxed text-sm pt-4 border-t border-slate-100 dark:border-slate-800"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>

          {event.speakers && event.speakers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-blue-600 size-5" /> Keynote Speakers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {event.speakers.map((speaker, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 hover:shadow-md transition"
                  >
                    <div className="size-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-650 overflow-hidden border">
                      {speaker.avatar ? (
                        <img src={speaker.avatar} alt={speaker.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{speaker.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{speaker.role}</p>
                      {speaker.company && (
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 w-fit px-1.5 py-0.5 rounded-md mt-1.5">
                          {speaker.company}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.schedule && event.schedule.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="text-blue-600 size-5" /> Event Schedule
              </h3>
              
              <div className="relative border-l-2 border-blue-500/25 pl-6 ml-4 space-y-6">
                {event.schedule.map((slot, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute top-1 -left-[32px] size-4 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-950 group-hover:scale-115 transition" />
                    
                    <div className="bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Clock size={12} /> {slot.time}
                      </span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base mt-1.5">{slot.title}</h4>
                      {slot.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{slot.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.faqs && event.faqs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="text-blue-600 size-5" /> FAQs
              </h3>
              
              <div className="space-y-3">
                {event.faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 transition cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-slate-400 transition-transform ${faqExpanded[idx] ? "rotate-180 text-blue-600" : ""}`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {faqExpanded[idx] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-5 pt-1 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-800">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side Sticky Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Details</h4>
            
            <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              <div className="flex items-start gap-3 pt-0">
                <Calendar className="text-blue-605 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">{formatDateFull(event.startDate)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3.5">
                <Clock className="text-blue-600 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3.5">
                <MapPin className="text-blue-600 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location / Venue</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">{event.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3.5">
                <ShieldAlert className="text-amber-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration Deadline</span>
                  <span className={`font-bold text-xs ${isDeadlinePassed ? "text-rose-500" : "text-slate-800 dark:text-slate-200"}`}>
                    {formatDateFull(event.registrationDeadline)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3.5">
                <Award className="text-blue-600 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration Fee</span>
                  <span className="text-slate-850 dark:text-slate-200 font-extrabold text-sm">
                    {event.isPaid ? `₹${event.registrationFee}` : "Free"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-xl space-y-4">
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="size-16 bg-green-100 dark:bg-green-950/40 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200/50">
                  <CheckCircle size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Registered!</h3>
                  <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed mt-2 px-3">
                    Congratulations! Your application for <strong>{event.title}</strong> was submitted successfully.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We sent a confirmation email copy to <strong>{email}</strong>. Our organizing team will review details shortly.
                </div>
                <Button 
                  onClick={() => router.push("/events")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold"
                >
                  Return to Feed
                </Button>
              </motion.div>
            ) : isDeadlinePassed ? (
              <div className="text-center py-8 space-y-4">
                <ShieldAlert className="size-14 text-rose-550 mx-auto opacity-70" />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Registrations Closed</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 px-4">
                    The registration deadline for this event has passed. Follow our page for upcoming sessions!
                  </p>
                </div>
                <Button 
                  onClick={() => router.push("/events")} 
                  variant="outline" 
                  className="w-full rounded-full text-xs font-bold"
                >
                  Explore Other Events
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Reserve Your Spot</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Please fill out details to request registration.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-500 text-slate-900 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-500 text-slate-900 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-500 text-slate-900 dark:text-white"
                      placeholder="+123456789"
                    />
                  </div>

                  {event.formFields.map((field) => {
                    if (field.name === "name" || field.name === "email" || field.name === "phone") return null;

                    const fieldVal = answers[field.name] || "";

                    return (
                      <div key={field.name} className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {field.label} {field.required && "*"}
                        </label>
                        
                        {(field.type === "text" || field.type === "email" || field.type === "phone" || field.type === "url") && (
                          <input
                            type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
                            required={field.required}
                            value={fieldVal}
                            onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                            placeholder={field.placeholder || `Enter ${field.label}`}
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-500 text-slate-900 dark:text-white"
                          />
                        )}

                        {field.type === "number" && (
                          <input
                            type="number"
                            required={field.required}
                            value={fieldVal}
                            onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                            placeholder={field.placeholder || "Enter value"}
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-500 text-slate-900 dark:text-white"
                          />
                        )}

                        {field.type === "textarea" && (
                          <textarea
                            required={field.required}
                            value={fieldVal}
                            onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                            placeholder={field.placeholder || `Write ${field.label}`}
                            rows={3}
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-500 text-slate-900 dark:text-white"
                          />
                        )}

                        {field.type === "select" && (
                          <select
                            required={field.required}
                            value={fieldVal}
                            onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white"
                          >
                            <option value="">{field.placeholder || "Select option"}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}

                        {field.type === "radio" && (
                          <div className="space-y-1.5 pt-1">
                            {field.options?.map(opt => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-355">
                                <input
                                  type="radio"
                                  name={field.name}
                                  required={field.required && !fieldVal}
                                  checked={fieldVal === opt}
                                  onChange={() => handleAnswerChange(field.name, opt)}
                                  className="text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === "checkbox" && (
                          <div className="space-y-1.5 pt-1">
                            {field.options?.map(opt => {
                              const list = Array.isArray(fieldVal) ? fieldVal : [];
                              return (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-350">
                                  <input
                                    type="checkbox"
                                    checked={list.includes(opt)}
                                    onChange={(e) => handleCheckboxGroupChange(field.name, opt, e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {field.type === "date" && (
                          <input
                            type="date"
                            required={field.required}
                            value={fieldVal}
                            onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-505 text-slate-900 dark:text-white"
                          />
                        )}

                        {field.type === "file" && (
                          <div className="space-y-1 pt-0.5">
                            <input
                              type="file"
                              accept="image/*,application/pdf,.doc,.docx"
                              required={field.required && !uploadFile}
                              onChange={handleFileChange}
                              className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploadFile && (
                              <p className="text-[10px] text-emerald-600 font-bold">
                                Selected: {uploadFile.name} ({Math.round(uploadFile.size / 1024)} KB)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Button
                    type="submit"
                    disabled={registering}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 transition disabled:opacity-50 mt-6 cursor-pointer"
                  >
                    {registering ? "Processing..." : event.isPaid ? `Pay ₹${event.registrationFee} & Register` : "Register / RSVP"}
                  </Button>
                  {event.isPaid && (
                    <p className="text-center text-[10px] text-slate-400 mt-2 font-semibold">
                      Secured by Razorpay. Includes immediate access to all event sessions.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* ===== CUSTOM MOCK PAYMENT DIALOG (SLICK GLASSMORPHISM OVERLAY) ===== */}
      <AnimatePresence>
        {showMockPayment && mockPaymentData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={handleCancelMockPayment}
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6 z-10"
            >
              <div className="size-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200/50">
                <Sparkles size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Simulate Payment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This is a test environment order simulation. No real money will be charged.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-3.5 text-left text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">Order ID</span>
                  <span className="font-mono text-xs text-slate-750 dark:text-slate-300">{mockPaymentData.orderId}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">Event</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">{event.title}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">Amount Due</span>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-lg">₹{mockPaymentData.amount}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button 
                  onClick={handleCancelMockPayment} 
                  variant="outline" 
                  className="flex-1 rounded-full py-6 font-bold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSimulatePaymentSuccess} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 font-bold shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  Confirm Payment
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
