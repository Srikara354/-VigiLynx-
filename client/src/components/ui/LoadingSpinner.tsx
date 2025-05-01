import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600"
      />
    </div>
  );
}; 