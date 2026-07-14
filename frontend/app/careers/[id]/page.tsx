'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCareerById, submitApplication, Career, FormField } from '@/lib/api';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Users, Upload, CheckCircle2, Loader2, FileText, ChevronRight, Link2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [expectedCTC, setExpectedCTC] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Custom Answers State
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    getCareerById(id)
      .then(setCareer)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswerChange = (fieldName: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value }));
  };

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
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF resumes are supported.');
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Resume file size must be under 5MB.');
      setResumeFile(null);
      return;
    }

    setErrorMsg('');
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !experience || !resumeFile) {
      setErrorMsg('Please fill in all required fields and upload your resume.');
      return;
    }

    // Custom form builder validation
    if (career?.formFields) {
      for (const field of career.formFields) {
        if (field.name === 'name' || field.name === 'email' || field.name === 'phone') continue;
        const val = answers[field.name];
        const hasValue = val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
        if (field.required && !hasValue) {
          setErrorMsg(`"${field.label}" is a required question.`);
          return;
        }
      }
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await submitApplication({
        careerId: id,
        fullName,
        email,
        phone,
        experience,
        coverLetter,
        portfolio,
        linkedin,
        github,
        noticePeriod,
        expectedCTC,
        answers,
        resume: resumeFile,
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 justify-center items-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-slate-500 text-sm mt-3 font-mono">// Fetching Job Details...</span>
      </div>
    );
  }

  if (!career || career.status !== 'Active') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 justify-center items-center p-6 text-center">
        <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job opening not available</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">This position may have been closed or deleted. Please check our other open roles.</p>
        <Button onClick={() => router.push('/careers')} className="mt-6 bg-blue-600 text-white rounded-full">
          Back to Careers
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-left">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => router.push('/careers')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Open Opportunities
        </button>

        {submitted ? (
          /* SUCCESS SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xl"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Application Submitted!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
              Thank you for applying to the <strong className="text-slate-800 dark:text-slate-200">{career.title}</strong> position at Indux. Our engineering team will review your application and resume details and get in touch with you soon.
            </p>
            <Button
              onClick={() => router.push('/careers')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold uppercase text-xs tracking-wider transition-all"
            >
              Return to Careers
            </Button>
          </motion.div>
        ) : (
          /* DETAILS & FORM GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Job Description details */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-md">
                <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full mb-4">
                  {career.department}
                </span>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                  {career.title}
                </h1>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {career.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {career.employmentType}
                  </span>
                  {career.salary && (
                    <span className="inline-flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {career.salary}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {career.openings} Openings
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Job Description</h3>
                    <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                      {career.description}
                    </p>
                  </div>

                  {career.responsibilities && career.responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">Key Responsibilities</h3>
                      <ul className="space-y-2">
                        {career.responsibilities.map((resp, i) => (
                          <li key={i} className="flex gap-2.5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {career.requirements && career.requirements.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">Requirements & Qualifications</h3>
                      <ul className="space-y-2">
                        {career.requirements.map((req, i) => (
                          <li key={i} className="flex gap-2.5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {career.benefits && career.benefits.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">Perks & Benefits</h3>
                      <ul className="space-y-2">
                        {career.benefits.map((benefit, i) => (
                          <li key={i} className="flex gap-2.5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {career.skills && career.skills.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, i) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-355">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-md">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Apply for this Position</h3>
                <p className="text-xs text-slate-500 mb-6">Complete the form below. Required fields are marked *</p>

                {errorMsg && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-655 dark:text-red-400 text-xs rounded-xl p-3 mb-5 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Basic Info */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Experience *</label>
                      <input
                        type="text"
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 3 Years"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Notice Period</label>
                      <input
                        type="text"
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        placeholder="e.g. Immediate / 30 Days"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Expected CTC</label>
                      <input
                        type="text"
                        value={expectedCTC}
                        onChange={(e) => setExpectedCTC(e.target.value)}
                        placeholder="e.g. $90,000"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>

                  {/* Links Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Portfolio URL</label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">GitHub Profile</label>
                      <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Cover Letter / Intro</label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly introduce yourself and why you're a good fit..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    />
                  </div>

                  {/* DYNAMIC QUESTIONS */}
                  {career.formFields && career.formFields.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Additional Questions</h4>
                      {career.formFields.map((field) => {
                        if (field.name === 'name' || field.name === 'email' || field.name === 'phone') return null;

                        const val = answers[field.name] || '';

                        return (
                          <div key={field.name} className="space-y-1 text-left">
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {field.label} {field.required && '*'}
                            </label>

                            {(field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'url') && (
                              <input
                                type="text"
                                required={field.required}
                                value={val}
                                onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              />
                            )}

                            {field.type === 'textarea' && (
                              <textarea
                                required={field.required}
                                value={val}
                                onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                                rows={2}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                              />
                            )}

                            {field.type === 'select' && (
                              <select
                                required={field.required}
                                value={val}
                                onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                              >
                                <option value="">Select option...</option>
                                {field.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}

                            {field.type === 'radio' && (
                              <div className="space-y-1 pt-1 flex flex-wrap gap-4">
                                {field.options?.map(opt => (
                                  <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={field.name}
                                      required={field.required && !val}
                                      checked={val === opt}
                                      onChange={() => handleAnswerChange(field.name, opt)}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {field.type === 'checkbox' && (
                              <div className="space-y-1 pt-1 flex flex-wrap gap-4">
                                {field.options?.map(opt => {
                                  const list = Array.isArray(val) ? val : [];
                                  return (
                                    <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={list.includes(opt)}
                                        onChange={(e) => handleCheckboxGroupChange(field.name, opt, e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* PDF RESUME UPLOAD */}
                  <div className="border-t pt-4">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Resume Upload (PDF only, max 5MB) *</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,application/pdf"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-850 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 bg-slate-50 dark:bg-slate-950 cursor-pointer transition-all duration-300"
                    >
                      {resumeFile ? (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <FileText className="w-6 h-6" />
                          <div className="text-left">
                            <p className="text-xs font-bold line-clamp-1">{resumeFile.name}</p>
                            <p className="text-[10px] text-slate-400">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-slate-400 mb-2" />
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Click to select PDF resume</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Maximum size: 5MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/10 cursor-pointer font-bold uppercase text-xs tracking-wider mt-4"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}