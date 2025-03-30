import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded shadow-lg text-white flex items-center gap-2 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto">
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;