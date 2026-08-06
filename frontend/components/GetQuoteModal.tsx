"use client";

import React, { useState, cloneElement, isValidElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  ArrowRight,
  Check,
  ChevronsUpDown,
  User,
  Building2,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input/input";
import { getCountries, getCountryCallingCode, parsePhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { submitQuote } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SuccessModal } from "@/components/SuccessModal";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const services = [
  { value: "product_engineering", label: "Product Engineering" },
  { value: "it_consulting", label: "IT Consulting" },
  { value: "managed_it_services", label: "Managed IT Services" },
  { value: "dedicated_team", label: "Dedicated Team" },
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "digital_transformation", label: "Digital Transformation" },
  { value: "cloud_services", label: "Cloud Services" },
  { value: "digital_marketing", label: "Digital Marketing" },
  { value: "ai_ml_services", label: "AI/ML Services" },
  { value: "others", label: "Others" },
];

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  workEmail: z.string().email("Please Enter valid email address"),
  phone: z
    .string()
    .regex(/^\d{8,12}$/, "Please Enter valid number of digits acording to your country code"),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function GetQuoteModal({ children }: { children?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<any>("IN");
  const [countrySearch,setCountrySearch]=useState("");
  const [serviceSearch,setServiceSearch]=useState("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      companyName: "",
      workEmail: "",
      phone: "",
      serviceInterest: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let finalPhone = data.phone;
      const parsed = parsePhoneNumber(data.phone, country);
      if (parsed) {
        finalPhone = `+${parsed.countryCallingCode} ${parsed.nationalNumber}`;
      } else {
        const clean = data.phone.replace(/[^\d+]/g, '');
        finalPhone = clean.startsWith('+') ? clean : `+${getCountryCallingCode(country)} ${clean}`;
      }

      await submitQuote({
        name: data.name,
        workEmail: data.workEmail,
        phone: finalPhone,
        companyName: data.companyName,
        serviceInterest: data.serviceInterest,
        message: data.message,
      });
      setOpen(false);
      setShowSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Error submitting quote:", err);
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) setTimeout(() => reset(), 300);
  };

  // Standard Button style for the Homepage match
  const buttonStyle =
    "bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer border-none";

  const renderTrigger = () => {
    if (children && isValidElement(children)) {
      return cloneElement(children as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          (children as React.ReactElement<any>).props.onClick?.(e);
          setOpen(true);
        },
      });
    }

    return (
      // <button
      //   type="button"
      //   onClick={() => setOpen(true)}
      //   className={buttonStyle}
      // >
      //   Get Quote
      // </button>
      <Button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 group justify-center cursor-pointer"
      >
        Get Quote
      </Button>
    );
  };

  return (
    <>
      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Quote Request Sent!"
        description="Thanks for telling us about your project. We'll send you a proposal very soon."
      />

      {renderTrigger()}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[95vw] max-w-[500px] md:max-w-[700px] lg:max-w-[800px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl outline-none max-h-[95vh] flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

          <div className="relative bg-slate-50 dark:bg-slate-900/50 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Let&apos;s talk project
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Fill out the form and our team will get back to you within 24
                hours.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
  {/* Full Name & Company Name Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-1.5">
      <Label
        htmlFor="name"
        className="text-sm font-semibold flex items-center gap-2"
      >
        <User className="w-4 h-4 text-blue-600" /> Full Name{" "}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        placeholder="Enter your full name"
        className="rounded-xl h-11 bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-blue-600"
        {...register("name")}
      />
      {errors.name && (
        <p className="text-xs text-red-500">{errors.name.message}</p>
      )}
    </div>

    <div className="space-y-1.5">
      <Label
        htmlFor="companyName"
        className="text-sm font-semibold flex items-center gap-2"
      >
        <Building2 className="w-4 h-4 text-blue-600" /> Company Name
      </Label>
      <Input
        id="companyName"
        placeholder="e.g. Acme Corp"
        className="rounded-xl h-11 bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-blue-600"
        {...register("companyName")}
      />
    </div>
  </div>

  {/* Work Email & Phone Number Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-1.5">
      <Label
        htmlFor="workEmail"
        className="text-sm font-semibold flex items-center gap-2"
      >
        <Mail className="w-4 h-4 text-blue-600" /> Work Email{" "}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id="workEmail"
        type="email"
        placeholder="name@company.com"
        className="rounded-xl h-11 bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-blue-600"
        {...register("workEmail")}
      />
      {errors.workEmail && (
        <p className="text-xs text-red-500">{errors.workEmail.message}</p>
      )}
    </div>

    <div className="space-y-1.5">
      <Label
        htmlFor="phone"
        className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300"
      >
        <Phone className="w-4 h-4 text-blue-600" /> Phone Number{" "}
        <span className="text-red-500">*</span>
      </Label>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => {
          const FlagComponent = country ? (flags as any)[country] : null;
          return (
            <div className="flex h-11 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm items-center transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-500/30 focus-within:border-blue-500 dark:focus-within:border-blue-500">
              
              {/* Flag Section (Hover strictly scoped to this wrapper) */}
              <div
                className="relative h-full flex items-center shrink-0"
                onMouseEnter={() => setCountryOpen(true)}
                onMouseLeave={() => {
                  setCountryOpen(false);
                  setCountrySearch("");
                }}
              >
                {/* Flag Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCountryOpen((prev) => !prev);
                  }}
                  className="flex items-center justify-center px-3 h-full bg-slate-100/80 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer rounded-l-xl shrink-0"
                >
                  {FlagComponent ? (
                    <FlagComponent
                      title={country}
                      className="w-5 h-4 rounded-sm object-cover shadow-xs"
                    />
                  ) : (
                    <div className="w-5 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                  )}
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 ml-1.5 opacity-60" />
                </button>

                {/* Custom Dropdown */}
                {countryOpen && (
                  <div className="absolute left-0 top-full pt-1 z-50 w-72 before:absolute before:top-0 before:left-0 before:w-full before:h-2">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 overflow-hidden">
                      {/* Search Bar */}
                      <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <input
                          type="text"
                          placeholder="Search country or code..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Country Options */}
                      <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
                        {getCountries()
                          .filter((c) => {
                            if (!countrySearch) return true;
                            const nameStr = (en as any)[c]?.toLowerCase() || "";
                            const code = `+${getCountryCallingCode(c)}`;
                            return (
                              nameStr.includes(countrySearch.toLowerCase()) ||
                              code.includes(countrySearch) ||
                              c.toLowerCase().includes(countrySearch.toLowerCase())
                            );
                          })
                          .map((c) => {
                            const ItemFlag = (flags as any)?.[c];
                            const isSelected = country === c;
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setCountry(c);
                                  setCountryOpen(false);
                                  setCountrySearch("");
                                }}
                                className={`
                                  w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition-colors cursor-pointer
                                  ${
                                    isSelected
                                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
                                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }
                                `}
                              >
                                {ItemFlag && (
                                  <ItemFlag
                                    title={c}
                                    className="w-4 h-3 rounded-xs object-cover shrink-0 shadow-xs"
                                  />
                                )}
                                <span className="flex-1 truncate">
                                  {(en as any)[c]}
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 text-[11px] shrink-0 font-mono">
                                  +{getCountryCallingCode(c)}
                                </span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Calling Code Display */}
              <span className="pl-3 pr-1 text-sm text-slate-600 dark:text-slate-300 select-none font-medium shrink-0">
                +{country ? getCountryCallingCode(country) : ""}
              </span>

              {/* Phone Input Field (Hover here does not trigger dropdown) */}
              <input
                {...field}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  field.onChange(val);
                }}
                maxLength={country === "IN" ? 10 : 12}
                id="phone"
                type="tel"
                placeholder="Enter number"
                className="flex-1 px-2 py-1 bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0 h-full"
              />
            </div>
          );
        }}
      />
      {errors.phone && (
        <p className="text-xs text-red-500">{errors.phone.message}</p>
      )}
    </div>
  </div>
</div>

<div className="space-y-1.5">
  <Label
    htmlFor="serviceInterest"
    className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300"
  >
    <Briefcase className="w-4 h-4 text-blue-600" /> Service Interest{" "}
    <span className="text-red-500">*</span>
  </Label>
  <Controller
    name="serviceInterest"
    control={control}
    render={({ field }) => (
      <div
        className="relative group w-full"
        onMouseEnter={() => setServiceOpen(true)}
        onMouseLeave={() => {
          setServiceOpen(false);
          if (typeof setServiceSearch === "function") setServiceSearch("");
        }}
      >
        {/* Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setServiceOpen((prev) => !prev);
          }}
          className="flex h-11 w-full items-center justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 shadow-sm cursor-pointer outline-none hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          {field.value ? (
            services.find((s) => s.value === field.value)?.label
          ) : (
            <span className="text-slate-400 dark:text-slate-500">
              Select a service
            </span>
          )}
          <ChevronsUpDown className="h-4 w-4 text-slate-500 opacity-60" />
        </button>

        {/* Custom Hover Dropdown */}
        {serviceOpen && (
          <div className="absolute left-0 top-full pt-1 z-50 w-full before:absolute before:top-0 before:left-0 before:w-full before:h-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 overflow-hidden">
              <div className="max-h-52 overflow-y-auto p-1 space-y-0.5">
                {services.map((service) => {
                  const isSelected = service.value === field.value;
                  return (
                    <button
                      key={service.value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        field.onChange(service.value);
                        setServiceOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg text-left transition-colors cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }
                      `}
                    >
                      <span>{service.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  />
  {errors.serviceInterest && (
    <p className="text-xs text-red-500">
      {errors.serviceInterest.message}
    </p>
  )}
</div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="message"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" /> Project
                  Brief <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project requirements..."
                  className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-blue-600 min-h-[80px] resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 group justify-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit Request{" "}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
    </>

  );
}
