import BNSDropDown from "@components/Utilities/BNSDropDown";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
function Home() {
  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <BNSDropDown
                selectedOption={{ name: "All" }}
                options={[{ name: "All" }, { name: "Admin" }, { name: "User" }]}
              />
            </Form.Group>
            <Button variant="bns" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
