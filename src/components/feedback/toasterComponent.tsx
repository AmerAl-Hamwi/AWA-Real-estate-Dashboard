import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { ToasterMessage } from '@/hooks/custom/useToaster';

const ToasterComponent = ({ toaster }: { toaster: ToasterMessage | null }) => {
  if (!toaster) return null;

  const renderIcon = () => {
    switch (toaster.type) {
      case 'success':
        return <CheckCircleIcon className="text-white mr-2" />;
      case 'error':
        return <ErrorIcon className="text-white mr-2" />;
      case 'warning':
        return <WarningIcon className="text-white mr-2" />;
      case 'info':
        return <InfoIcon className="text-white mr-2" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="toaster"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          'fixed bottom-4 right-0 -translate-x-2 py-3 px-4 rounded-lg shadow-lg text-white min-w-[240px] flex items-center z-50',
          {
            'bg-green-600': toaster.type === 'success',
            'bg-red-600': toaster.type === 'error',
            'bg-amber-600': toaster.type === 'warning',
            'bg-blue-600': toaster.type === 'info',
          }
        )}
        role="alert"
        aria-live="assertive"
      >
        {renderIcon()}
        <span>{toaster.message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToasterComponent;