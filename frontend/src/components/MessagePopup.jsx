import { useEffect, useState } from "react";

function MessagePopup({ message, duration = 1500, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg popup-fade max-w-full max-h-full overflow-auto min-w-[300px] min-h-[200px] ">
            {message}
        </div>
    </div>
  );
}

export default MessagePopup;