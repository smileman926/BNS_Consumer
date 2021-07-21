import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Pagination, FormControl, Form } from 'react-bootstrap'
import './PurchaseHistoryList.style.scss';
import BNSDropDown from '@components/Utilities/BNSDropDown';

function PurchaseHistoryList(props) {

  

  return (
    <div className="purchase-history">
        <h2>Purchase history</h2>
        <Row className="mb-4">
          <Col>
            <BNSDropDown selectedOption={{name:"5"}} options={[{name:"5"},{name:"10"},{name:"20"}]}/>

          </Col>
          <Col className="text-right">
            <div className="text-right d-block">
              <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
              </Pagination>
            </div>
            
          </Col>
        </Row>
        <div className="purchase-history-header d-flex justify-content-between align-items-center">
          <div className="purchase-history-item">Name of The Product</div>
          <div className="purchase-history-item">Date of Purchase</div>
          <div className="purchase-history-item">Product Price</div>
        </div>
        <div className="purchase-history-row d-flex justify-content-between align-items-center">
          <div className="purchase-history-item">Name of The Product</div>
          <div className="purchase-history-item">Date of Purchase</div>
          <div className="purchase-history-item">Product Price</div>
        </div>
        <div className="purchase-history-row  d-flex justify-content-between align-items-center">
          <div  className="purchase-history-item">Name of The Product</div>
          <div className="purchase-history-item">Date of Purchase</div>
          <div className="purchase-history-item">Product Price</div>
        </div>
    </div>
  )
}

PurchaseHistoryList.propTypes = {

}

export default PurchaseHistoryList

