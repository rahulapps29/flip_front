import React from "react";
import "./CustomDialog.css"; // Import the CSS file

const CustomDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className={`dialog-box ${type}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          {onCancel && (
            <button className="cancel-btn" onClick={onCancel}>
              {cancelText || "Cancel"}
            </button>
          )}
          <button className="confirm-btn" onClick={onConfirm}>
            {confirmText || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
