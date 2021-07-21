import React, { useState, useEffect } from "react";
import * as style from "./Confirm.module.scss";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import SixNumeric from "@components/SixNumeric";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Auth } from "aws-amplify";
import routers from "./../../router";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import authActions from "@redux/auth/Actions";

function Confirm({requestLogin, location}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  const history = useHistory();

  const sendCode = () => {
    setError(null);
    setLoading(true);
    Auth.verifyCurrentUserAttributeSubmit("phone_number", code)
      .then((res) => {
        console.log(res);
        if (res === 'SUCCESS'){
          if (location?.state?.profile)
            history.push(routers.myProfile.path, {isUpdated: true});
          else{
            requestLogin();
            history.push(routers.login.path);
          }
        } 
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    Auth.currentUserInfo()
      .then(({ attributes }) => {
        setPhone(attributes.phone_number);
      })
      .catch((err) => console.log("err", err));
  }, []);

  const resendCode = () => {
    setError(null);
    setLoading(true);
    Auth.verifyCurrentUserAttribute("phone_number")
      .then((res) => {
        console.log("res resend", res);
      })
      .catch((err) => {
        setError(err);
        console.log("err resend", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <Row>
        <Col
          xs={12}
          sm={{ offset: 1, span: 10 }}
          md={{ span: 8, offset: 2 }}
          className="p-2 py-sm-5"
        >
          <div className="box p-3 p-md-5">
            <h2>Confirm your phone</h2>
            <p className={`text-center text-secondary pb-2 ${style.confirm}`}>
              Please enter the 6 digit code sent to <span>{phone}</span>
            </p>
            <SixNumeric handler={setCode} />
            {error && <Alert variant="danger">{error.message}</Alert>}
            <Button
              variant="bns"
              type="submit"
              className="mx-auto px-5"
              disabled={loading}
              onClick={sendCode}
            >
              {loading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
              confirm
            </Button>
            <button type="button" onClick={resendCode} className={style.resend} disabled={loading}>
              {loading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
              resend code
            </button>
            <Link to={routers.changePhone.path} className={style.change}>
                  Change phone
                </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  requestLogin: (data) => dispatch(authActions.loginRequest(data)),
});

export default connect(null, mapDispatchToProps)(Confirm);
