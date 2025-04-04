import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";

function FailureAlert({ children }) {
  const message = children;
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, [message]);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>{message}</p>
      </Alert>
    );
  }
}

export default FailureAlert;
