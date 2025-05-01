import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AlertVariants = {
  error: {
    icon: AlertCircle,
    className: "bg-danger/10 border-danger/20 text-danger"
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-warning/10 border-warning/20 text-warning"
  },
  success: {
    icon: CheckCircle,
    className: "bg-success/10 border-success/20 text-success"
  },
  info: {
    icon: Info,
    className: "bg-info/10 border-info/20 text-info"
  }
};

function AlertMessage({ variant = "info", message, onDismiss, className, role = "alert" }) {
  if (!message) return null;

  const { icon: Icon, className: variantClass } = AlertVariants[variant] || AlertVariants.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        role={role}
        className={cn(
          "flex items-start p-3 border rounded-lg backdrop-blur-sm",
          variantClass,
          className
        )}
      >
        <Icon className="shrink-0 mr-2 mt-0.5" size={16} />
        <span className="text-sm">{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto text-muted-foreground hover:text-foreground p-1 rounded-full"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AlertMessage;
