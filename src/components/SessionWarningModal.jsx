import React from "react";
import { useEffect, useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";

function SessionWarningModal({ show, countdown, onStayLoggedIn }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (countdown && countdown > 0) {
      setProgress((countdown / 60) * 100);
    }
  }, [countdown]);

  return (
    <Modal show={show} centered backdrop="static">
      <Modal.Header>
        <Modal.Title> ⚠ Session Expiring Soon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Your session will expire in <strong>{countdown}</strong> seconds.
        </p>
        <ProgressBar
          now={progress}
          variant="warning"
          animated
          label={`${countdown}s`}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={onStayLoggedIn}>
          Stay Logged In
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default React.memo(SessionWarningModal);
