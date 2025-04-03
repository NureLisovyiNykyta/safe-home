import ReactDOM from "react-dom";
import { useEffect } from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, children, message = null, showCloseButton = false, autoCloseTime = 10000 }) => {
  useEffect(() => {
    if (isOpen && autoCloseTime) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={`modal ${showCloseButton ? "notification" : "form"}`}>
      <div className="overlay" onClick={onClose}></div>
      <div className="content">
        {message && <p>{message}</p>}
        {children}
        {showCloseButton && (
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
