import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { apiGetPromoCode } from "utils/services/api";
import * as style from "./DropDownSelect.module.scss";

function DropDownSelect({ handleChange, promoCodes }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [useParameter, setUseParameter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultPromo, setResultPromo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleChange(useParameter ? resultPromo : null);
  }, [resultPromo, useParameter]);

  const onChangeInput = useCallback(
    ({ target: { value } }) => {
      setOpen(true);
      setInput(value);
      if (error) setError(null);
      if (!value.length) {
        setOpen(false);
        setResultPromo(null);
      }
    },
    [error]
  );
  const onChangeCheckbox = useCallback(({ target: { checked } }) => setUseParameter(checked), []);

  const Fn = ({ target }) => {
    const parent = target.closest("asdasd");
    if (target.className.includes(style.input)) {
      return;
    }
    if (!parent) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", Fn);
    return () => document.removeEventListener("click", Fn);
  }, []);

  const filterItem = useCallback(() => {
    if (promoCodes?.length === 0) {
      return <p className={style.messageItem}>Missing promo code</p>;
    }
    if (!input) {
      return promoCodes?.map((card) => (
        <div
          className={style.dropItem}
          key={card.id}
          onClick={() => {
            setInput(card.id);
            setOpen(false);
          }}
        >
          <p>{card.id}</p>
        </div>
      ));
    }

    if (input) {
      const filterArr = promoCodes?.filter((card) => card.id.includes(input));
      if (!filterArr.length) {
        return <p className={style.messageItem}>Missing promo code</p>;
      }
      return filterArr.map((card) => (
        <div
          className={style.dropItem}
          key={card.id}
          onClick={() => {
            setInput(card.id);
            setOpen(false);
          }}
        >
          <p>{card.id}</p>
        </div>
      ));
    }
  }, [input, promoCodes]);

  const getPromoCode = useCallback(() => {
    setOpen(false);
    setLoading(true);
    apiGetPromoCode({ code: input })
      .then((res) => {
        setResultPromo(res);
        setInput(res.id);
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [input]);

  return (
    <Form.Group className={"asdasd"}>
      <Form.Check>
        <Form.Check.Input
          bsPrefix="bns-checkbox"
          type="checkbox"
          id="pr"
          checked={useParameter}
          onChange={onChangeCheckbox}
        />
        <Form.Check.Label id="ch" htmlFor="pr" />
        <Form.Check.Label id="check1" htmlFor="pr">
          I want to use a promo code
        </Form.Check.Label>
      </Form.Check>
      <div className={style.container}>
        <div className={style.cnt}>
          <input
            disabled={!useParameter}
            type="text"
            placeholder="Input code"
            className={style.input}
            value={input}
            onChange={onChangeInput}
            onFocus={() => {
              setOpen(true);
            }}
          />

          {open && <div className={clsx(style.dropdown, style.openD)}>{filterItem()}</div>}
        </div>
        <button onClick={getPromoCode} disabled={!useParameter} type="button">
          {loading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
          Apply
        </button>
      </div>
      {error && <Alert variant="danger">{error.response?.data?.message || error.message}</Alert>}
    </Form.Group>
  );
}

export default DropDownSelect;
