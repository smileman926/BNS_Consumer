import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import "./ContactUs.style.scss";
import { contactUs } from "utils/services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faCheck } from "@fortawesome/free-solid-svg-icons";
import { contact_description } from "@redux/settings/Selector";
import { Helmet } from "react-helmet";
function ContactUs(props) {
  let authFirstName = "";
  let authLastName = "";
  let authEmail = "";
  let authPhone = "";

  if (props.user) {
    const { first_name, last_name, email, phone_number } = props.user;
    authFirstName = first_name;
    authLastName = last_name;
    authEmail = email;
    authPhone = phone_number;
  }
  const [firstName, setFirstName] = useState(authFirstName);
  const [lastName, setLastName] = useState(authLastName);
  const [email, setEmail] = useState(authEmail);
  const [phone, setPhone] = useState(authPhone);
  const [message, setMessage] = useState("");

  const [isLoad, setIsLoad] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const onChange = ({ target }) => {
    switch (target.dataset.field) {
      case "firstName":
        setFirstName(target.value);
        break;
      case "lastName":
        setLastName(target.value);
        break;
      case "email":
        setEmail(target.value);
        break;
      case "phone":
        setPhone(target.value.replace(/\D/g, ""));
        break;
      case "message":
        setMessage(target.value);
        break;
      default:
        return;
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setErrMessage(null);
    setIsLoad(true);
    contactUs({
      firstName,
      lastName,
      email,
      phone,
      message,
    })
      .then((res) => {
        setIsLoad(false);
        setModalShow(true);
      })
      .catch((err) => {
        setIsLoad(false);
        setErrMessage(err);
      });
  };
  const [modalShow, setModalShow] = useState(false);
  const closeModal = () => {
    setModalShow(false);
  };

  return (
    <>
      <Helmet>
          {/* <!-- HTML Meta Tags --> */}
          <title>Contact Us</title>
          <link rel="canonical" href={window.location.href} />
          <meta
          name="description"
          content="Contact to The BM Revolution"
          />

          {/* <!-- Google / Search Engine Tags --> */}
          <meta itemprop="name" content="Contact Us" />
          <meta
          itemprop="description"
          content="Contact to The BM Revolution"
          />
       
          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Contact Us" />
          <meta
          property="og:description"
          content="Contact to The BM Revolution"
          />

          {/* <!-- Twitter Meta Tags --> */}
          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content="Contact Us" />
          <meta
          name="twitter:description"
          content="Contact to The BM Revolution"
          />
      </Helmet>
      <Modal
        show={modalShow}
        onHide={closeModal}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-bns"
      >
        <Modal.Header closeButton>
          <FontAwesomeIcon icon={faCheck} className="icon-successfully" />
        </Modal.Header>
        <Modal.Body>
          <h2>Successfully!</h2>
        </Modal.Body>
      </Modal>
      <Container className="contact-us">
        <Row>
          <Col
            xs="12"
            md={{ offset: 1, span: 10 }}
            lg={{ offset: 2, span: 8 }}
            className="p-2 py-5"
          >
            <div className="box p-3 p-md-3 pr-md-5 pl-md-5">
              <Form onSubmit={onSubmit}>
                <h2 className="title text-center font-weight-bold ">Contact Us</h2>

                <Row>
                  <Col md={{ offset: 1, span: 10 }}>
                    <p className="text-center text-secondary mb-4">{props.contactUs}</p>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={onChange}
                      data-field="firstName"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={onChange}
                      data-field="lastName"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={onChange}
                      data-field="email"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Phone"
                      value={phone}
                      onChange={onChange}
                      data-field="phone"
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder="Message"
                      onChange={onChange}
                      data-field="message"
                      value={message}
                      required
                    />
                  </Col>
                </Row>
                {errMessage && <Alert variant="danger">{errMessage.message}</Alert>}
                <Button variant="bns" type="submit" className="w-100" disabled={isLoad}>
                  {isLoad && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
                  Submit Now
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  contactUs: contact_description(state),
});

export default connect(mapStateToProps, null)(ContactUs);
