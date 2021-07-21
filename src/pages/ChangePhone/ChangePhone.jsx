import React, { useState } from "react";
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Auth } from "aws-amplify";
import routers from "router";
import { updateUserFields } from "./../../utils/services/api";

function ChangePhone({ history }) {
  const [phone, setPhone] = useState("");
  const [errMessage, setErrMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const setPhoneNumber = ({ target: { value } }) => {
      const phone = value.replace(/\D/g, "").trim();
      if (phone.length > 0 && phone.length < 11) {
        setPhone(phone.match(/\d{1,4}$|\d{1,3}/g).join(""));
      } else if (phone.length < 11) {
        setPhone(phone);
      }
  };

  // const setPhoneNumber = ({ target: { value } }) => setPhone(value.replace(/\D/g, ""));

  const onSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const phone_number = `+1${phone}`;
      await updateUserFields();
      const userCognito = await Auth.currentUserPoolUser();
      await Auth.updateUserAttributes(userCognito, { phone_number: phone_number.replace(/\s/g,'') });
      await Auth.verifyCurrentUserAttribute("phone_number");
      setLoading(false);
      history.push(routers.confirm.path, {profile: true});
    } catch (err) {
      setLoading(false);
      console.log("err", err);
      setErrMessage(err);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs="12" md={{ offset: 1, span: 10 }} lg={{ offset: 3, span: 6 }} className="p-2 py-5">
          <div className="box p-3 p-md-5">
            <Form onSubmit={onSubmit}>
              <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">Change your phone</h2>
              <Form.Control
                type="text"
                placeholder="Cell Phone Number"
                value={phone}
                data-field="phone"
                onChange={setPhoneNumber}
                required
                // pattern="^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$"
              />
              {errMessage && <Alert variant="danger">{errMessage.message}</Alert>}
              <Button variant="bns" type="submit" className="w-100" disabled={loading || !phone}>
                {loading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
                Change
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChangePhone;
