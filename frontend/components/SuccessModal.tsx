import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function SuccessModal({ open, onOpenChange, title = "Success!", description = "Your request has been submitted successfully." }: SuccessModalProps) {
  useEffect(() => {
    if (open) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-8 md:p-12 flex flex-col items-center justify-center border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2rem]">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-green-50 dark:ring-green-900/10">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <DialogHeader className="w-full flex flex-col items-center">
          <DialogTitle className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">{title}</DialogTitle>
          <DialogDescription className="text-base md:text-lg text-slate-500 dark:text-slate-400 text-center max-w-[280px]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 w-full sm:justify-center">
          <Button 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-12 py-6 font-bold text-lg shadow-xl shadow-blue-600/20 cursor-pointer w-full sm:w-auto transition-all hover:scale-105"
          >
            Okay, awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
