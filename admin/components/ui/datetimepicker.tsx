"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  field: ControllerRenderProps<any, any>;
  disabled?: boolean;
}

export function DateTimePicker({
  field,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const timeRef = React.useRef<HTMLInputElement>(null);
  const value = field.value ? new Date(field.value) : undefined;

  const updateDate = (date?: Date) => {
    if (!date) return;

    const current = value ?? new Date();

    date.setHours(current.getHours());
    date.setMinutes(current.getMinutes());
    date.setSeconds(0);
    date.setMilliseconds(0);

    field.onChange(date.toISOString());

    // Close calendar after selecting date
    setOpen(false);
  };

  const updateTime = (time: string) => {
    const date = value ?? new Date();

    const [hours, minutes] = time.split(":").map(Number);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    field.onChange(date.toISOString());
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
  render={
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={cn(
        "w-full justify-between text-left font-normal cursor-pointer",
        !value && "text-muted-foreground"
      )}
    >
      {value ? format(value, "PPP") : "Pick a date"}
      <CalendarIcon className="h-4 w-4 opacity-60" />
    </Button>
  }
/>

        <PopoverContent className="w-auto p-0" align="start">
        <Calendar
  mode="single"
  selected={value}
  onSelect={(date) => {
    updateDate(date);
    setOpen(false);
  }}
/>
        </PopoverContent>
      </Popover>
      <div
  className="cursor-pointer"
  onClick={() => {
    timeRef.current?.showPicker?.();
  }}
>
  <Input
    ref={timeRef}
    type="time"
    className="cursor-pointer"
    disabled={disabled}
    value={value ? format(value, "HH:mm") : ""}
    onChange={(e) => {
      updateTime(e.target.value);
    }}
  />
</div>
    </div>
  );
}