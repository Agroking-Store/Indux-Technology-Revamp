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
      
      {/* 
        We override the default p-4 and rounded-xl of AlertDialogContent 
        to achieve a premium edge-to-edge footer and larger border radius.
      */}
      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl !gap-0">
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className={cn(
            "size-16 rounded-full flex items-center justify-center mb-5", 
            variant === 'destructive' 
              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500" 
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          )}>
            <Icon className="size-8" strokeWidth={1.5} />
          </div>
          
          <AlertDialogHeader className="mb-2 !space-y-0 w-full flex flex-col items-center">
            <AlertDialogTitle className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white text-center w-full">
              {title}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <AlertDialogDescription className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed mt-2">
            {description}
          </AlertDialogDescription>
        </div>
        
        <AlertDialogFooter className="bg-slate-50/80 dark:bg-slate-900/50 px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex sm:justify-center gap-3 w-full !m-0 !rounded-none">
          <AlertDialogCancel className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all m-0 text-base cursor-pointer">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className={cn(
              "w-full sm:w-1/2 px-6 py-3.5 rounded-xl font-bold text-white shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 m-0 text-base cursor-pointer",
              variant === 'destructive' 
                ? "bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 hover:shadow-rose-600/25" 
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 hover:shadow-indigo-600/25"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
