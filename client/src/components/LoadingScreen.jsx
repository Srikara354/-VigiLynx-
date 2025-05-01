import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const loadingTextVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 1.5,
    }
  }
};

const shieldVariants = {
  animate: {
    scale: [0.9, 1, 0.9],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.2, 0, 0.2],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeOut"
    }
  }
};

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="relative">
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute inset-0 bg-primary rounded-full"
        />
        <motion.div
          variants={shieldVariants}
          animate="animate"
          className="h-24 w-24 rounded-full border-4 border-primary/30 border-t-primary"
          style={{ 
            animationTimingFunction: "linear",
            animation: "spin 1s infinite linear"
          }}
        />
        <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary h-12 w-12" />
      </div>
      
      <motion.h2 
        className="mt-6 text-2xl font-bold text-foreground"
        variants={loadingTextVariants}
        animate="animate"
      >
        VigiLynx
      </motion.h2>
      
      <div className="flex items-center gap-2 mt-2">
        <motion.div 
          className="h-1.5 w-1.5 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            delay: 0 
          }}
        />
        <motion.div 
          className="h-1.5 w-1.5 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            delay: 0.2 
          }}
        />
        <motion.div 
          className="h-1.5 w-1.5 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            delay: 0.4 
          }}
        />
      </div>

      <p className="text-muted-foreground mt-4 max-w-sm text-center px-4">
        Securing your digital frontier with advanced protection technologies
      </p>
    </div>
  );
}

export default LoadingScreen;
