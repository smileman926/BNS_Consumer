/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import BNSDropDown from "@components/Utilities/BNSDropDown";
import { connect } from "react-redux";
import purchaseActions from "@redux/purchase/Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import floatFormat from "../../utils/formats/float"

const { getPurchaseHistoryRequest } = purchaseActions;

function PurchaseHistoryList(props) {
  const [filter, setFilter] = useState({
    filterString: props.search,
    pageNo: 1,
    limit: 5,
    user_id: props.user_id,
  });

  console.log(props.purchaseHistory);

  useEffect(() => {
    props.getPurchaseHistoryRequest(filter);
  }, [filter]);

  useEffect(() => {
    setFilter({ ...filter, filterString: props.search });
  }, [props.search]);

  if (
    props.purchaseHistory && props.purchaseHistory.length === 0 &&
    !props.isLoading
  ) {
    return (
      <div className="purchase-history-list">
        <h2>Purchase history</h2>
        <div className="text-center">You didn't purchase anything yet</div>
      </div>
    );
  }

  const convertDate = (time) => {
    const date = new Date(time);
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en", options);
  };

  const handlerLimit = ({ name: limit }) => {
    setFilter({ ...filter, limit, pageNo: 1 });
  };

  return (
    <div className="purchase-history-list">
      <h2 className="mb-4">Purchase history</h2>
      <Row className="mb-4">
        <Col xs={12} sm={6} className="mb-4 mb-sm-0">
          <BNSDropDown
            selectedOption={{ name: 5 }}
            options={[{ name: 5 }, { name: 10 }, { name: 20 }]}
            onSelect={handlerLimit}
          />
        </Col>
        <Col className="text-center" xs={12} sm={6}>
          <div className="text-center d-block m-0 ml-sm-auto">
            <Pagination className='mx-auto  ml-sm-auto mr-sm-0'>
              <Pagination.First
                disabled={filter.pageNo === 1}
                onClick={() => setFilter({ ...filter, pageNo: 1 })}
              />
              <Pagination.Prev
                disabled={filter.pageNo === 1}
                onClick={() => setFilter({ ...filter, pageNo: filter.pageNo - 1 })}
              />
              <Pagination.Item>{filter.pageNo}</Pagination.Item>
              <Pagination.Next
                onClick={() => setFilter({ ...filter, pageNo: filter.pageNo + 1 })}
                disabled={Math.ceil(props.countItem / filter.limit) === filter.pageNo}
              />
              <Pagination.Last
                disabled={Math.ceil(props.countItem / filter.limit) === filter.pageNo}
                onClick={() =>
                  setFilter({
                    ...filter,
                    pageNo: Math.ceil(props.countItem / filter.limit),
                  })
                }
              />
            </Pagination>
          </div>
        </Col>
      </Row>

      {props.isLoading && <FontAwesomeIcon icon={faSync} spin className="purchase-loading-icon" />}
      {!props.isLoading && props.purchaseHistory && (
        <>
          <div className="purchase-history-list-header name d-flex justify-content-between align-items-center">
            <div className="purchase-history-list-item">name of the product</div>
            <div className="purchase-history-list-item">date of purchase</div>
            <div className="purchase-history-list-item">payment</div>
            <div className="purchase-history-list-item"> product price </div>
            <div className="purchase-history-list-item"> status </div>
          </div>
          { props.purchaseHistory.length > 0 && props.purchaseHistory.map((item) => 
            item ?
            <div
              className="purchase-history-list-header d-flex justify-content-between align-items-center"
              key={item?.id}
            >
              <div className="purchase-history-list-item">{item?.product_name}</div>
              <div className="purchase-history-list-item">{convertDate(item?.created_date)}</div>
              <div className="purchase-history-list-item">{item?.is_reward === 0 ? 'Bill' : 'Reward'}</div>
              <div className="purchase-history-list-item">${floatFormat(item?.price)}</div>
              <div className="purchase-history-list-item">{item?.orderStatus}</div>
            </div>
            :
            <div className="text-center">You didn't purchase anything yet</div>
          )}
        </>
      )}
    </div>
  );
}

PurchaseHistoryList.propTypes = {};

const mapStateToProps = (state) => ({
  user_id: state.auth.user ? state.auth.user.id : null,
  purchaseHistory: state.purchase.purchaseHistory,
  filterOptions: state.purchase.purchaseHistoryFileter,
  countItem: state.purchase.purchaseHistoryCount,
  isLoading: state.purchase.isHistoryLoading,
});

const mapDispatchToProps = {
  getPurchaseHistoryRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseHistoryList);
