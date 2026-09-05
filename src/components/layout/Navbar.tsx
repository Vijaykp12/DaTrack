'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Activity, BarChart3, Clock, Sparkles, Plus, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export interface NavbarProps {
  onOpenAddEntry?: () => void;
}

export function Navbar({ onOpenAddEntry }: NavbarProps) {
  const pathname = usePathname();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleQuickSeed = async () => {
    try {
      setIsSeeding(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Sample data loaded successfully!');
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to seed sample data');
      }
    } catch {
      toast.error('Could not connect to database to seed.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5 text-white animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DaTrack
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Daily Life & Habit Tracker
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-card/60 p-1 rounded-xl border border-white/5">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              pathname === '/'
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            <Activity className="w-4 h-4" />
            <span>Daily Tracker</span>
          </Link>
          <Link
            href="/analytics"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              pathname === '/analytics'
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Insights</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Seed Demo button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickSeed}
            isLoading={isSeeding}
            title="Populate 14 days of realistic demo activities into database"
            className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Data</span>
          </Button>

          {/* Quick Add Log Button */}
          {onOpenAddEntry && (
            <Button
              variant="glow"
              size="sm"
              onClick={onOpenAddEntry}
              className="hidden sm:inline-flex"
            >
              <Plus className="w-4 h-4" />
              <span>Log Activity</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
