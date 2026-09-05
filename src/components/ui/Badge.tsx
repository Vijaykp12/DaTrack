import * as React from 'react';
import { cn } from '@/lib/utils';
import { ActivityCategory } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import {
  Briefcase,
  Utensils,
  Film,
  AlertTriangle,
  Dumbbell,
  Tag,
} from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: ActivityCategory;
  variant?: 'default' | 'outline' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function CategoryIcon({
  category,
  className = 'w-3.5 h-3.5',
}: {
  category: ActivityCategory;
  className?: string;
}) {
  switch (category) {
    case 'PRODUCTIVE_WORK':
      return <Briefcase className={className} />;
    case 'DAILY_NECESSITIES':
      return <Utensils className={className} />;
    case 'ENTERTAINMENT':
      return <Film className={className} />;
    case 'DISTRACTIONS':
      return <AlertTriangle className={className} />;
    case 'PERSONAL_WORK':
      return <Dumbbell className={className} />;
    default:
      return <Tag className={className} />;
  }
}

export function Badge({
  className,
  category,
  variant = 'default',
  size = 'md',
  showIcon = true,
  children,
  ...props
}: BadgeProps) {
  if (category && CATEGORIES[category]) {
    const meta = CATEGORIES[category];

    const sizeClasses = {
      sm: 'text-[11px] px-2 py-0.5 gap-1',
      md: 'text-xs px-2.5 py-1 gap-1.5',
      lg: 'text-sm px-3 py-1.5 gap-2',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-full border transition-colors select-none shrink-0',
          meta.badgeClass,
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showIcon && (
          <span className="shrink-0">
            <CategoryIcon category={category} className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          </span>
        )}
        <span>{children || meta.label}</span>
      </span>
    );
  }

  // Fallback neutral badge
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1 bg-secondary text-secondary-foreground border border-white/10',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
