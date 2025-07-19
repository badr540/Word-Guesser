import { useEffect, useState } from "react";

function MessagePopup({ message, duration = 1500, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!visible && onClose) {
      onClose();
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg popup-fade max-w-full max-h-full overflow-auto p-5">
            {message}
        </div>
    </div>
  );
}

export default MessagePopup;