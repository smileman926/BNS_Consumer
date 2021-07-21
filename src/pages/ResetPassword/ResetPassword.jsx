import React, { useEffect, createRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Popover,
  Overlay,
} from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { passwordRegEx } from "@helpers/constants";
import { resetPassword } from "utils/services/api";
import { Link } from "react-router-dom";
import * as style from "./ResetPassword.module.scss";
import routers from "router";

function ResetPassword({ match }) {
  const { forgot_link, id } = match.params;
  const [isProgress, setIsProgress] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMessage, setErrMessage] = useState(null);
  const [step, setStep] = useState(1);

  const [valid, setValid] = useState(false);

  const [hidePassword, setHidePassword] = useState(true);

  const onChange = ({ target }) => {
    switch (target.dataset.field) {
      case "password":
        setPassword(target.value);
        return;
      case "confirmPassword":
        setConfirmPassword(target.value);
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    setValid(
      password.length > 0 &&
        confirmPassword === password &&
        !!password.match(passwordRegEx)
    );
  }, [password, confirmPassword]);

  const onSubmit = (event) => {
    event.preventDefault();
    setIsProgress(true);
    resetPassword({
      forgot_link,
      id,
      password,
    })
      .then((res) => {
        setStep(2);
        setIsProgress(false);
      })
      .catch((err) => {
        setIsProgress(false);
        setErrMessage(err.response ? err.response.data : err);
      });
  };

  const passwordRef = createRef();

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
              <Form onSubmit={onSubmit}>
                <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                  New Password
                </h2>
                <Overlay
                  show={password.length > 0 && !password.match(passwordRegEx)}
                  target={passwordRef}
                  placement="bottom-start"
                  container={passwordRef.current}
                  containerPadding={20}
                >
                  <Popover className={style.pop} show={true}>
                    <Popover.Title as="h3" className={style.pop_header}>
                      Password Policy
                    </Popover.Title>
                    <Popover.Content className={style.pop_body}>
                      <p className={style.pop_title}>
                        Password should contain:
                      </p>
                      <ul className={style.pop_list}>
                        <li className={style.pop_list_item}>
                          Minimum length of 8 characters
                        </li>
                        <li className={style.pop_list_item}>
                          Numeric characters(0-9)
                        </li>
                        <li className={style.pop_list_item}>
                          Special characters
                        </li>
                        <li className={style.pop_list_item}>
                          Uppercase characters
                        </li>
                        <li className={style.pop_list_item}>
                          Lowercase characters
                        </li>
                      </ul>
                    </Popover.Content>
                  </Popover>
                </Overlay>

                 <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash}
                                onClick={() => setHidePassword(!hidePassword)}
                                className={`${style.hidePasswordIcon}`}/>
                <Form.Control
                  type={hidePassword ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={onChange}
                  ref={passwordRef}
                  data-field="password"
                  required
                />
           
                <Form.Control
                  type= {hidePassword ? "password" : "text"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={onChange}
                  isInvalid={confirmPassword !== password}
                  data-field="confirmPassword"
                  required
                />
                {errMessage && (
                  <Alert variant="danger">{errMessage.message}</Alert>
                )}
                <Button
                  variant="bns"
                  type="submit"
                  className="w-100"
                  disabled={isProgress || !valid}
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  send
                </Button>
              </Form>
            )}
            {step === 2 && (
              <>
                <div className={style.iconWrp}>
                  <FontAwesomeIcon icon={faCheck} className={style.icon} />
                </div>
                <h2 className={style.title}>Password confirmed!</h2>
                <Link to={routers.login.path} className="btn-bns text-center">
                  go to login page
                </Link>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
