"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { submitLead } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-number-input/input";
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react";
import { SuccessModal } from "@/components/SuccessModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters.")
    .regex(/^[^0-9]*$/, "Name must not contain numbers."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(1, "Phone number is required").refine((val) => val && isValidPhoneNumber(val), { message: "Invalid phone number" }),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<any>("IN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await submitLead({ ...data, source: "Contact Us" });
      setShowSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to submit message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SuccessModal 
        open={showSuccess} 
        onOpenChange={setShowSuccess}
        title="Message Sent!"
        description="Thanks for reaching out. Our team will get back to you very soon!"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-500">
              Your Name *
            </Label>
            <Input
              {...register("name")}
              placeholder="John Doe"
              className="h-14 px-4 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400"
            />
            {errors.name && (
              <p className="text-red-500 text-xs ml-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-500">
              Email *
            </Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="hello@example.com"
              className="h-14 px-4 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs ml-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-500">Phone *</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => {
              const FlagComponent = country ? (flags as any)[country] : null;
              return (
                <div className="flex h-14 w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition-colors relative overflow-hidden items-center">
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger type="button" className="flex items-center justify-center px-4 h-full bg-slate-100/50 dark:bg-slate-800/90 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors shrink-0 outline-none cursor-pointer">
                      {FlagComponent ? (
                        <FlagComponent title={country} className="w-6 h-5 rounded-sm object-cover" />
                      ) : (
                        <div className="w-6 h-5 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                      )}
                      <ChevronsUpDown className="w-4 h-4 text-slate-500 dark:text-slate-400 opacity-70 ml-2" />
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-[300px] p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                      align="start"
                    >
                      <Command className="dark:bg-slate-900">
                        <CommandInput placeholder="Search country..." className="h-9 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400" autoFocus={false} />
                        <CommandList className="max-h-64 overflow-y-auto">
                          <CommandEmpty className="py-2 text-center text-xs text-slate-500 dark:text-slate-400">No country found.</CommandEmpty>
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
                                  className="cursor-pointer flex items-center gap-2 text-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                                >
                                  {ItemFlag && <ItemFlag title={c} className="w-5 h-4 rounded-sm object-cover shrink-0" />}
                                  <span className="flex-1 truncate text-slate-900 dark:text-slate-100">{(en as any)[c]}</span>
                                  <span className="text-slate-500 dark:text-slate-400">+{getCountryCallingCode(c)}</span>
                                  <Check
                                    className={cn(
                                      "ml-2 h-4 w-4 shrink-0 text-slate-900 dark:text-slate-100",
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
                  
                  <span className="pl-4 pr-1 text-base text-slate-600 dark:text-slate-300 select-none font-medium">
                    +{country ? getCountryCallingCode(country) : ""}
                  </span>
                  
                  <PhoneInput
                    {...field}
                    id="contact-phone"
                    country={country}
                    international={false}
                    placeholder="98765 43210"
                    maxLength={16}
                    className="flex-1 pr-4 py-2 bg-transparent outline-none text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 min-w-0 h-full"
                  />
                </div>
              );
            }}
          />
          {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-500">
            Your Message *
          </Label>
          <Textarea
            {...register("message")}
            placeholder="Tell us about your project goals..."
            className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 resize-none"
          ></Textarea>
          {errors.message && (
            <p className="text-red-500 text-xs ml-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-fit bg-[#0f2e4a] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-full px-10 py-7 font-bold tracking-wide text-base transition-all shadow-xl shadow-blue-900/20 mt-4 group disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Sending..." : "Send Message"}{" "}
          {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>
    </>
  );
}