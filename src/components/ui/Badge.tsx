type BadgeVariant = 'default' | 'success' | 'warning' | 'accent' | 'outline';
type BadgeSize = 'default' | 'sm' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface text-text-secondary',
  success: 'bg-accent-emerald/10 text-accent-emerald',
  warning: 'bg-accent-warning/10 text-accent-warning',
  accent: 'bg-accent/10 text-accent',
  outline: 'bg-transparent border border-white/20 text-text-secondary',
};

const sizeClasses: Record<BadgeSize, string> = {
  default: 'px-2.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-[10px]',
  lg: 'px-3 py-1 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
