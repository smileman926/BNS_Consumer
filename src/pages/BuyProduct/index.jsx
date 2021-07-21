/* eslint-disable react-hooks/exhaustive-deps */
import DropDownSelect from "@components/DropDownSelect/DropDownSelect";
import GiftCardCheckout from "@components/GiftCardCheckout";
import { faCheck, faTimes, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import routers from "router";
import withAuth from "utils/HOC/withAuth";
import { getRewards } from "../../redux/rewards/Actions";
import { rewardsSelector } from "../../redux/rewards/Selectors";
import { buyGoods } from "./../../utils/services/api";
import { apiLogIn } from "./../../utils/services/authApi";
import * as style from "./index.module.scss";
import { clearCart } from "@redux/cart/Actions";
import Visa_Card from "@images/card/visa.png";
import Master_Card from "@images/card/master.png";
import Discord_Card from "@images/card/discord.png";
import floatFormat from "../../utils/formats/float";

const { REACT_APP_ACCEPT_CLIENT_KEY, REACT_APP_ACCEPT_API_LOGIN_ID } = process.env;

function BuyProduct({ location, history }) {
  const product = location.state;
  const dispatch = useDispatch();
  const rewards = useSelector(rewardsSelector)?.list;
  const giftCardsTotal =
    rewards?.gifts?.reduce(
      (acc, gift) => (acc += gift.status === "unused" ? Number(gift.amount) : -Number(gift.amount)),
      0
    ) || 0;
  const userID = useSelector((state) => (state.auth.user ? state.auth.user.id : null));
  const { quantity, pricePerItem, id } = location.state;
  const [accept, setAccept] = useState(false);
  const [mesError, setMesError] = useState(null);
  const [request, setRequest] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [usedGfAmount, setUsedGfAmounts] = useState();
  const [promoCode, setPromoCode] = useState();
  const [amountPromoCode, setAmountPromoCode] = useState(0);
  const [isOpen, setIsOpen] = useState({ open: false, err: null});
  const promoCodes = rewards.promoCode?.filter(
    (el) => !(el?.number_used > 0 && el?.webinar?.product_status !== "active")
  );

  const [fields, setFields] = useState({
    type: "card",
    card: "",
    month: "month",
    year: "year",
    cvc: "",
  });

  const [isUseSavedCard, setIsUseSavedCard] = useState(false);
  const [isSaveCard, setIsSaveCard] = useState(false);
  const [savedCC, setSavedCC] = useState(null);

  useEffect(() => {
    dispatch(getRewards());
    async function loadSavedCC() {
      const result = await apiLogIn();
      if (result?.creditCardNumber) {
        setSavedCC(result.creditCardNumber);
        setIsUseSavedCard(true);
      } 
    }
    loadSavedCC();
  }, []);

  const handlerCard = ({ target }) => {
    const value = target.value ? target.value.replace(/[\sa-zA-z]/g, "").trim() : "";
    const card = value
      ? value
          .match(/.{1,4}/g)
          .join(" ")
          .substr(0, 19)
      : "";
    setFields({ ...fields, card });
  };

  const handlerSelect = ({ target }) => {
    setFields({ ...fields, [target.dataset.type]: target.value });
  };

  const handlerCVC = ({ target }) => {
    if (target.value.length > 3) return;
    setFields({ ...fields, cvc: target.value.replace(/\D/g, "") });
  };

  const sendPaymentDataToAnet = () => {
    const authData = {};
    authData.clientKey = REACT_APP_ACCEPT_CLIENT_KEY;
    authData.apiLoginID = REACT_APP_ACCEPT_API_LOGIN_ID;

    const cardData = {};
    cardData.cardNumber = fields.card.replace(/\s/g, "");
    cardData.month = fields.month;
    cardData.year = fields.year;
    cardData.cardCode = fields.cvc;

    const secureData = {};
    secureData.authData = authData;
    secureData.cardData = cardData;

    return new Promise((resolve, reject) => {
      window.Accept.dispatchData(secureData, (res) => {
        if (res.messages.resultCode === "Error") return reject(res);
        resolve(res);
      });
    });
  };

  const cart = useSelector((state) => state.cart);

  const handlerForm = async (event) => {
    event.preventDefault();
    setRequest(true);
    // setMesError(null);
    const products = Array.isArray(location?.state)
      ? location.state.map(({ id, quantity: amount, productType: product_type }) => ({
          id,
          amount,
          product_type,
        }))
      : [
          {
            id,
            amount: quantity,
            product_type: pricePerItem ? "physical" : "webinar",
          },
        ];
    try {
      let body = {};
      if ((Number(generalTotal) === 0) && (shippingPrice === 0))
        body = {
          products
        }
      else if (isUseSavedCard)
        body = {
          products
        }
      else {
        const { opaqueData } = await sendPaymentDataToAnet();
        body = {
          opaqueData,
          products
        }
      } 

      body.using_saved_card = isUseSavedCard;
      body.is_saving_credit_card = isSaveCard;
    
      if (usedGfAmount) {
        body.giftCard = usedGfAmount;
      }
      if (promoCode && !mesError?.message) {
        body.promoCode = promoCode.id;
      }
      const result = await buyGoods(body);

      result?.message === 'success' ?
        setIsOpen({
          open: true, err: null
        })
      :
        setIsOpen({
          open: true, err: result.message
        })

      if (JSON.stringify(cart) === JSON.stringify(product)) {
        dispatch(clearCart());
      }
    } catch (err) {
      setRequest(false);
      setMesError(err);
    }
  };

  const generalTotal = useMemo(() => {
    let cart = [];
    if (Array.isArray(product)) {
      cart = product;
    } else {
      cart.push(product);
    }
    const totalCart = cart.reduce((acc, { price, quantity }) => (acc += price * quantity), 0);

    const shipping = cart
      .filter((el) => el.productType === "physical")
      .reduce((acc, el) => (acc += el.shipping_price || 0), 0);
    setShippingPrice(shipping);
    let code = 0;
    setMesError(null);
    if (promoCode) {
      let cat_list = [];
      cart.map( item => cat_list.push(item.category_id));
      let restricted_cat = promoCode.category_restrictions.filter(item => cat_list.includes(item.category_id));
      if (restricted_cat.length) {
        setMesError({ message: `The promo code doesn’t apply to category '${restricted_cat[0].category.category_name}'` });
      }
      else {
        let arr = cart.filter((el) => el.productType === promoCode.product_type);
        if (promoCode.product_id) {
          arr = arr.filter((el) => el.id === promoCode.product_id);
        }
        if (!arr.length) {
          setMesError({ message: "This promo doesn`t related to current purchase" });
        } else if (promoCode.user_id && promoCode.user_id !== userID) {
          setMesError({ message: "You cannot use this promo code." });
        } else {
          const promo_goods = arr.reduce((acc, el) => (acc += el.price * el.quantity), 0);
          switch (promoCode.code_type) {
            case "cost":
              code = promoCode.amount;
              break;
            case "percent":
              code = promo_goods * (promoCode.amount / 100);
              break;
            case "seat":
              code = arr[0].price;
              break;
            default:
              code = 0;
              break;
          }
        }
      }      
    }
    setAmountPromoCode(code);
    return (Math.max(totalCart - (usedGfAmount || 0) - code, 0) + (shipping || 0)).toFixed(2);
  }, [product, usedGfAmount, promoCode]);

  const submitDisabled = useMemo(
    () => {
      if ((Number(generalTotal) === 0) && (shippingPrice === 0))
        return false;
      else if(isUseSavedCard)         
          return false;
      else
        return (
          fields.card.length < 18 ||
          fields.month === "month" ||
          ((Number(fields.year) === new Date().getFullYear() - 2000) && (Number(fields.month) < new Date().getMonth() + 1)) ||
          !fields.month ||
          fields.year === "year" ||
          !fields.year ||
          fields.cvc.length < 3
        )              
    }
    ,
    [fields, generalTotal, shippingPrice, isUseSavedCard]
  );

  const yearConvert = (num) => {
    const currentYear = new Date();
    currentYear.setFullYear(currentYear.getFullYear() + num);

    const short = currentYear.toLocaleDateString("en", { year: "2-digit" });

    return { short, long: currentYear.getFullYear() };
  };

  const closeModal = () => {
    window.location.href = routers.products.path;
  };

  return (
    <>
      <Modal
        show={isOpen.open}
        onHide={closeModal}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-bns"
      >
        <Modal.Header closeButton>
          {
            isOpen.err ?
              <FontAwesomeIcon icon={faTimes} className={style.icon} style={{color: '#ff0000aa'}} onClick={closeModal}/>
            :
              <FontAwesomeIcon icon={faCheck} className={style.icon} onClick={closeModal}/>
          }
          
        </Modal.Header>
        <Modal.Body>
          <h2>{ isOpen.err ? isOpen.err : 'Successfully!'}</h2>
        </Modal.Body>
      </Modal>
      <Container>
        <Row>
          <Col xs={12}  md={{ offset: 2, span: 8 }}>
            <div className="box p-3 px-md-5 pt-md-2 pb-md-4">
              <Form onSubmit={handlerForm}>
                <h2>Checkout</h2>
                <div className={style.cards_group}>
                  <img src={Visa_Card} alt="VisaCard" height="30"/>
                  <img src={Master_Card} alt="VisaCard" height="30"/>
                  <img src={Discord_Card} alt="VisaCard" height="30"/>
                </div>
                <p className={style.below_cards}>The B{"&"}M Revolution</p>
               <Row>
                 <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Check>
                      <Form.Check.Input                      
                        type="checkbox"
                        bsPrefix="bns-checkbox"
                        id="savedCard"
                        checked={isUseSavedCard}
                        disabled={!savedCC}
                        onChange={()=> {
                          setIsUseSavedCard(!isUseSavedCard);
                          !isUseSavedCard && setIsSaveCard(false);
                          }
                        }
                      />
                      <Form.Check.Label id="ch" htmlFor="savedCard" />
                      <Form.Check.Label htmlFor="savedCard">Use saved card {savedCC ? `(${savedCC})` : '(No card)'}</Form.Check.Label>
                    </Form.Check>
                  </Form.Group>
                 </Col>
                 <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Check>
                      <Form.Check.Input                      
                        type="checkbox"
                        bsPrefix="bns-checkbox"
                        id="saveCard"
                        checked={isSaveCard}
                        disabled={isUseSavedCard}
                        onChange={()=>setIsSaveCard(!isSaveCard)}
                      />
                      <Form.Check.Label id="ch" htmlFor="saveCard" />
                      <Form.Check.Label htmlFor="saveCard">Save card to profile</Form.Check.Label>
                    </Form.Check>
                  </Form.Group>
                 </Col>
               </Row>
                { !isUseSavedCard && <Form.Group>
                  <Form.Label className="pl-4">Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Credit card"
                    value={fields.card}
                    disabled={isUseSavedCard}
                    onChange={handlerCard}
                  />
                </Form.Group>}
                { !isUseSavedCard && <Form.Row>
                  <Form.Group as={Col} sm={8}>
                    <Form.Label className={style.select_label}>Expiration Date</Form.Label>

                    <div className={style.select_wrp}>
                      <Form.Control
                        as="select"
                        className={style.select}
                        value={fields.month}
                        onChange={handlerSelect}
                        disabled={isUseSavedCard}
                        data-type="month"
                      >
                        <option disabled hidden value="month">
                          Month
                        </option>
                        <option value="01"> January</option>
                        <option value="02"> February</option>
                        <option value="03"> March</option>
                        <option value="04"> April</option>
                        <option value="05"> May</option>
                        <option value="06"> June</option>
                        <option value="07"> July</option>
                        <option value="08"> August</option>
                        <option value="09"> September</option>
                        <option value="10"> October</option>
                        <option value="11"> November</option>
                        <option value="12"> December</option>
                      </Form.Control>
                    </div>

                    <div className={style.select_wrp}>
                      <Form.Control
                        as="select"
                        value={fields.year}
                        className={style.select}
                        onChange={handlerSelect}
                        disabled={isUseSavedCard}
                        data-type="year"
                        // defaultValue="year"
                      >
                        <option disabled hidden value="year">
                          Year
                        </option>
                        <option value={yearConvert(0).short}>{yearConvert(0).long}</option>
                        <option value={yearConvert(1).short}>{yearConvert(1).long}</option>
                        <option value={yearConvert(2).short}>{yearConvert(2).long}</option>
                        <option value={yearConvert(3).short}>{yearConvert(3).long}</option>
                        <option value={yearConvert(4).short}>{yearConvert(4).long}</option>
                        <option value={yearConvert(5).short}>{yearConvert(5).long}</option>
                        <option value={yearConvert(6).short}>{yearConvert(6).long}</option>
                      </Form.Control>
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} sn={3} controlId="formGridZip">
                    <Form.Label>CVC</Form.Label>
                    <Form.Control
                      value={fields.cvc}
                      onChange={handlerCVC}
                      disabled={isUseSavedCard}
                      placeholder="Three Digits"
                      type="text"
                    />
                  </Form.Group>
                </Form.Row>}
                <DropDownSelect handleChange={setPromoCode} promoCodes={promoCodes} />
                <GiftCardCheckout
                  handleChange={setUsedGfAmounts}
                  total={giftCardsTotal}
                  promoCode={amountPromoCode}
                  subTotal={generalTotal - shippingPrice}
                />
                {mesError && (
                  <Alert variant="danger">
                    {mesError.response?.data?.message ||
                      mesError.message ||
                      mesError.messages.message[0].text}
                  </Alert>
                )}
                <Form.Check>
                  <Form.Check.Input
                    bsPrefix="bns-checkbox"
                    type="checkbox"
                    required
                    checked={fields.acceptTermsConditions}
                    onChange={({ target }) => setAccept(target.checked)}
                    data-field="acceptTermsConditions"
                    id="check"
                  />
                  <Form.Check.Label id="ch" htmlFor="check" />
                  <Form.Check.Label>
                    I confirm that i have understood that i am buying a webinar and i have read the
                    <Link to={routers.termsAndConditions.path}>Terms and Conditions</Link>
                  </Form.Check.Label>
                </Form.Check>
                <div>
                  <span>Shipping Price</span>
                  <h1>${floatFormat(shippingPrice < 0 ? 0 : shippingPrice)}</h1>
                </div>
                <div>
                  <span>Subtotal</span>
                  <h1>${floatFormat(generalTotal)}</h1>
                </div>
                
                <Button variant="bns w-100" disabled={request || submitDisabled || !accept} type="submit">
                  {request && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
                  checkout
                </Button>
    
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withAuth(BuyProduct);
