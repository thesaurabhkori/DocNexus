import React from 'react';

// Classes Merge Helper
const cn = (...classes) => classes.filter(Boolean).join(' ');

// DocNexus Brand Matching Style Variants
const VARIANTS = {
  // Main Purple Brand Button (Get Started Free, Sign Up, Try Now)
  primary:
    'bg-[#6338F6] hover:bg-[#5229E0] active:bg-[#4319C6] text-white border border-transparent shadow-md shadow-[#6338F6]/20 hover:shadow-lg hover:shadow-[#6338F6]/30',
  
  // Secondary White Glass Button (Try All Tools, Cancel)
  secondary:
    'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200/90 shadow-xs',
  
  // Glassmorphic Blur Button (For Video / Dynamic Hero Overlays)
  glass:
    'bg-[#6338F6]/90 hover:bg-[#6338F6] backdrop-blur-md text-white border border-white/20 shadow-lg shadow-[#6338F6]/25',
  
  // White Glassmorphic Button
  glassWhite:
    'bg-white/60 hover:bg-white/80 backdrop-blur-md text-slate-900 border border-white/80 shadow-xs',
  
  // Outline Button
  outline:
    'bg-transparent hover:bg-purple-50 text-[#6338F6] border border-[#6338F6] active:bg-purple-100',
  
  // Ghost Text-only Button (Login, Navigation Links)
  ghost:
    'bg-white/20 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300',
  
  // Danger Button (Delete, Remove)
  danger:
    'bg-red-600 hover:bg-red-700 text-white border border-transparent shadow-xs',
};

// Size Presets
const SIZES = {
  sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-md min-h-[36px] whitespace-nowrap',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-lg min-h-[42px] whitespace-nowrap',
  // Mobile par text crash na ho isliye text-sm sm:text-base aur whitespace-nowrap add kiya
  lg: 'text-sm sm:text-base px-5 sm:px-8 py-3.5 gap-2 rounded-sm min-h-[48px] sm:min-h-[52px] whitespace-nowrap',
};

// Spinner Component for Loading State
const Spinner = ({ size }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <svg className={`animate-spin shrink-0 ${iconSize}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

const Button = React.forwardRef((
  {
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    leftIcon = null,
    rightIcon = null,
    loading = false,
    onClick,
    className = '',
    ...props
  },
  ref
) => {
  const isDisableState = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisableState}
      onClick={onClick}
      className={cn(
        // Base Layout
        'inline-flex items-center justify-center font-bold tracking-tight select-none cursor-pointer',
        'transition-all duration-200 ease-in-out active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6338F6] focus-visible:ring-offset-2',
        // Dynamic Variant & Size
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth ? 'w-full' : 'w-auto',
        // Disabled State
        isDisableState ? 'opacity-60 cursor-not-allowed active:scale-100 shadow-none' : '',
        className
      )}
      {...props}
    >
      {loading && <Spinner size={size} />}
      {!loading && leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;