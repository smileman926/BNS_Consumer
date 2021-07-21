import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import './WinnedItemList.style.scss';
import sample from '@images/dummy/sample.png'

function WinnedItemList(props) {
  return (
    <div className="winned-items">
        <h2>Items Won</h2>
        <Row className="winned-items-header flex-between-center">
          <Col className="winned-items-item">IMAGE</Col>
          <Col className="winned-items-item">Product Name</Col>
          <Col className="winned-items-item">SEAT NUMBER</Col>
          <Col className="winned-items-item">TICKET PRICE</Col>
        </Row>
        <Row className="winned-items-row flex-between-center">
          <Col className="winned-items-item image-item"><img src={sample}/></Col>
          <Col className="winned-items-item">Product Name</Col>
          <Col className="winned-items-item">SEAT NUMBER</Col>
          <Col className="winned-items-item">TICKET PRICE</Col>
        </Row>
        <Row className="winned-items-row flex-between-center">
          <Col className="winned-items-item image-item"><img src={sample}/></Col>
          <Col className="winned-items-item">Product Name</Col>
          <Col className="winned-items-item">SEAT NUMBER</Col>
          <Col className="winned-items-item">TICKET PRICE</Col>
        </Row>
    </div>
  )
}

WinnedItemList.propTypes = {

}

export default WinnedItemList

