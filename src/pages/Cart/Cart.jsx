import React, { useState } from "react";
import { Button, Col, Container, Row, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import withAuth from "utils/HOC/withAuth";
import * as style from "./Cart.module.scss";
import CartItem from "./CartItem";
import routers from "../../router";
import { Helmet } from "react-helmet";

function Cart() {
  const list = useSelector((state) => state.cart);
  const history = useHistory();
  const handleCheckoutClick = () => {
    history.push(routers.buyProduct.path, [...list]);
  };

  const [showExpiration, setShowExpiration] = useState(false);

  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={6} xl={4}>
          {showExpiration && <Alert variant="danger" className="text-center mt-3 font-weight-bolder">Seat reservation is expired!</Alert>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-4 mb-sm-4">
            <h2>My Cart</h2>
          </Col>
        </Row>
        {list.length === 0 && <h3 align="center">Empty</h3>}
        {list.length > 0 && (
          <Row>
            <Col>
              <div className={style.list_box}>
                {list.map((item) => (
                  <CartItem item={item} key={item.key} showAlert={setShowExpiration}/>
                ))}
                <div className={style.footer}>
                  <div className={style.total_box}>
                    <div className={style.total_title}>Total Price</div>
                    <div className={style.total}>
                      $
                      {list
                        .reduce(
                          (acc, el) => (acc += (el.quantity || el.seats.length) * el.price),
                          0
                        )
                        .toFixed(2)}
                    </div>
                  </div>
                  <Button variant="bns" className="m-0" onClick={handleCheckoutClick}>
                    checkout
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default withAuth(Cart);
