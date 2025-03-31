import ReactDOM from 'react-dom';
import '../App.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="content">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
