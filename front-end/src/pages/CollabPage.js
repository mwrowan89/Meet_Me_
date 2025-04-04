import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Nav from "../components/Nav";

const CollabPage = () => {
  return (
    <div className="collab-page">
      <Nav />
      <Container className="text-center mt-5">
        <Row>
          <Col>
            <Alert variant="warning">
              <h2>🚧 Page Under Construction 🚧</h2>
              <p>We're working hard to bring this page to life. Stay tuned!</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CollabPage;
