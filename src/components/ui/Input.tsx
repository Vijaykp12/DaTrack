import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm text-[#141D26] placeholder:text-slate-400 font-medium transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141D26] focus-visible:border-[#141D26] focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 shadow-xs',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
