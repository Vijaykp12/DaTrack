'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ActivityCategory, ActivityEntryItem, CreateEntryInput } from '@/types';
import {
  CATEGORIES,
  CATEGORY_LIST,
  ACTIVITY_PRESETS,
  DURATION_QUICK_PRESETS,
} from '@/lib/categories';
import { formatMinutes } from '@/lib/formatters';
import { toast } from 'sonner';
import { Plus, Check, Clock, Sparkles } from 'lucide-react';

export interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  editingEntry?: ActivityEntryItem | null;
  onSuccess: (entry: ActivityEntryItem, isEdit: boolean) => void;
}

export function AddEntryModal({
  isOpen,
  onClose,
  selectedDate,
  editingEntry,
  onSuccess,
}: AddEntryModalProps) {
  const isEditing = Boolean(editingEntry);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('PRODUCTIVE_WORK');
  const [duration, setDuration] = useState<number>(30);
  const [date, setDate] = useState(selectedDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setCategory(editingEntry.category);
      setDuration(editingEntry.duration);
      setDate(editingEntry.date);
    } else {
      setTitle('');
      setCategory('PRODUCTIVE_WORK');
      setDuration(30);
      setDate(selectedDate);
    }
  }, [editingEntry, selectedDate, isOpen]);

  const handleApplyPreset = (preset: (typeof ACTIVITY_PRESETS)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setDuration(preset.duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter an activity title');
      return;
    }

    if (!duration || duration <= 0) {
      toast.error('Please enter a duration greater than 0 minutes');
      return;
    }

    setIsSubmitting(true);

    const generatedId = editingEntry ? editingEntry.id : `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const optimisticEntry: ActivityEntryItem = {
      id: generatedId,
      title: title.trim(),
      category,
      duration: Number(duration),
      date,
      createdAt: editingEntry ? editingEntry.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Instant UI update
    onSuccess(optimisticEntry, isEditing);
    toast.success(isEditing ? 'Activity updated! +25 XP' : '🎉 Activity logged! +50 XP earned!');
    onClose();
    setIsSubmitting(false);

    // Background sync to database
    try {
      console.log('[DaTrack Client] Sending activity to server:', optimisticEntry);
      if (isEditing && editingEntry) {
        const res = await fetch(`/api/entries/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            category,
            duration: Number(duration),
            date,
          }),
        });
        const json = await res.json();
        console.log('[DaTrack Client] Server update response:', json);
      } else {
        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            category,
            duration: Number(duration),
            date,
          } as CreateEntryInput),
        });
        const json = await res.json();
        console.log('[DaTrack Client] Server create response:', json);

        if (json.dbStatus === 'fallback_used') {
          console.warn('[DaTrack Client] ⚠️ Activity saved locally, but NOT in Supabase! Database debug details:', json.debugDetails);
        } else if (json.dbStatus === 'connected') {
          console.log('[DaTrack Client] ✅ Activity successfully written into Supabase PostgreSQL table!');
        }
      }
    } catch (syncErr) {
      console.error('[DaTrack Client] Background database sync network error:', syncErr);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Activity Entry' : 'Log New Activity'}
      description={
        isEditing
          ? 'Modify duration, category or title for this entry'
          : 'Record time spent to track productive habits and level up'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full text-[#141D26]">
        {/* Scrollable Form Fields */}
        <div className="space-y-4 pb-4">
          {/* Quick presets for one-tap fill */}
          {!isEditing && (
            <div className="space-y-1.5 pb-0.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Presets:</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
                {ACTIVITY_PRESETS.slice(0, 8).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#141D26] hover:text-[#C6F432] text-slate-700 border border-slate-200 text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 shadow-2xs"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Activity Title <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="e.g. Coding project, Workout, Reading, YouTube..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus={!isEditing}
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORY_LIST.map((catKey) => {
                const meta = CATEGORIES[catKey];
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#141D26] text-white border-[#141D26] ring-2 ring-[#C6F432] font-bold shadow-md'
                        : 'bg-[#F8FAFC] border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: meta.color }}
                      />
                      <span className="text-xs sm:text-sm font-bold">{meta.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#C6F432] shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Input & Quick Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Duration <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-black text-[#141D26] flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                {formatMinutes(Number(duration))} ({duration} mins)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="1440"
                value={duration || ''}
                onChange={(e) => setDuration(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="Minutes (e.g. 45)"
                className="flex-1"
                required
              />
              <span className="text-xs font-bold text-slate-500">minutes</span>
            </div>

            {/* Duration Quick Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {DURATION_QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setDuration(preset.minutes)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all ${
                    duration === preset.minutes
                      ? 'bg-[#141D26] text-[#C6F432] border-[#141D26] shadow-sm'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Sticky Action Footer (Always visible above mobile screen) */}
        <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 flex items-center justify-end gap-2.5 mt-auto z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-[#141D26] text-[#C6F432] font-extrabold text-xs shadow-md hover:bg-slate-800 active:scale-95 transition-all min-w-[130px] flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isEditing ? 'Save Changes' : 'Log Activity'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
