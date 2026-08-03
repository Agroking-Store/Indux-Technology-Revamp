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
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react";
import { SuccessModal } from "@/components/SuccessModal";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters.")
    .regex(/^[^0-9]*$/, "Name must not contain numbers."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .regex(/^\d{8,12}$/, "Phone number must be between 8 to 12 digits"),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<any>("IN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

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
      let finalPhone = data.phone;
      const parsed = parsePhoneNumber(data.phone, country);
      if (parsed) {
        finalPhone = `+${parsed.countryCallingCode} ${parsed.nationalNumber}`;
      } else {
        const clean = data.phone.replace(/[^\d+]/g, "");
        finalPhone = clean.startsWith("+")
          ? clean
          : `+${getCountryCallingCode(country)} ${clean}`;
      }

      await submitLead({ ...data, phone: finalPhone });
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
              <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>
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
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-500">
            Phone *
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => {
              const FlagComponent = country ? (flags as any)[country] : null;
              return (
                <div className="relative">
                  {/* Main input row */}
                  <div className="flex h-14 w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition-colors overflow-hidden items-center">
                    {/* Country selector button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCountryOpen((prev) => !prev);
                      }}
                      className="flex items-center justify-center px-4 h-full bg-slate-100/50 dark:bg-slate-800/90 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors shrink-0 outline-none cursor-pointer"
                    >
                      {FlagComponent ? (
                        <FlagComponent
                          title={country}
                          className="w-6 h-5 rounded-sm object-cover"
                        />
                      ) : (
                        <div className="w-6 h-5 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                      )}
                      <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </button>

                    {/* Country code display */}
                    <span className="pl-4 pr-1 text-base text-slate-600 dark:text-slate-300 select-none font-medium">
                      +{country ? getCountryCallingCode(country) : ""}
                    </span>

                    {/* Phone number input */}
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
                      className="flex-1 pr-4 py-2 bg-transparent outline-none text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 min-w-0 h-full"
                    />
                  </div>

                  {/* Custom dropdown*/}
                  {countryOpen && (
                    <>
                      {/* Backdrop to close on outside click */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setCountryOpen(false)}
                      />

                      {/* Dropdown panel */}
                      <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-75 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                          <input
                            type="text"
                            placeholder="Search country..."
                            autoFocus={false}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Country list */}
                        <div className="max-h-64 overflow-y-auto">
                          {getCountries()
                            .filter((c) => {
                              if (!countrySearch) return true;
                              const name = (en as any)[c]?.toLowerCase() || "";
                              const code = `+${getCountryCallingCode(c)}`;
                              return (
                                name.includes(countrySearch.toLowerCase()) ||
                                code.includes(countrySearch) ||
                                c
                                  .toLowerCase()
                                  .includes(countrySearch.toLowerCase())
                              );
                            })
                            .map((c) => {
                              const ItemFlag = (flags as any)[c];
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
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                  {ItemFlag && (
                                    <ItemFlag
                                      title={c}
                                      className="w-5 h-4 rounded-sm object-cover shrink-0"
                                    />
                                  )}
                                  <span className="flex-1 truncate text-slate-900 dark:text-slate-100">
                                    {(en as any)[c]}
                                  </span>
                                  <span className="text-slate-500 dark:text-slate-400 shrink-0">
                                    +{getCountryCallingCode(c)}
                                  </span>
                                  {country === c && (
                                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-500">
            Your Message *
          </Label>
          <Textarea
            {...register("message")}
            placeholder="Tell us about your project goals..."
            className="min-h-30 p-4 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 resize-none"
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
          {!isSubmitting && (
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </form>
    </>
  );
}
