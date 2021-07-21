import TabButton from "@components/TabButton";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "@pages/MyRewards/List";
import { getRewards } from "@redux/rewards/Actions";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "utils/HOC/withAuth";
import giftCard from "../../images/icons/gift-card.svg";
import GiftCard from "./GiftCard";
import "./MyRewards.scss";

function MyRewards() {
  const [rewardType, setRewardType] = useState("cards");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRewards());
  }, []);
  const gifts = useSelector((state) => state.rewards.list)?.gifts || [];
  const promoCode = useSelector((state) => state.rewards.list)?.promoCode || [];
  const loading = useSelector((state) => state.rewards.loading);

  const changeType = (type) => {
    setRewardType(type);
  };

  const compareType = (type) => {
    return rewardType === type;
  };

  const getSumOfTransactions = useMemo(
    () =>
      gifts.reduce(
        (acc, gift) => (acc += gift.status === "unused" ? Number(gift.amount) : Number(gift.amount) * -1),
        0
      ),
    [gifts]
  );

  return (
    <>
      {loading && <FontAwesomeIcon icon={faSync} spin size="4x" className="mt-5 m-auto d-block" />}
      {!loading && (
        <Container className="py-5 ">
          <Row>
            <Col>
              <h2>My Rewards</h2>
            </Col>
          </Row>
          <Row className="p-0 p-sm-2">
            <Col
              xs={12}
              sm={{ offset: 1, span: 10 }}
              md={{ offset: 3, span: 6 }}
              className="py-3 p-md-3 d-flex justify-content-center wrpTabBTN"
            >
              <div onClick={() => changeType("cards")} className="mr-sm-2">
                <TabButton
                  img={giftCard}
                  title="My Gift Cards"
                  selected={compareType("cards")}
                ></TabButton>
              </div>
              <div onClick={() => changeType("promocode")}>
                <TabButton
                  img={giftCard}
                  title="My Promo Codes"
                  selected={compareType("promocode")}
                ></TabButton>
              </div>
            </Col>
          </Row>
          <Row className="p-1 p-sm-3">
            {compareType("cards") ? (
              <Col
                sm={{ offset: 1, span: 10 }}
                md={{ offset: 2, span: 8 }}
                lg={{ offset: 3, span: 6 }}
                className="box p-1 py-4 p-sm-3 text-center"
              >
                <div className="with-border d-flex justify-content-center align-items-center mx-auto mb-4">
                  <div className="balance d-flex justify-content-center align-items-center p-2">
                    Current Balance
                    <div className="line mx-4"></div>
                    <span className="cost get">&#36;{getSumOfTransactions}</span>
                  </div>
                </div>
                <div className="mx-4">
                  {gifts.length > 0 ? (
                    gifts.map((card) => <GiftCard key={card.id} card={card}></GiftCard>)
                  ) : (
                    <h2>Empty</h2>
                  )}
                </div>
              </Col>
            ) : (
              <Col sm={{ offset: 1, span: 5 }} md={{ offset: 2, span: 8 }}>
                {promoCode.length === 0 ? (
                  <h2>Empty</h2>
                ) : (
                  <List list={promoCode} header={["Promo Codes", "Applicable Webinars"]}></List>
                )}
              </Col>
            )}
          </Row>
        </Container>
      )}
    </>
  );
}

export default withAuth(MyRewards);
