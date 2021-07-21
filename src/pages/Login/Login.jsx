/* eslint-disable react-hooks/exhaustive-deps */
import { faSync, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useCallback } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "utils/services/authApi";
import routers from "./../../router";

const { REACT_APP_PATTERN_EMAIL } = process.env;

function Login({ history, location, requestLogin, isLoggedIn, err, loading, infiniteScrollAndOffset }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProgress, setIsProgress] = useState(false);
  const [errMessage, setErrMessage] = useState(err);
  const [newUser, setNewUser] = useState(null);
  const [new_password, setNewPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const onChange = ({ target }) => {
    switch (target.dataset.field) {
      case "email":
        setEmail(target.value.trim());
        break;
      case "password":
        setPassword(target.value);
        break;
      case "new_password":
        setNewPassword(target.value);
        break;
      default:
        return;
    }
  };
  const hidePasswordIconStyle = {
    "position": "relative",
    "left": "92%",
    "bottom" : "58px",
    "color": "black",
    "cursor": "pointer",
  };

  const completeNewPasswordChallenge = (event) => {
    event.preventDefault();
    setIsProgress(true);
    newUser.completeNewPasswordChallenge(
      new_password,
      {},
      {
        onSuccess: () => {
          console.log(email, new_password);
          onResubmit({ email: email, password: new_password });
        },
        onFailure: (err) => {
          setIsProgress(false);
          setErrMessage(err);
        },
      }
    );
  };
  useEffect(() => {
    setErrMessage(err);
  }, [err]);

  useEffect(() => {
    setIsProgress(loading);
  }, [loading]);
  const onResubmit = ({ email, password }) => {
    setErrMessage("");
    setIsProgress(true);
    AuthService.logIn({ email: email.toLowerCase(), password })
      .then((res) => {
        setIsProgress(false);
        if (res.challengeName === "NEW_PASSWORD_REQUIRED") {
          return setNewUser(res);
        }

        if (res.attributes.phone_number_verified === false) {
          history.push(routers.confirm.path, {
            phone_number: res.attributes.phone_number,
          });
          return;
        }
        requestLogin();
      })
      .catch((err) => {
        setIsProgress(false);
        console.log("err", err);
        setErrMessage(err);
      });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setErrMessage("");
    setIsProgress(true);
    AuthService.logIn({ email: email.toLowerCase(), password })
      .then((res) => {
        


        setIsProgress(false);
        if (res.challengeName === "NEW_PASSWORD_REQUIRED") {
          return setNewUser(res);
        }
        if (res.attributes.phone_number_verified === false) {
          history.push(routers.confirm.path, {
            phone_number: res.attributes.phone_number,
          });
          return;
        }
        infiniteScrollAndOffset();
        requestLogin();
      })
      .catch((err) => {
        setIsProgress(false);
        console.log("err", err);
        setErrMessage(err);
        if (err.code === "UserNotConfirmedException"){
          history.push(routers.verifyAccount.path, {email: email.toLowerCase(), password});
        }
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      AuthService.autoLogOut();
      setIsProgress(false);
      history.push(location.state?.link || "/");
    }
  }, [isLoggedIn]);

  return !newUser ? (
    <Container>
      <Row>
        <Col
          xs="12"
          md={{ offset: 1, span: 10 }}
          lg={{ offset: 3, span: 6 }}
          className="p-2 py-5"
        >
          <div className="box p-3 p-md-5">
            <Form onSubmit={onSubmit}>
              <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                Log into your account
              </h2>
              <Form.Control
                type="text"
                placeholder="E-mail"
                value={email}
                onChange={onChange}
                data-field="email"
                isInvalid={!email.match(REACT_APP_PATTERN_EMAIL)}
                required
              />
              <div>
              <Form.Control
                type={hidePassword ? "password" : "text"}
                placeholder="Password"
                value={password}
                onChange={onChange}
                data-field="password"
                required
              />
              <span onClick={() => setHidePassword(!hidePassword)}>
               <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} style={hidePasswordIconStyle}/>
              </span>
              </div>
              {errMessage && (
                <Alert variant="danger">{errMessage.message}</Alert>
              )}
              <Button
                variant="bns"
                type="submit"
                className="w-100"
                disabled={isProgress || !email.match(REACT_APP_PATTERN_EMAIL)}
              >
                {isProgress && (
                  <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                )}
                log in
              </Button>
              <p className="text-center">
                <Link to={routers.forgotPass.path} className="text-white">
                  Forgot Password ?
                </Link>
              </p>
              <p className="text-center text-secondary">
                Don't have an account?{" "}
                <Link to={routers.signUp.path} className="text-white">
                  Sign Up
                </Link>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  ) : (
    <Container>
      <Row>
        <Col
          xs="12"
          md={{ offset: 1, span: 10 }}
          lg={{ offset: 3, span: 6 }}
          className="p-2 py-5"
        >
          <div className="box p-3 p-md-5">
            <h2>New password</h2>
            <Form name="basic" onSubmit={completeNewPasswordChallenge}>
              <Form.Control
                type="password"
                placeholder="Password"
                value={new_password}
                onChange={onChange}
                data-field="new_password"
                required
              />
              {/* <Button
          loading={isLoading}
          type="bns"
          htmlType="submit"
          className="login-form-button"
        >
          Confirm
        </Button> */}
              <Button
                variant="bns"
                type="submit"
                className="w-100"
                disabled={isProgress}
              >
                {isProgress && (
                  <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                )}
                Confirm
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
