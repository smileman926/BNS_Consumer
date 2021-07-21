import AddressInput from "@components/AddressInput/AddressInput";
import { faCheck, faSync, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useMemo } from "react";
import { Alert, Button, Col, Container, Form, Row, Popover, Overlay } from "react-bootstrap";
import { Link } from "react-router-dom";
import routers from "../../router";
import * as style from "./SignUp.module.scss";
import withCheckAuth from "utils/HOC/withCheckAuth";
import AuthService from "./../../utils/services/authApi";
import { passwordRegEx } from "./../../helpers/constants";
import { createRef } from "react";

const { REACT_APP_PATTERN_EMAIL } = process.env;

function SignUp({ history, location }) {
  const [errMessage, setErrMessage] = useState(location.state || "");

  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    address: "",
    confirmPassword: "",
    notifyProduct: false,
    newProductPhone: false,
    newProductEmail: false,
    notifyWebinar: false,
    newWebinarPhone: false,
    newWebinarEmail: false,
    acceptTermsConditions: false,
  });

  const [userAddress, setUserAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    zipcode: "",
  })

  const [hidePassword, setHidePassword] = useState(true);

  const handlerFields = ({ target }) => {
    const { dataset, value } = target;
    const { field } = dataset;

    if (field !== "phone") {
      setFields({
        ...fields,
        [field]: value,
      });
    } else {
      const phone = value.replace(/\D/g, "").trim();
      if (phone.length > 0 && phone.length < 11) {
        setFields({
          ...fields,
          [field]: phone.match(/\d{1,4}$|\d{1,3}/g).join(""),
        });
      } else if (phone.length < 11) {
        setFields({ ...fields, [field]: phone });
      }
    }
  };

  const handlerCheck = ({ target }) => {
    const { checked, dataset } = target;
    const { field } = dataset;
    if (!checked && field === "notifyWebinar") {
      setFields({
        ...fields,
        [field]: checked,
      });
      return;
    }

    if (!checked && field === "notifyProduct") {
      setFields({
        ...fields,
        [field]: checked,
      });
      return;
    }
    setFields({ ...fields, [field]: checked });
  };

  const convert = (email, phone) => {
    if (email && phone) return "email and phone";

    if (email) return "email";
    if (phone) return "phone";

    return "none";
  };

  const handlerForm = (event) => {
    setErrMessage("");
    event.preventDefault();
    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      newProductPhone,
      newProductEmail,
      newWebinarPhone,
      newWebinarEmail,
    } = fields;

    const {
      street_address,
      city,
      state,
      zipcode
    } = userAddress;

    const user = {
      email: email.toLowerCase().replace(/ /g, ""),
      username: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      address: street_address + ', ' + city + ', ' + state + " " + zipcode + ", USA",
      street_address,
      city,
      state,
      zipcode,
      phone_number: `+1${phone}`,
      password,
      notify_products: convert(newProductEmail, newProductPhone),
      notify_webinar: convert(newWebinarEmail, newWebinarPhone),
      user_role: "consumer",
    };
    // save user data to update it later
    // sessionStorage.setItem("fields", JSON.stringify(fields));
    // sessionStorage.setItem("userAddress", JSON.stringify(userAddress));

    setLoading(true);
    AuthService.confirmSignUp({ email: user.email.toLowerCase(), code: "000000" })
      .then((res) => {
        console.log("res", res)
          // save user data to update it later
      })
      .catch((err) => {
        setLoading(false);

        switch (err.code) {
          case "UserNotFoundException":
             history.push(routers.verifyAccount.path, user);
            return;
          case "NotAuthorizedException":
          case "CodeMismatchException":
            if (sessionStorage.getItem('userSub')){
              history.push(routers.verifyAccount.path, user);
            }
            else {
                setErrMessage({
              message: "AN ACCOUNT WITH THE GIVEN EMAIL ALREADY EXISTS.",
            });
            }
            break;
          default:
            return;
        }
      });
  };

  const isCheckIcon = (status) => (status ? <FontAwesomeIcon icon={faCheck} /> : "");

  const handlerAllSelect = (type) => {
    switch (type) {
      case "product":
        if (fields.newProductPhone && fields.newProductEmail) {
          setFields({
            ...fields,
            newProductPhone: false,
            newProductEmail: false,
          });
        } else {
          setFields({
            ...fields,
            notifyProduct: true,
            newProductPhone: true,
            newProductEmail: true,
          });
        }
        break;
      case "webinar":
        if (fields.newWebinarPhone && fields.newWebinarEmail) {
          setFields({
            ...fields,
            newWebinarPhone: false,
            newWebinarEmail: false,
          });
        } else {
          setFields({
            ...fields,
            notifyWebinar: true,
            newWebinarPhone: true,
            newWebinarEmail: true,
          });
        }
        break;
      default:
        return;
    }
  };

  const checkForm = useMemo(() => {
    const { acceptTermsConditions, password, confirmPassword } = fields;
    return !(
      acceptTermsConditions &&
      password === confirmPassword &&
      !!fields.email.match(REACT_APP_PATTERN_EMAIL) &&
      !!fields.password.match(passwordRegEx)
    );
  }, [fields.acceptTermsConditions, fields.password, fields.confirmPassword, fields.email]);

  const passwordRed = createRef();

  const getAddressFunc = place => {
    console.log(place);
    const newArray = place.split(", ");
    console.log(newArray);
    let tempStreet = "";
    let tempCity = "";
    let tempState = "";
    let tempZip = "";
    if (newArray.length === 4) {
        tempStreet =  newArray[newArray.length - 4];
        tempCity = newArray[newArray.length - 3];
        tempState = newArray[newArray.length - 2].split(" ")[0];
        tempZip = newArray[newArray.length - 2].split(" ")[1] ? newArray[newArray.length - 2].split(" ")[1] : "";
       
    }
    else {
        tempStreet =  newArray[0];

    }
    setUserAddress({
        street_address: tempStreet,
        city: tempCity,
        state: tempState,
        zipcode: tempZip
    });
  } 

  return (
    <Container className="py-5 ">
      <Row className="p-3">
        <Col
          xs={12}
          sm={{ offset: 1, span: 10 }}
          md={{ offset: 2, span: 8 }}
          className="box p-3 p-md-5"
        >
          <Form onSubmit={handlerForm}>
            <input type="hidden" value="something" />
            <h2 className="title font-weight-bold text-center  pb-3 pb-mb-5">
              Create your account
            </h2>
            <Form.Control
              type="email"
              placeholder="E-mail*"
              value={fields.email}
              data-field="email"
              onChange={handlerFields}
              isInvalid={fields.email.length > 0 && !fields.email.match(REACT_APP_PATTERN_EMAIL)}
              required
            />
            <Form.Control
              type="text"
              placeholder="First Name*"
              value={fields.firstName}
              data-field="firstName"
              onChange={handlerFields}
              required
            />
            <Form.Control
              type="text"
              placeholder="Last Name*"
              value={fields.lastName}
              data-field="lastName"
              onChange={handlerFields}
              required
            />
            <AddressInput
              placeholder="Street Address"
              value={userAddress.street_address}
              onChange={getAddressFunc}
              data-field="street_address"
              required
            />
            <Form.Control
              type="text"
              placeholder="City"
              value={userAddress.city}
              data-field="city"
              onChange={e => setUserAddress({...userAddress, city: e.target.value})}
              required
            />
            <Form.Control
              type="text"
              placeholder="State"
              value={userAddress.state}
              data-field="state"
              onChange={e => setUserAddress({...userAddress, state: e.target.value})}
              required
            />
            <Form.Control
              type="text"
              placeholder="Zip Code"
              value={userAddress.zipcode}
              data-field="zipcode"
              onChange={e => setUserAddress({...userAddress, zipcode: e.target.value})}
              required
            />
            <Form.Control
              type="text"
              placeholder="Cell Phone Number*"
              value={fields.phone}
              data-field="phone"
              autoComplete="new-email"
              onChange={handlerFields}
              // pattern="^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$"
              required
            />
            <Overlay
              show={fields.password.length > 0 && !fields.password.match(passwordRegEx)}
              target={passwordRed}
              placement="bottom-start"
              container={passwordRed.current}
              containerPadding={20}
            >
              <Popover className={style.pop} show={true}>
                <Popover.Title as="h3" className={style.pop_header}>
                  Password Policy
                </Popover.Title>
                <Popover.Content className={style.pop_body}>
                  <p className={style.pop_title}>Password should contain:</p>
                  <ul className={style.pop_list}>
                    <li className={style.pop_list_item}>Minimum length of 8 characters</li>
                    <li className={style.pop_list_item}>Numeric characters(0-9)</li>
                    <li className={style.pop_list_item}>Special characters</li>
                    <li className={style.pop_list_item}>Uppercase characters</li>
                    <li className={style.pop_list_item}>Lowercase characters</li>
                  </ul>
                </Popover.Content>
              </Popover>
            </Overlay>
            <Form.Control
              type={hidePassword ? "password" : "text"}
              autoComplete="new-password"
              placeholder="Password*"
              value={fields.password}
              data-field="password"
              onChange={handlerFields}
              ref={passwordRed}
              required
            />
               <FontAwesomeIcon 
                onClick={() => setHidePassword(!hidePassword)} 
                icon={hidePassword ? faEye : faEyeSlash} className={`${style.hidePasswordIcon}`}/>
      
            <Form.Control
              type={hidePassword ? "password" : "text"}
              placeholder="Confirm Password*"
              value={fields.confirmPassword}
              data-field="confirmPassword"
              onChange={handlerFields}
              isInvalid={fields.confirmPassword !== fields.password}
              required
            />

            <div className={style.checkbox__box}>
              <input
                id="newProduct"
                type="checkbox"
                checked={fields.notifyProduct}
                data-field="notifyProduct"
                className={style.checkbox__input}
                onChange={handlerCheck}
                readOnly
              />
              <div className={style.headerSelect}>
                <label htmlFor="newProduct" className={style.checkbox__label}>
                  <p>notifications for new products</p>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handlerAllSelect("product");
                  }}
                  className={`${style.btnAll} ${
                    fields.newProductEmail && fields.newProductPhone ? style.select : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
              {fields.notifyProduct && (
                <div className={style.list}>
                  <input
                    type="checkbox"
                    id="getOnEmailProduct"
                    checked={fields.newProductEmail}
                    className={style.checkbox__input}
                    onChange={handlerCheck}
                    data-field="newProductEmail"
                    readOnly
                  />
                  <label htmlFor="getOnEmailProduct" className={style.checkbox__label}>
                    <p>get on email</p>
                    <span className={style.checked}>{isCheckIcon(fields.newProductEmail)}</span>
                  </label>

                  <input
                    type="checkbox"
                    id="getOnPhoneProduct"
                    checked={fields.newProductPhone}
                    data-field="newProductPhone"
                    className={style.checkbox__input}
                    onChange={handlerCheck}
                    readOnly
                  />
                  <label htmlFor="getOnPhoneProduct" className={style.checkbox__label}>
                    <p>get on phone</p>
                    <span className={style.checked}>{isCheckIcon(fields.newProductPhone)}</span>
                  </label>
                </div>
              )}
            </div>
            <div className={style.checkbox__box}>
              <input
                id="newWebinars"
                type="checkbox"
                checked={fields.notifyWebinar}
                className={style.checkbox__input}
                onChange={handlerCheck}
                data-field="notifyWebinar"
                readOnly
              />
              <div className={style.headerSelect}>
                <label htmlFor="newWebinars" className={style.checkbox__label}>
                  <p>notifications for live webinar</p>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handlerAllSelect("webinar");
                  }}
                  className={`${style.btnAll} ${
                    fields.newWebinarEmail && fields.newWebinarPhone ? style.select : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
              {fields.notifyWebinar && (
                <div className={style.list}>
                  <input
                    type="checkbox"
                    id="getOnEmailWebinars"
                    checked={fields.newWebinarEmail}
                    className={style.checkbox__input}
                    onChange={handlerCheck}
                    data-field="newWebinarEmail"
                    readOnly
                  />
                  <label htmlFor="getOnEmailWebinars" className={style.checkbox__label}>
                    <p>get on email</p>
                    <span className={style.checked}>{isCheckIcon(fields.newWebinarEmail)}</span>
                  </label>

                  <input
                    type="checkbox"
                    id="getOnPhoneWebinars"
                    checked={fields.newWebinarPhone}
                    data-field="newWebinarPhone"
                    className={style.checkbox__input}
                    onChange={handlerCheck}
                    readOnly
                  />
                  <label htmlFor="getOnPhoneWebinars" className={style.checkbox__label}>
                    <p>get on phone</p>
                    <span className={style.checked}>{isCheckIcon(fields.newWebinarPhone)}</span>
                  </label>
                </div>
              )}
            </div>
            {errMessage && <Alert variant="danger">{errMessage.message}</Alert>}
            <Form.Check>
              <Form.Check.Input
                bsPrefix="bns-checkbox"
                type="checkbox"
                required
                checked={fields.acceptTermsConditions}
                onChange={handlerCheck}
                data-field="acceptTermsConditions"
                id="check"
              />
              <Form.Check.Label htmlFor="check">{""}</Form.Check.Label>
              <Form.Check.Label>
                I understand and accept all the
                <Link to={routers.termsAndConditions.path}>Terms and Conditions</Link>
                of this site
              </Form.Check.Label>
            </Form.Check>
            <p className="text-center text-secondary">
              Already have an account?{" "}
              <Link to={routers.login.path} className="text-white">
                Log In
              </Link>
            </p>
            <Button variant="bns" type="submit" className="w-100" disabled={loading || checkForm}>
              {loading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
              create your account
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default withCheckAuth(SignUp);
