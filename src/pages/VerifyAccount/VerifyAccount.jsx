import SixNumeric from "@components/SixNumeric";
import { faCheck, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import routers from "router";
import AuthServices, {setVerifyStatus} from "utils/services/authApi";
import * as style from "./VerifyAccount.module.scss";

function VerifyAccount({ location, apiReqSignUp, history }) {
  const user = location.state;
  const [errMessage, setErrMessage] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [isProgress, setIsProgress] = useState(false);

  const handlerMethodBtn = ({ target }) => {
    switch (target.dataset.method) {
      case "email":
        setIsPhone(false);
        break;
      case "phone":
        setIsPhone(true);
        break;
      default:
        return;
    }
  };

  const isSelect = (status) =>
    status ? style.switch__btn__active : style.switch__btn;

  const selectVerifyMethod = (event) => {
    event.preventDefault(); 

    setIsProgress(true);
    AuthServices.signUp({ ...user, isPhone })
    // save data.userSub in cache put user in db after confirmation
      .then((data) => {
        apiReqSignUp({
          ...user,
          id: data.userSub,
          verified_method: isPhone ? "phone" : "email",
          is_verified: false,
          is_email_verified: true,
          is_phone_verified: true,
          });

        setIsProgress(false);
        setStep(2);
      })
      .catch((err) => {
        if (err.code === "UsernameExistsException"){ // if user tries to select method with existing account
          resendCode();
          setIsProgress(false);
          setStep(2);
        }
        else {
          setIsProgress(false);
          history.push(routers.signUp.path, err);
        }
      });
  };

  const verifiedCode = (event) => {
    event.preventDefault();
    setIsProgress(true);

    AuthServices.confirmSignUp({ ...user, code })
      .then((data) => {
            // sessionStorage.removeItem('userAddress');
            // sessionStorage.removeItem('fields');
            // sessionStorage.removeItem('userSub');

        setVerifyStatus({
          is_verified: true,
          email: user.email
        })
          .then((res) => {
            setErrMessage("");
            setStep(3);
            setIsProgress(false);
          })
          .catch((err) => {
            setErrMessage(err);
            setIsProgress(false);
          });
      })
      .catch((err) => {
        setIsProgress(false);
        setErrMessage(err.message);
      });
  };

  const resendCode = () => {
    setIsProgress(true);
    AuthServices.resendConfirmationCode(user.email)
      .then((res) => {
        setIsProgress(false);
      })
      .catch((err) => {
        setIsProgress(false);
        setErrMessage(err.message);
      });
  };


  return (
    <Container>
      <Row>
        <Col
          xs={12}
          sm={{ offset: 1, span: 10 }}
          md={{ span: 6, offset: 3 }}
          className="p-2 py-sm-5"
        >
          <div className="box p-3 p-md-5">
            {step === 1 && (
              <>
              <Form onSubmit={selectVerifyMethod}>
                <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                  Verify Your Account
                </h2>
                <p className="text-center text-secondary pb-2">
                  Select your email address or phone number to verify your
                  account.
                </p>

                <div className={style.switch__box}>
                  <button
                    type="button"
                    className={isSelect(!isPhone)}
                    onClick={handlerMethodBtn}
                    data-method="email"
                  >
                    verify via email
                  </button>
                  <button
                    type="button"
                    className={isSelect(isPhone)}
                    onClick={handlerMethodBtn}
                    data-method="phone"
                    disabled
                  >
                    verify via phone
                  </button>
                </div>
                <Button
                  variant="bns"
                  type="submit"
                  className="w-100 "
                  disabled={isProgress}
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  verify
                </Button>
              </Form>
             {/* <Link to={routers.signUp.path} className="text-white text-center font-weight-bold"> */}
              {/*        Update Account Information */}
             {/* </Link> */}
              </>
            )}
            {step === 2 && (
              <>
              <Form onSubmit={verifiedCode}>
                <h2 className="title text-center font-weight-bold pb-3 pb-mb-5">
                  Verify Your { isPhone ? 'Phone' : 'Email'}
                </h2>
                <p
                  className={`text-center text-secondary pb-2 ${style.confirm}`}
                >
                  Please enter the 6 digit code sent to <span>{ isPhone ? user.phone_number : user.email}</span>
                </p>

                <SixNumeric handler={setCode} />

                {errMessage && <Alert variant="danger">{errMessage}</Alert>}

                <button
                  type="button"
                  onClick={resendCode}
                  className={style.resend}
                  disabled={isProgress}
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  resend code
                </button>

                <Button
                  variant="bns"
                  type="submit"
                  className="w-100 "
                  disabled={isProgress}
                >
                  {isProgress && (
                    <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                  )}
                  confirm
                </Button>
              </Form>

              {/* <Link onClick={() => setStep(1)} className="text-white text-center font-weight-bold"> */}
               {/*         Select verify method */}
              {/* </Link> */}
              </>
            )}
            {step === 3 && (
              <div>
                <div className={style.iconWrp}>
                  <FontAwesomeIcon icon={faCheck} className={style.icon} />
                </div>
                <h2 className={style.title}>Verified!</h2>
                <p className="text-center text-secondary mb-4">
                  Congratulation! You have successfully verified the account.
                </p>
                <Link to={routers.login.path} className="btn-bns text-center">
                  go to login page
                </Link>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default VerifyAccount;
