
function Popup({ show, onClose, children, headerContent }) {
    if (!show) return null
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="bg-gray-200 rounded-xl shadow-lg popup-fade max-w-full max-h-full overflow-auto min-w-[300px] min-h-[200px]">
          {/* Header */}
          <div className="bg-gray-300 flex items-center justify-between px-4 py-2 rounded-t-xl">
            <div className="flex-1 ">{headerContent}</div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-lg"
              aria-label="Close popup"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center justify-center p-6 text-center">
            {children}
          </div>
        </div>
      </div>
    )
  }
  
  export default Popup