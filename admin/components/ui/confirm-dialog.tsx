import React, { ReactElement } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  /** The element that triggers the dialog (e.g., a button) */
  trigger?: ReactElement;
  /** Main title of the dialog */
  title: string;
  /** Detailed description of the action */
  description: string;
  /** Function to execute when confirmed */
  onConfirm: () => void;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Icon to display at the top of the dialog */
  icon?: 'trash' | 'logout' | 'alert';
  /** Visual variant affecting colors */
  variant?: 'destructive' | 'default';
  /** External control for open state (optional) */
  isOpen?: boolean;
  /** External control for state changes (optional) */
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = "Yes, delete",
  cancelText = "Cancel",
  icon = 'trash',
  variant = 'destructive',
  isOpen,
  onOpenChange
}: ConfirmDialogProps) {
  const Icon = icon === 'trash' ? Trash2 : icon === 'logout' ? LogOut : AlertCircle;
  const isNativeButton = React.isValidElement(trigger) && (
    trigger.type === 'button' || typeof trigger.type !== 'string'
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger nativeButton={isNativeButton} render={trigger} />}
      
      <AlertDialogContent className="sm:max-w-[400px] p-0 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl !gap-0 overflow-visible mt-8 bg-white dark:bg-slate-950">
        
        {/* Top accent bar */}
        <div className={cn(
          "w-full h-3 rounded-t-2xl absolute top-0 left-0",
          variant === 'destructive' ? "bg-red-500" : "bg-indigo-500"
        )} />

        {/* Overlapping Icon */}
        <div className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2 size-20 rounded-full flex items-center justify-center border-[6px] border-white dark:border-slate-950 z-10", 
          variant === 'destructive' ? "bg-red-500 text-white" : "bg-indigo-500 text-white"
        )}>
          <Icon className="size-9" strokeWidth={2} />
        </div>

        <div className="pt-14 pb-8 px-8 flex flex-col items-center text-center relative z-0">
          <AlertDialogHeader className="mb-2 !space-y-0 w-full flex flex-col items-center">
            <AlertDialogTitle className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 text-center w-full">
              {title}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <AlertDialogDescription className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed mt-1">
            {description}
          </AlertDialogDescription>
          
          <AlertDialogFooter className="flex w-full gap-4 mt-8 sm:justify-center !m-0">
            <AlertDialogCancel className="w-full sm:w-1/2 h-12 px-4 rounded-lg text-slate-600 dark:text-slate-300 font-semibold border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all m-0 text-base cursor-pointer">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm} 
              className={cn(
                "w-full sm:w-1/2 h-12 px-4 rounded-lg font-semibold text-white shadow-sm transition-all m-0 border-0 text-base cursor-pointer",
                variant === 'destructive' 
                  ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" 
                  : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              )}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
