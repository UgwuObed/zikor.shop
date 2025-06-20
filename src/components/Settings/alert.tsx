import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX } from 'react-icons/bi';
import { CheckCircle, AlertCircle } from 'lucide-react';

type MessageAlertProps = {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
};

const MessageAlert: React.FC<MessageAlertProps> = ({ type, message, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`p-3 border-l-4 rounded-r-lg flex items-center ${
          type === 'success' 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
        )}
        <p className={`text-sm ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
        {onClose && (
          <button onClick={onClose} className="ml-auto">
            <BiX className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

export default MessageAlert;