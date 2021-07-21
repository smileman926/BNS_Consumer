import { Row, Col } from "react-bootstrap";
import React from "react";
import arrow from "../../../images/icons/arrow.svg";
import "./GiftCard.scss";
import moment from "moment";

const GiftCard = ({ card }) => {
  const renderComponent = () => {
    switch (card?.type) {
      case "manual correction":
        return <span>Manual correction</span>;
      case "created":
        return <span>You {card?.status === 'used' ? 'used' : 'received'} a gift card</span>;
      case "won":
        return <span>You won a gift card</span>;
      default:
        return "";
    }       
  };

  return (
    <Row className="gift-card box mt-4 py-3 px-1 p-sm-3">
      <Col xs={8} sm={4}>
        <div className="title text-left text-sm-center">
          <strong>Gift Card</strong>
        </div>
        <div className="trancaction">{renderComponent()}</div>
      </Col>
      <Col className="text-right" xs={4} sm={4}>
        <span>
          <div
            className={`arrow ${
              card?.type === 'manual correction' ? 'corrected' : card?.status === 'unused' ? 'get' : 'lose'
            } d-inline-flex justify-content-center align-items-center`}
          >
            <img src={arrow}></img>
          </div>
        </span>
      </Col>
      <Col
        className="text-sm-right d-flex d-sm-block align-items-center justify-content-between"
        xs={12}
        sm={4}
      >
        <div className="date">{moment(card.updatedAt).format("MMMM Do, YYYY")}</div>
        <div className={`cost ${card.status === "unused" ? "get" : "lose"}`}>
          &#36;{Number(card.amount).toFixed(2)}
        </div>
      </Col>
    </Row>
  );
};

export default GiftCard;
