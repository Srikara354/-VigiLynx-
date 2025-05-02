import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type LoadingSpinnerProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={cn("flex items-center justify-center", size === 'lg' ? 'min-h-[50vh]' : '', className)}>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={cn(
          sizeClasses[size], 
          "rounded-full border-indigo-200 border-t-indigo-600"
        )}
      />
    </div>
  );
};