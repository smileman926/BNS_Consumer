import BacketImg from "@components/BacketImg";
import purchaseActions from "@redux/purchase/Actions";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";

const { getWebinarWinnerRequest } = purchaseActions;

function WinnedItemList(props) {
  useEffect(() => {
    props.getWebinarWinnerRequest({
      filterString: "",
      pageNo: 1,
      limit: 10,
      user_id: props.user_id,
    });
  }, []);

  if (props.winnerItemHistory.length === 0) {
    return (
      <div className="purchase-history-list">
        <h2>Items Won</h2>
        <div className="text-center">You didn't win anything yet</div>
      </div>
    );
  }

  return (
    <div className="winned-items">
      <h2>Items Won</h2>
      {props.winnerItemHistory && (
        <Row className="winned-items-header flex-between-center">
          <Col className="winned-items-item">IMAGE</Col>
          <Col className="winned-items-item">Product Name</Col>
          {/* <Col className="winned-items-item">SEAT NUMBER</Col> */}
          <Col className="winned-items-item">TICKET PRICE</Col>
        </Row>
      )}
      {props.winnerItemHistory && props.winnerItemHistory.length > 0 &&
        props.winnerItemHistory.map((item, i) => 
          item ?
            <Row className="purchase-history-list-header flex-between-center" key={i}>
              <Col className="purchase-history-list-item">
                <BacketImg alt={item?.name} main_image={item?.main_image} />
              </Col>
              <Col className="purchase-history-list-item">{item?.name}</Col>
              {/* <Col className="purchase-history-list-item">{item.seatNo}</Col> */}
              <Col className="purchase-history-list-item">{item?.price_per_seats} $</Col>
            </Row>
          :
          null       
        )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  winnerItemHistory: state.purchase.webinarWinnerHistory,
  filterOptions: state.purchase.webinarWinnerHistoryFileter,
  user_id: state.auth.user ? state.auth.user.id : null,
});

const mapDispatchToProps = {
  getWebinarWinnerRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WinnedItemList);
