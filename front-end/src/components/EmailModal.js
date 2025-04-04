import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const EmailModal = ({ show, handleClose, defaultSubject, defaultMessage }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [message, setMessage] = useState(defaultMessage || "");

  useEffect(() => {
    setSubject(defaultSubject || "");
    setMessage(defaultMessage || "");
  }, [defaultSubject, defaultMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email sent to:", recipientEmail);
    console.log("Subject:", subject);
    console.log("Message:", message);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Everyone's Invited!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRecipientEmail">
            <Form.Label>Recipient's Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSubject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Send Email
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmailModal;
