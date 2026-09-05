'use client';

import React, { useState } from 'react';
import { ActivityEntryItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatMinutes } from '@/lib/formatters';
import { CATEGORIES } from '@/lib/categories';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export interface EntryItemProps {
  entry: ActivityEntryItem;
  onEdit: (entry: ActivityEntryItem) => void;
  onDelete: (id: string) => void;
}

export function EntryItem({ entry, onEdit, onDelete }: EntryItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const meta = CATEGORIES[entry.category] || CATEGORIES.PRODUCTIVE_WORK;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/entries/${entry.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Activity removed');
        onDelete(entry.id);
      } else {
        toast.error('Failed to delete activity');
      }
    } catch {
      toast.error('Network error. Could not delete.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="group relative game-card hover:shadow-md transition-all p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left indicator accent line */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full"
        style={{ backgroundColor: meta.color }}
      />

      {/* Main Info */}
      <div className="flex items-start sm:items-center gap-3 pl-2.5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-sm sm:text-base text-[#141D26]">
              {entry.title}
            </h4>
            <Badge category={entry.category} size="sm" />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatMinutes(entry.duration)}</span>
            </span>
            <span>•</span>
            <span>{meta.label}</span>
          </div>
        </div>
      </div>

      {/* Right Actions & Duration Display */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pl-2.5 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <div className="text-right sm:mr-1">
          <span className="text-base sm:text-lg font-black text-[#141D26] block">
            {formatMinutes(entry.duration)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 block -mt-1">
            {entry.duration} mins
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {showConfirm ? (
            <div className="flex items-center gap-1 animate-fade-in bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl">
              <span className="text-xs text-rose-700 font-bold">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onEdit(entry)}
                aria-label="Edit activity"
                className="p-2 rounded-xl text-slate-400 hover:text-[#141D26] hover:bg-slate-100 active:scale-95 transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                aria-label="Delete activity"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
