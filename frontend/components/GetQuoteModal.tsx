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
import {
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { submitLead } from "@/lib/api";

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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  workEmail: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => val && isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
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
      const phoneWithCode = data.phone.startsWith("+")
        ? data.phone
        : `${countryCode} ${data.phone}`;

      await submitLead({
        name: data.name,
        email: data.workEmail,
        phone: phoneWithCode,
        companyName: data.companyName,
        service: data.serviceInterest,
        source: "Get Quote",
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
        <DialogContent className="w-[95vw] max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl outline-none max-h-[95vh] flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

          <div className="relative bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
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

          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
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
                  <p className="text-xs text-red-500">
                    {errors.workEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-blue-600" /> Phone Number{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => {
                    const FlagComponent = country
                      ? (flags as any)[country]
                      : null;
                    return (
                      <div className="flex h-11 w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-within:ring-2 focus-within:ring-blue-600/20 transition-all items-center">
                        <Popover
                          open={countryOpen}
                          onOpenChange={setCountryOpen}
                        >
                          <PopoverTrigger className="flex items-center justify-center px-3 h-full bg-slate-100/30 border-r border-slate-200/60 outline-none cursor-pointer">
                            {FlagComponent && (
                              <FlagComponent
                                title={country}
                                className="w-5 h-4 rounded-sm object-cover"
                              />
                            )}
                            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[300px] p-0 rounded-xl"
                            align="start"
                          >
                            <Command>
                              <CommandInput
                                placeholder="Search country..."
                                className="h-9"
                              />
                              <CommandList className="max-h-60 overflow-y-auto">
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
                                        {ItemFlag && (
                                          <ItemFlag
                                            title={c}
                                            className="w-5 h-4 rounded-sm object-cover shrink-0"
                                          />
                                        )}
                                        <span className="flex-1 truncate">
                                          {(en as any)[c]}
                                        </span>
                                        <span className="text-slate-500">
                                          +{getCountryCallingCode(c)}
                                        </span>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <span className="pl-3 pr-1 text-sm text-slate-500">
                          +{country ? getCountryCallingCode(country) : ""}
                        </span>
                        <PhoneInput
                          {...field}
                          id="phone"
                          country={country}
                          placeholder="Enter number"
                          className="flex-1 px-2 py-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                    );
                  }}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="serviceInterest"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" /> Service
                  Interest <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="serviceInterest"
                  control={control}
                  render={({ field }) => (
                    <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                      <PopoverTrigger className="flex h-11 w-full items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 px-3 text-sm text-slate-900 dark:text-slate-100 cursor-pointer outline-none">
                        {field.value ? (
                          services.find((s) => s.value === field.value)?.label
                        ) : (
                          <span className="text-slate-400">
                            Select a service
                          </span>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search service..."
                            className="h-9"
                          />
                          <CommandList className="max-h-[200px]">
                            <CommandGroup>
                              {services.map((service) => (
                                <CommandItem
                                  key={service.value}
                                  onSelect={() => {
                                    field.onChange(service.value);
                                    setServiceOpen(false);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {service.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      service.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
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
                {errors.serviceInterest && (
                  <p className="text-xs text-red-500">
                    {errors.serviceInterest.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
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
                  className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-blue-600 min-h-[100px] resize-none"
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
