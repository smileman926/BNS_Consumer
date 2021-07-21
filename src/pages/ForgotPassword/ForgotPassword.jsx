import SixNumeric from "@components/SixNumeric/SixNumeric";
import { faCheck, faSync, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import withCheckAuth from "utils/HOC/withCheckAuth";
import { forgotPassword } from "utils/services/api";
import AuthServices from "./../../utils/services/authApi";
import * as style from "./ForgotPassword.module.scss";

const { REACT_APP_PATTERN_EMAIL } = process.env;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const handlerInput = ({ target }) => setEmail(target.value);

  const handlerNewPassword = ({ target }) => setNewPassword(target.value);
  const [isProgress, setIsProgress] = useState(false);

  const handlerForm = (event) => {
    setErr("");
    event.preventDefault();
    setIsProgress(true);
    forgotPassword({ email: email.toLowerCase() })
      .then((res) => {
        setIsProgress(false);
        setStep(4);
      })
      .catch((err) => {
        setIsProgress(false);
        setErr(err.response.data);
        if (err.code === "UserNotFoundException")
          setErr({
            message: "User with this email does not exist",
          });
        setStep(1);
      });
    // AuthServices.forgotPassword(email.toLowerCase())
    //   .then((data) => {
    //     setIsProgress(false);
    //     setStep(2);
    //     setErr("");
    //   })
    //   .catch((err) => {
    //     setIsProgress(false);
    //     setErr(err);
    //     if (err.code === "UserNotFoundException")
    //       setErr({
    //         message: "User with this email does not exist",
    //       });

    //     setStep(1);
    //   });
  };

  const writeCode = (event) => {
    event.preventDefault();
    setStep(3);
    setErr("");
  };

  const sendCode = (event) => {
    setErr("");
    event.preventDefault();
    setIsProgress(true);
    AuthServices.confirmNewPassword({ email: email.toLowerCase(), code, newPassword })
      .then(() => {
        setIsProgress(false);
        setStep(4);
      })
      .catch((err) => {
        setIsProgress(false);
        setErr(err);
        setNewPassword("");
        if (err.code === "CodeMismatchException") setStep(2);
      });
  };

  return (
    <Container>
      <Row>
        <Col
          xs="12"
          md={{ offset: 1, span: 10 }}
          lg={{ offset: 3, span: 6 }}
          className="p-2 py-5"
        >
          <div className="box p-3 p-md-5">
            {step === 1 && (
              <Form onSubmit={handlerForm}>
                <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                  Forgot password
                </h2>
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  onChange={handlerInput}
                  value={email}
                  isInvalid={!email.match(REACT_APP_PATTERN_EMAIL)}
                  required
                />
                <p className="text-center text-secondary">
                  If an account with this email exists, a password reset email
                  will be sent shortly.
                </p>
                {err && <Alert variant="danger">{err.message}</Alert>}
                <Button
                  variant="bns"
                  type="submit"
                  disabled={isProgress || !email.match(REACT_APP_PATTERN_EMAIL)}
                  className="w-100"
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  Send
                </Button>
              </Form>
            )}
            {step === 2 && (
              <Form className="p-3 p-sm-5" onSubmit={writeCode}>
                <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                  Verification code
                </h2>
                <SixNumeric handler={setCode} />
                {err && <Alert variant="danger">{err.message}</Alert>}
                <Button
                  variant="bns"
                  type="submit"
                  className="w-100"
                  disabled={isProgress}
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  Next
                </Button>
              </Form>
            )}
            {step === 3 && (
              <Form className="p-3 p-sm-5" onSubmit={sendCode}>
                <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                  New Password
                </h2>
                <Form.Control
                  type={hidePassword ? "password" : "text"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={handlerNewPassword}
                  isInvalid={!email.match(REACT_APP_PATTERN_EMAIL)}
                  required
                />
               <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} 
                                onClick={() => setHidePassword(!hidePassword)}
                                className={`${style.hidePasswordIcon}`}/>

                {err && <Alert variant="danger">{err.message}</Alert>}
                <Button
                  variant="bns"
                  type="submit"
                  className="w-100"
                  disabled={isProgress || !email.match(REACT_APP_PATTERN_EMAIL)}
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  Next
                </Button>
              </Form>
            )}
            {step === 4 && (
              <>
                <div className={style.iconWrp}>
                  <FontAwesomeIcon icon={faCheck} className={style.icon} />
                </div>
                <h2 className={style.title}>Link sent!</h2>
{/* 
                <Link to={routers.login.path} className="btn-bns text-center">
                  go to login page
                </Link> */}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default withCheckAuth(ForgotPassword);
