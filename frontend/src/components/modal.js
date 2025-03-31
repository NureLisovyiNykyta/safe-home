import ReactDOM from 'react-dom';
import '../App.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="content">
        {/* <button className="close-button" onClick={onClose}>
          &times;
        </button> */}
        {children}
      </div>
      <div className="overlay" onClick={onClose}></div>
    </div>,
    document.body
  );
}

export default Modal;
