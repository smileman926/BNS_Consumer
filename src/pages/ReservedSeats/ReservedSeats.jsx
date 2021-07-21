/* eslint-disable react-hooks/exhaustive-deps */
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import routers from "router";
import withAuth from "utils/HOC/withAuth";
import { getWebinarSeats, isReservedUser, reservedSeats } from "utils/services/api";
import cartIcon from "./../../images/icons/cart.svg";
import screen from "./../../images/purchase_stadium.png";
import { addItem } from "./../../redux/cart/Actions";
import * as style from "./ReservedSeats.module.scss";

function ReservedSeats({ match, history, location }) {
  const { id } = match.params;
  const user_id = useSelector((state) => (state.auth.user ? state.auth.user.id : null));

  const [seats, setSeats] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [isProgress, setIsProgress] = useState(false);

  const cart = useSelector((state) => state.cart);

  useEffect(() => {

    async function load() {
      const res = await isReservedUser(id, user_id);
      if (res) {
        if (res.message)
          setErrMessage(res.message);
        else {
          const { data } = res;
          if (data.is_reserved) {
            history.push(routers.buyProduct.path, {
              productType: "webinar",
              seats: data.seatNo,
              price: price_per_seats,
              quantity: data.seatNo.length,
              id,
            });
          } else {
            getWebinarSeats(id)
              .then((res) => setSeats(res.message))
              .catch((err) => setErrMessage(err.message));
          }
        }
      }
    }

    if (!!cart?.find((el) => el.id === id)) {
      history.push(routers.cart.path);
      return;
    }    
    load();

  }, []);

  const reservedPlace = () => {
    setIsProgress(true);
    reservedSeats({
      webinar_id: id,
      user_id,
      seatNoArray: selectedPlace.map((el) => el - 1),
    })
      .then((res) => {
        setIsProgress(false);
        history.push(routers.buyProduct.path, {
          // place: selectedPlace,
          seats: selectedPlace,
          quantity: selectedPlace.length,
          productType: "webinar",
          price: price_per_seats,
          id,
          category_id
        });
      })
      .catch((err) => {
        setIsProgress(false);
        setErrMessage(err.message);
      });
  };

  const selectPlace = ({ target }) => {
    const { num } = target.dataset;

    const place = Number(num);

    if (selectedPlace.includes(place)) {
      setSelectedPlace(selectedPlace.filter((el) => el !== place));
    } else {
      setSelectedPlace([...selectedPlace, place]);
    }
  };

  const dispatch = useDispatch();

  const { name, price_per_seats, category_id } = location.state;

  const addCart = () => {
    setIsProgress(true);
    reservedSeats({
      webinar_id: id,
      user_id,
      seatNoArray: selectedPlace.map((el) => el - 1),
    })
      .then((res) => {
        setIsProgress(false);
        dispatch(
          addItem({
            name,
            category_id,
            price: price_per_seats,
            seats: selectedPlace,
            quantity: selectedPlace.length,
            id,
            productType: "webinar",
          })
        );
        history.push(routers.cart.path);
      })
      .catch((err) => {
        setIsProgress(false);
        setErrMessage(err.message);
      });
  };
  const setRandomSeat = () => {
    const clearSeat = [];

    for (let i = 0; i < seats.length; i++) {
      const element = seats[i];
      if (element === "available" && !selectedPlace.includes(i + 1)) {
        clearSeat.push(i + 1);
      }
    }
    const min = 0;
    const max = clearSeat.length;
    const random = Math.floor(Math.random() * (+max - +min)) + +min;
    if (clearSeat.length) {
      setSelectedPlace([...selectedPlace, clearSeat[random]]);
    }
  };

  const disabledRandom = useMemo(() => {
    const clearSeat = [];
    if (seats) {
      for (let i = 0; i < seats.length; i++) {
        const element = seats[i];
        if (element === "available" && !selectedPlace.includes(i + 1)) {
          clearSeat.push(i + 1);
        }
      }
      return !clearSeat.length;
    }
    return true;
  }, [selectPlace, seats]);

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center font-weight-bold mb-4">Purchase Seats</h1>

          {errMessage && <Alert variant="danger"> {errMessage} </Alert>}
          <div className={style.seats_box}>
            {!seats && <FontAwesomeIcon icon={faSync} spin size="4x" className="mt-5" />}
            {seats &&
              seats.map((place, i) => (
                <button
                  type="button"
                  key={Math.random()}
                  disabled={place !== "available"}
                  data-num={i + 1}
                  onClick={selectPlace}
                  className={`${style.place_btn} ${style[place]} ${
                    selectedPlace.includes(i + 1) ? style.selected : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
          </div>

          {seats && (
            <>
              <div className={style.img__wrp}>
                <img src={screen} alt="screen" className={style.img} />
              </div>

              <div className={style.type_box}>
                <p className={style.type}>
                  <span className={style.available}></span> Available
                </p>
                <p className={style.type}>
                  <span className={style.reserved}></span> Reserved
                </p>
                <p className={style.type}>
                  <span className={style.taken}></span> Taken
                </p>
              </div>

              <div className={style.btnRow}>
                <Button
                  variant="bns"
                  className={clsx("px-5 m-0", style.bntNext)}
                  onClick={reservedPlace}
                  disabled={isProgress || selectedPlace.length === 0}
                >
                  {isProgress && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
                  proceed to checkout
                </Button>
                <button
                  variant="bns"
                  type="button"
                  className={style.btnAddToCart}
                  onClick={addCart}
                  disabled={isProgress || selectedPlace.length === 0}
                >
                  <img src={cartIcon} alt="cart icon" />
                  add to cart
                </button>
                <Button
                  variant="bns"
                  className={clsx("px-5 m-0", style.bntRandom)}
                  onClick={setRandomSeat}
                  disabled={disabledRandom}
                >
                  Random Seat
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default withAuth(ReservedSeats);
