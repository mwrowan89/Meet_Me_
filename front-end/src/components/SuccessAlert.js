import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";

function SuccessAlert({ show, onClose, children }) {
  const message = children;
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (show) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          onClose();
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, message, onClose]);

  if (show) {
    return (
      <Alert
        variant="success"
        className={`alert-custom-green ${fadeOut ? "fade-out" : ""}`}
        onClose={onClose}
      >
        <Alert.Heading>Success!</Alert.Heading>
        <p>{message}</p>
      </Alert>
    );
  }

  return null;
}

export default SuccessAlert;
