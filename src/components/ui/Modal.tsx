'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dark Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Solid Opaque White Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full rounded-t-3xl sm:rounded-3xl bg-white text-[#141D26] border border-slate-200/90 shadow-2xl p-5 sm:p-7 z-10 max-h-[88vh] sm:max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in',
          maxWidthClasses[maxWidth]
        )}
        style={{ backgroundColor: '#FFFFFF', opacity: 1 }}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

        {/* Header (Fixed at top of modal) */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="space-y-0.5 pr-4">
            {title && (
              <h2 className="text-lg sm:text-xl font-black text-[#141D26] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 -mr-1"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="pt-3 overflow-y-auto flex-1 overscroll-contain pr-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}
