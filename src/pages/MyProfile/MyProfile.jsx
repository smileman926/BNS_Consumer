import AddressInput from "@components/AddressInput/AddressInput";
import SavedCCInfo from "@components/SavedCCInfo";
import {
  faCheck,
  faPencilAlt,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Auth } from "aws-amplify";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import ReactCrop from "react-image-crop";
import routers from "router";
import { apiLogIn } from "utils/services/authApi";
import { downloadImg, uploadProfileImg } from "utils/services/s3";
import * as style from "./MyProfile.module.scss";

function MyProfile({ user, userUpdating, updateUser, history, location }) {
  const [isPhoneUpdated, setIsPhoneUpdated] = useState(false);
  useEffect(() => {
    if (location?.state?.isUpdated) {
      setIsPhoneUpdated(true);
      history.replace({
        pathname: routers.myProfile.path,
        state: {}
      })
    }
  }, []);
  const [errMessage, setErrMessage] = useState("");
  const [newImg, setNewImg] = useState(null);

  const [checkChenge, setCheckChenge] = useState(true);
  const [userData, setUserData] = useState(null);

  const [showErr, setShowErr] = useState(false);

  const [fields, setFields] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    profile_picture: "",
    phone: "",
    address: "",
    notifyProduct: false,
    newProductPhone: false,
    newProductEmail: false,
    notifyWebinar: false,
    newWebinarPhone: false,
    newWebinarEmail: false,
    savedCardNum: ""
  });

  const [userAddress, setUserAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    zipcode: "",
  });
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

  useEffect(() => {
    if (!user) return;
    async function load() {
      // const result = await Auth.currentUserInfo();
      const not_result = await apiLogIn();
      console.log(not_result);
      const newValue = {
        ...fields,
        email: user.email.toLowerCase(),
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone_number.slice(2),
        address: user.address,
        profile_picture: user.profile_picture,
        notifyProduct:
          not_result ? ( not_result.notify_products.includes("email") || not_result.notify_products.includes("phone") )
          :
          ( user.notify_products.includes("email") || user.notify_products.includes("phone")),
        notifyWebinar:
          not_result ? ( not_result.notify_webinar.includes("email") || not_result.notify_webinar.includes("phone") )
          : 
          ( user.notify_webinar.includes("email") || user.notify_webinar.includes("phone") ),
        newProductPhone: not_result ? not_result.notify_products.includes("phone") : user.notify_products.includes("phone"),
        newProductEmail: not_result ? not_result.notify_products.includes("email") : user.notify_products.includes("email"),
        newWebinarPhone: not_result ? not_result.notify_webinar.includes("phone") : user.notify_webinar.includes("phone"),
        newWebinarEmail: not_result ? not_result.notify_webinar.includes("email") : user.notify_webinar.includes("email"),
        savedCardNum: not_result ? not_result.creditCardNumber : user.creditCardNumber
      };

      setFields(newValue);

      setUserAddress({
        street_address: user.street_address,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode,
      });

      setUserData({ ...newValue, address: user.address });
    }
    load();
  }, [user]);

  useEffect(() => {
    if (fields.profile_picture) {
      downloadImg(user.profile_picture)
        .then((result) => setFields({ ...fields, profile_picture: result }))
        .catch((err) => console.log("err", err));
    }
  }, [fields.profile_picture]);

  const handlerFields = ({ target }) => {
    const { dataset, value } = target;
    const { field } = dataset;

    if (field !== "phone") {
      setFields({
        ...fields,
        [field]: value,
      });
    } else if (field == "phone") {
      const phone = value.replace(/\D/g, "").trim();
      if (phone.length > 0 && phone.length < 11) {
        setFields({
          ...fields,
          [field]: phone.match(/\d{1,4}$|\d{1,3}/g).join(""),
        });
      } else if (phone.length < 11) {
        setFields({ ...fields, [field]: phone });
      }
    } else if (field == "email") {
      setFields({ ...fields, [field]: value.toLowerCase() });
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

  const handlerForm = async (event) => {
    setErrMessage("");
    event.preventDefault();
    if (userUpdating?.isLoaded)
      return;
    
    const {
      email,
      firstName,
      lastName,
      phone,
      username,
      newProductPhone,
      newProductEmail,
      newWebinarPhone,
      newWebinarEmail,
    } = fields;

    const { street_address, city, state, zipcode } = userAddress;

    const newFields = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      address:
        street_address + ", " + city + ", " + state + " " + zipcode + ", USA",
      street_address,
      city,
      state,
      zipcode,
      phone_number: `+1${phone}`,
      notify_webinar: convert(newWebinarEmail, newWebinarPhone),
      notify_products: convert(newProductEmail, newProductPhone),
      verified_method: "email",
    };

    try {
      if (newImg) {
        const file = new File(
          [newImg],
          `profile-${user.id}.${newImg.name.split(".").pop()}`,
          {
            type: newImg.type,
          }
        );
        const result = await uploadProfileImg(file);
        const { key } = result;
        newFields.profile_picture = key;
        setNewImg(null);
      }
      // updateUser({ id: user.id, body: newFields });
      // const result = await updateUserFields(newFields);

      // const originPhonNum = await Auth.currentUserInfo();
      // if (originPhonNum.attributes.phone_number) {
      //   if (
      //     newFields.phone_number.replace(/[\s\+]/g, "") !==
      //     originPhonNum.attributes.phone_number.replace(/[\s\+]/g, "")
      //   ) {
      //     const userCognito = await Auth.currentUserPoolUser();
      //     await Auth.updateUserAttributes(userCognito, {
      //       phone_number: newFields.phone_number.replace(/\s/g, ""),
      //     });
      //     // await Auth.verifyCurrentUserAttribute("phone_number");
      //     history.push(routers.confirm.path, {profile: true});
      //   }
      // }
      // else {
      //   const userCognito = await Auth.currentUserPoolUser();
      //     await Auth.updateUserAttributes(userCognito, {
      //       phone_number: newFields.phone_number.replace(/\s/g, ""),
      //     });
      //     // await Auth.verifyCurrentUserAttribute("phone_number");
      //     history.push(routers.confirm.path, {profile: true});
      // }
     
      // if(result.message)
      //   setIsUpdateSucess(true);

      updateUser(newFields);

    } catch (err) {
      setErrMessage(err);
 
    }
  };

  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 15, aspect: 1 / 1 });
  const [previewUrl, setPreviewUrl] = useState();
  const [showCrop, setShowCrop] = useState(false);
  const onCloseCrop = () => setShowCrop(false);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setShowCrop(true);
        setUpImg(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const makeClientCrop = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      createCropPreview(imgRef.current, crop, "newFile.jpeg");
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }
      blob.name = fileName;
      setNewImg(blob);
      window.URL.revokeObjectURL(previewUrl);

      setPreviewUrl(window.URL.createObjectURL(blob));
    }, "image/jpeg");
  };

  useEffect(() => {
    if (!userData) return;
    const updateFields = Object.entries({ ...fields, ...userAddress }).every(
      (el) => {
        if (el.includes("profile_picture")) return true;
        return userData[el[0]] === el[1];
      }
    );
    setCheckChenge([!newImg, updateFields].every((el) => el === true));
    // setIsPhoneUpdated(false);
    // setCheckChenge(!!newImg || !updateFields);
  }, [fields, newImg, userAddress]);

  const isCheckIcon = (status) =>
    status ? <FontAwesomeIcon icon={faCheck} /> : "";

  const getAddressFunc = (place) => {
    console.log(place);
    const newArray = place.split(", ");
    console.log(newArray);
    let tempStreet = "";
    let tempCity = "";
    let tempState = "";
    let tempZip = "";
    if (newArray.length === 4) {
      tempStreet = newArray[newArray.length - 4];
      tempCity = newArray[newArray.length - 3];
      tempState = newArray[newArray.length - 2].split(" ")[0];
      tempZip = newArray[newArray.length - 2].split(" ")[1]
        ? newArray[newArray.length - 2].split(" ")[1]
        : "";
    } else {
      tempStreet = newArray[0];
    }
    setUserAddress({
      street_address: tempStreet,
      city: tempCity,
      state: tempState,
      zipcode: tempZip,
    });
  };
  return (
    <Container className="py-1 py-md-5 ">
      {isPhoneUpdated && <p className={style.updated_alert}>Profile Updated</p>}
      <Row className="p-3">
        <Col
          xs={12}
          sm={{ offset: 1, span: 10 }}
          md={{ offset: 2, span: 8 }}
          className="box p-3 p-md-5"
        >
          <Form onSubmit={handlerForm}>           
            <h2 className="title font-weight-bold text-center  pb-3 pb-mb-5">
              My Profile
            </h2>
            <div className={style.img_wrp}>
              {(previewUrl || fields.profile_picture) && (
                <img
                  src={previewUrl || fields.profile_picture}
                  className={style.img}
                  alt="avatar"
                />
              )}
            </div>
            <div className="text-center mb-2">
              <label className={style.file_label}>
                <input
                  type="file"
                  accept="image/*"
                  className={style.file_input}
                  onChange={onSelectFile}
                  hidden
                />
                <FontAwesomeIcon icon={faPencilAlt} /> Edit Picture
              </label>
            </div>
            {showCrop && (
              <div className={style.crop}>
                <ReactCrop
                  src={upImg}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={makeClientCrop}
                />
                <Button
                  variant="bns"
                  className={style.crop_btn}
                  onClick={onCloseCrop}
                >
                  Done
                </Button>
              </div>
            )}
            <Form.Control
              type="text"
              placeholder="Username"
              value={fields.username}
              data-field="username"
              onChange={handlerFields}
              required
            />
            <Form.Control
              type="email"
              placeholder="E-mail"
              value={fields.email}
              data-field="email"
              onChange={handlerFields}
              required
              readOnly
            />
            <Form.Control
              type="text"
              placeholder="First Name"
              value={fields.firstName}
              data-field="firstName"
              onChange={handlerFields}
              required
            />
            <Form.Control
              type="text"
              placeholder="Last Name"
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
              onChange={(e) =>
                setUserAddress({ ...userAddress, city: e.target.value })
              }
              required
            />
            <Form.Control
              type="text"
              placeholder="State"
              value={userAddress.state}
              data-field="state"
              onChange={(e) =>
                setUserAddress({ ...userAddress, state: e.target.value })
              }
              required
            />
            <Form.Control
              type="text"
              placeholder="Zip Code"
              value={userAddress.zipcode}
              data-field="zipcode"
              onChange={(e) =>
                setUserAddress({ ...userAddress, zipcode: e.target.value })
              }
              required
            />
            <Form.Control
              type="text"
              placeholder="Cell Phone Number"
              value={fields.phone}
              data-field="phone"
              onChange={handlerFields}
              // readOnly
              required
              // pattern="^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$"
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
                    fields.newProductEmail && fields.newProductPhone
                      ? style.select
                      : ""
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
                  <label
                    htmlFor="getOnEmailProduct"
                    className={style.checkbox__label}
                  >
                    <p>get on email</p>
                    <span className={style.checked}>
                      {isCheckIcon(fields.newProductEmail)}
                    </span>
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
                  <label
                    htmlFor="getOnPhoneProduct"
                    className={style.checkbox__label}
                  >
                    <p>get on phone</p>
                    <span className={style.checked}>
                      {isCheckIcon(fields.newProductPhone)}
                    </span>
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
                    fields.newWebinarEmail && fields.newWebinarPhone
                      ? style.select
                      : ""
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
                  <label
                    htmlFor="getOnEmailWebinars"
                    className={style.checkbox__label}
                  >
                    <p>get on email</p>
                    <span className={style.checked}>
                      {isCheckIcon(fields.newWebinarEmail)}
                    </span>
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
                  <label
                    htmlFor="getOnPhoneWebinars"
                    className={style.checkbox__label}
                  >
                    <p>get on phone</p>
                    <span className={style.checked}>
                      {isCheckIcon(fields.newWebinarPhone)}
                    </span>
                  </label>
                </div>
              )}
            </div>
            {errMessage && <Alert variant="danger">{errMessage.message}</Alert>}
            <SavedCCInfo isSaved={fields.savedCardNum} setShowErr={setShowErr} update = {updateUser} profileInfo={
              {
                email: fields.email,
                username: fields.username,
                first_name: fields.firstName,
                last_name: fields.lastName,
                address:
                  userAddress.street_address + ", " + userAddress.city + ", " + userAddress.state + " " + userAddress.zipcode + ", USA",
                street_address: userAddress.street_address,
                city: userAddress.city,
                state: userAddress.state,
                zipcode: userAddress.zipcode,
                phone_number: `+1${fields.phone}`,
                verified_method: "email",
              }
            }/>
            <Button
              variant="bns"
              type="submit"
              className="w-100"
              disabled={userUpdating?.isLoaded || checkChenge}
            >
              {userUpdating?.isLoaded && (
                <FontAwesomeIcon icon={faSync} className="mr-2" spin />
              )}
              save now
            </Button>
            {userUpdating?.isSuccess && <Alert variant="success" className="text-center">Updated Successfully</Alert>}
            {showErr && <Alert variant="danger">Failed</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default MyProfile;
