import React, { useCallback, useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import floatFormat from "../../utils/formats/float";
import * as style from "./GiftCardCheckout.module.scss";

function GiftCardCheckout({ handleChange, total, subTotal = 0, promoCode }) {
  const [input, setInput] = useState("");
  const [useParameter, setUseParameter] = useState(false);
  const [resultGift, setResultGift] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleChange(useParameter ? resultGift : null);
  }, [resultGift, useParameter]);

  const location = useLocation();

  useEffect(() => {
    // console.clear()

    if (useParameter && promoCode && subTotal + resultGift === resultGift) {
      const totalCart = (Array.isArray(location.state) ? location.state : [location.state]).reduce(
        (acc, el) => (acc += el.quantity * el.price),
        0
      );
      const newValue = Math.min(Math.max(totalCart - promoCode, 0), resultGift);
      setResultGift(newValue);
      setInput(newValue);
    }
  }, [subTotal, promoCode, useParameter]);

  const onChangeInput = useCallback(
    ({ target: { value } }) => {
      const amount = +value.replace("-", "");
      setInput(amount <= total && amount <= subTotal + resultGift ? amount || "" : input);
      if (error) setError(null);
      if (!value.length) {
        setResultGift(null);
      }
    },
    [error, input, total, subTotal]
  );
  const onChangeCheckbox = useCallback(({ target: { checked } }) => setUseParameter(checked), []);

  const setGiftCard = useCallback(() => {
    setResultGift(input);
  }, [input]);

  return (
    <Form.Group>
      <Form.Check>
        <Form.Check.Input
          bsPrefix="bns-checkbox"
          type="checkbox"
          id="gf"
          checked={useParameter}
          onChange={onChangeCheckbox}
        />
        <Form.Check.Label id="ch" htmlFor="gf" />
        <Form.Check.Label htmlFor="gf">I want to use a gift card</Form.Check.Label>
      </Form.Check>
      <div className={style.container}>
        <div className={style.cnt}>
          <input
            disabled={!useParameter}
            type="number"
            min="0"
            step="any"
            placeholder="Amount covered by giftcard"
            className={style.input}
            value={input}
            onChange={onChangeInput}
          />
          <span className={!total ? style.errSpan : style.span}>
            {!total
              ? "You cant use gift card bonus your total is 0.00"
              : `*Total balance is $${floatFormat(total)}`}
          </span>
          {error && (
            <Alert variant="danger">{error.response?.data?.message || error.message}</Alert>
          )}
        </div>
        <button onClick={setGiftCard} disabled={!useParameter} type="button">
          Apply
        </button>
      </div>
    </Form.Group>
  );
}

export default GiftCardCheckout;
