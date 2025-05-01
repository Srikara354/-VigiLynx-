import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { LoadingSpinner } from './LoadingSpinner';
import type { BaseProps, WithChildren, WithLoading, WithDisabled, WithOnClick, WithLeftIcon, WithRightIcon, WithAsChild } from '@/types';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 active:bg-gray-100',
        primary: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
        outline: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'bg-transparent text-gray-900 hover:bg-gray-50',
        link: 'text-gray-900 underline-offset-4 hover:underline',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends BaseProps,
    WithChildren,
    WithLoading,
    WithDisabled,
    WithOnClick,
    WithLeftIcon,
    WithRightIcon,
    WithAsChild,
    VariantProps<typeof buttonVariants> {
  type?: 'button' | 'submit' | 'reset';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, leftIcon, rightIcon, children, type = 'button', ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <LoadingSpinner className="mr-2" size="sm" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };