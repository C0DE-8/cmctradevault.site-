import { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import s from "./Dialog.module.css";
export default function Dialog({ title, children, onClose }) {
  const ref = useRef(null),
    id = useId();
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.inner}>
        <header>
          <div>
            <span>CMC TRADEVAULT</span>
            <h2 id={id}>{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <FiX />
          </button>
        </header>
        {children}
      </div>
    </dialog>,
    document.body,
  );
}
