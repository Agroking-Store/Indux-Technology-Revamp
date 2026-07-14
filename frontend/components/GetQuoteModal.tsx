"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Loader2, ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input/input";
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
import { submitQuote } from "@/lib/api";

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

// We use a custom flex container below instead of a wrapper component so we can use a completely custom shadcn country selector.

// Form Schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  workEmail: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required").refine((val) => val && isValidPhoneNumber(val), { message: "Invalid phone number" }),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function GetQuoteModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<any>("IN");

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
      const countryCode = `+${getCountryCallingCode(country)}`;
      const phoneWithCode = data.phone.startsWith('+') ? data.phone : `${countryCode} ${data.phone}`;
      
      await submitQuote({
        name: data.name,
        workEmail: data.workEmail,
        phone: phoneWithCode,
        companyName: data.companyName,
        serviceInterest: data.serviceInterest,
        message: data.message,
      });

      setOpen(false);
      setShowSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Error submitting quote:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset after a short delay so the closing animation finishes first
      setTimeout(() => {
        reset();
      }, 300);
    }
  };

  return (
    <>
      <SuccessModal 
        open={showSuccess} 
        onOpenChange={setShowSuccess}
        title="Quote Request Sent!"
        description="Thanks for telling us about your project. We'll send you a proposal very soon."
      />
      <Dialog open={open} onOpenChange={handleOpenChange}>
      {children ? (
        <DialogTrigger render={children as React.ReactElement} />
      ) : (
        <DialogTrigger className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full shadow-md shadow-blue-500/20 text-sm transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95 cursor-pointer border-t border-white/20 items-center justify-center">
          Get Quote
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-3xl outline-none">
        {/* Fancy Header Gradient */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10"></div>
        
        <div className="p-8 pb-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white text-left">Get a Free Quote</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-left">
              Tell us about your project and we'll get back to you with a proposal.
            </DialogDescription>
          </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="name" placeholder="John Doe" className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500/50" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="Acme Corp" className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500/50" {...register("companyName")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workEmail">Work Email <span className="text-red-500">*</span></Label>
                  <Input id="workEmail" type="email" placeholder="john@company.com" className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500/50" {...register("workEmail")} />
                  {errors.workEmail && <p className="text-xs text-red-500">{errors.workEmail.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => {
                      const FlagComponent = country ? (flags as any)[country] : null;
                      return (
                        <div className="flex h-9 w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-within:ring-1 focus-within:ring-blue-500/50 transition-colors relative overflow-hidden items-center">
                          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                            <PopoverTrigger className="flex items-center justify-center px-3 h-full bg-slate-100/50 dark:bg-slate-800/50 border-r border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors shrink-0 outline-none cursor-pointer">
                              {FlagComponent ? (
                                <FlagComponent title={country} className="w-5 h-4 rounded-sm object-cover" />
                              ) : (
                                <div className="w-5 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                              )}
                              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 opacity-70 ml-1.5" />
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search country..." className="h-9" />
                                <CommandList className="max-h-64 overflow-y-auto">
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup>
                                    {getCountries().map((c) => {
                                      const ItemFlag = (flags as any)[c];
                                      return (
                                        <CommandItem
                                          key={c}
                                          value={`${(en as any)[c]} ${c}`}
                                          onSelect={() => {
                                            setCountry(c);
                                            setCountryOpen(false);
                                          }}
                                          className="cursor-pointer flex items-center gap-2"
                                        >
                                          {ItemFlag && <ItemFlag title={c} className="w-5 h-4 rounded-sm object-cover shrink-0" />}
                                          <span className="flex-1 truncate">{(en as any)[c]}</span>
                                          <span className="text-slate-500">+{getCountryCallingCode(c)}</span>
                                          <Check
                                            className={cn(
                                              "ml-2 h-4 w-4 shrink-0",
                                              country === c ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          
                          {/* Fixed Country Code Prefix */}
                          <span className="pl-3 pr-1 text-sm text-slate-500 dark:text-slate-400 select-none">
                            +{country ? getCountryCallingCode(country) : ""}
                          </span>
                          
                          <PhoneInput
                            {...field}
                            id="phone"
                            country={country}
                            onCountryChange={setCountry}
                            placeholder="98765 43210"
                            maxLength={16}
                            className="flex-1 pr-3 py-1 bg-transparent outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0"
                          />
                        </div>
                      );
                    }}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceInterest">Service of Interest <span className="text-red-500">*</span></Label>
                <Controller
                  name="serviceInterest"
                  control={control}
                  render={({ field }) => (
                    <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                      <PopoverTrigger 
                        role="combobox"
                        className={cn(
                          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 font-normal px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-slate-100 cursor-pointer",
                          !field.value && "text-slate-500 dark:text-slate-400"
                        )}
                      >
                          {field.value
                            ? services.find((s) => s.value === field.value)?.label
                            : "Select a service"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl" 
                        align="start" 
                        side="bottom"
                        sideOffset={4}
                      >
                        <Command>
                          <CommandInput placeholder="Search service..." className="h-9" />
                          <CommandList className="max-h-[200px] overflow-y-auto">
                            <CommandEmpty>No service found.</CommandEmpty>
                            <CommandGroup>
                              {services.map((service) => (
                                <CommandItem
                                  value={service.label}
                                  key={service.value}
                                  onSelect={() => {
                                    field.onChange(service.value)
                                    setServiceOpen(false)
                                  }}
                                  className="cursor-pointer"
                                >
                                  {service.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      service.value === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.serviceInterest && <p className="text-xs text-red-500">{errors.serviceInterest.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your project requirements..." 
                  className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500/50 min-h-[100px] resize-none" 
                  {...register("message")} 
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-semibold shadow-md shadow-blue-500/20 group transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
                  ) : (
                    <>Send Request <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
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
