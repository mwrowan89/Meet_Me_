import React from "react";
import { Container, Row, Col, Stack, Image } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container fluid>
        <Row className=" text-white">
          <Col className="mx-4 py-2 text-center text-md-start">
            <Stack>
              <Image
                src="data:image/png;base64,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"
                alt="CS50 Logo"
                roundedCircle
                width="50"
                height="50"
              />
            </Stack>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
