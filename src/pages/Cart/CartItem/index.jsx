/* eslint-disable react-hooks/exhaustive-deps */
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, changeItem } from "./../../../redux/cart/Actions";
import * as style from "./index.module.scss";
import { useEffect } from "react";
import { isReservedUser, cancelReservedSeats } from "utils/services/api";
import routers from "router";
import { useState } from "react";
import { useHistory } from 'react-router-dom';

function CartItem({ item, showAlert }) {
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.auth.user?.id);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    async function load() {
      const { data } = await isReservedUser(item.id, user_id);
      if ( data?.is_reserved) {
        const waitingTime = (new Date(new Date(data?.reserved_date).toString()).getTime() - new Date().getTime()) + 600000;
        setTimeout(() => {
          showAlert(true);
          delItem();
          setTimeout(() => {
            history.push(routers.products.path);
          }, 2000);
        }, waitingTime);
      }
      else
        delItem();   
    }

    if (item.productType === "webinar") {
      setLoading(true);
      load();
      setLoading(false);
    }
  }, []);

  const changeQuantityInc = () => {
    dispatch(
      changeItem({
        key: item.key,
        quantity: item.quantity + 1 <= item.max ? item.quantity + 1 : item.quantity,
      })
    );
  };
  const changeQuantityDec = () => {
    dispatch(
      changeItem({
        key: item.key,
        quantity: item.quantity - 1 > 0 ? item.quantity - 1 : item.quantity,
      })
    );
  };

  const delItem = () => dispatch(removeItem({ id: item.id }));

  const delWebinarItem = useCallback(() => {
    setLoading(true);
    cancelReservedSeats({ webinar_id: [item.id] })
      .then((res) => {
        setLoading(false);
        delItem();
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  }, [item]);

  return (
    <div className={style.row}>
      <div className={style.name}>{item.name}</div>
      {item.productType === "physical" && (
        <div className={style.quantity}>
          <span className="mr-3">Quantity:</span>
          <div className="quantity--box">
            <button type="button" className="button_change" onClick={changeQuantityDec}>
              -
            </button>
            <span className="quantity__count d-block">{item.quantity}</span>
            <button type="button" className="button_change" onClick={changeQuantityInc}>
              +
            </button>
          </div>
        </div>
      )}
      {item.productType === "webinar" && (
        <div className={style.seat}>Select Number: {item.seats.join(", ")}</div>
      )}
      <div className={style.price}>Price: ${item.price}</div>
      <div className={style.del}>
        <button
          className={style.delBtn}
          onClick={item.productType === "physical" ? delItem : delWebinarItem}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
