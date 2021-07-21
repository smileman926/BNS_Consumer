import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner, Form } from "react-bootstrap";
import ProductCardItem from "@components/ProductCardItem";
import {setScrollAndOffset} from "@redux/product/Actions";
import { getAllProductsApi } from 'utils/services/productApi';
import InfiniteScroll from "react-infinite-scroll-component";

import "./Products.style.scss";
import { Helmet } from "react-helmet";

const Products = () => {

  const dispatch = useDispatch();
  const scrollAndOffset = useSelector((state) => (state.product.scrollAndOffset));
  
  const [state, setState] = useState({
    showLoadMore: true,
    limit: scrollAndOffset?.offset ? scrollAndOffset.offset : 12,
    offset: 0,
    prevList: [],
  });

  const [filterType, setFilterType] = useState(scrollAndOffset?.filter ? scrollAndOffset.filter : 'webinar');
  const [isLoading, setIsLoading] = useState(false);

  const scrollingElement = (document.scrollingElement || document.body);

  useEffect(() => { 
    let body = {
      limit: scrollAndOffset?.offset ? scrollAndOffset.offset : 12, 
      offset: 0, 
      product_type: filterType === 'physical' ? filterType : 'webinar'
    }
    switch (filterType) {
      case 'webinar':
        body.webinar_type = 'webinar';
        break;
      case 'seats':
        body.webinar_type = 'seats';
        break;
      case 'gifts':
        body.webinar_type = 'gifts';
        break;
      default:
        break;
    }
    getAllProductsApi(body)
    .then( res => {
      res?.data && setState({...state, prevList: res.data});
      scrollingElement.scrollTop = scrollAndOffset?.scroll ? scrollAndOffset?.scroll : 0;
    })

  }, []);

  const loadMoreFunc = () => { 
    setTimeout(() => {
      let { offset, limit, prevList } = state;
      let body = {
        limit: 4, 
        offset: offset + limit, 
        product_type: filterType === 'physical' ? filterType : 'webinar'
      }
      switch (filterType) {
        case 'webinar':
          body.webinar_type = 'webinar';
          break;
        case 'seats':
          body.webinar_type = 'seats';
          break;
        case 'gifts':
          body.webinar_type = 'gifts';
          break;
        default:
          break;
      }
      getAllProductsApi(body)
      .then( res => {
        if (res && res.data && res.count > 0) {
          prevList = [...prevList, ...res.data];
          setState({ ...state, offset: offset + limit, limit: 4, prevList: prevList, showLoadMore: limit + offset < res.count });
        }
      })   
    }, 500);
  };

  const storeOffsetAndScroll = () => {
    dispatch(setScrollAndOffset({
      scroll: scrollingElement.scrollTop,
      offset: scrollingElement.scrollTop === 0 ? 12 : state.offset,
      filter: filterType
    }))
  }

  const handlerSelect = ({ target }) => {
    console.log(target.value);
    setFilterType(target.value);
    let body = {
      limit: 12, offset: 0, product_type: target.value === 'physical' ? target.value : 'webinar'
    }
    switch (target.value) {
      case 'webinar':
        body.webinar_type = 'webinar';
        break;
      case 'seats':
        body.webinar_type = 'seats';
        break;
      case 'gifts':
        body.webinar_type = 'gifts';
        break;
      default:
        break;
    }
    setIsLoading(true);
    getAllProductsApi(body)
    .then( res => {
      setIsLoading(false);
      res?.data && setState({...state, limit:12, offset:0, prevList: res.data, showLoadMore: 12 < res.count});
      scrollingElement.scrollTop = 0;
    })
    .catch( err => {
      setIsLoading(false);
    })
  };

  return (
    <>
      <Helmet>
        <title>The BM Revolution</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="List of products" />
        <meta property="og:title" content="The BM Revolution" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="The BM Revolution" />
        <meta property="og:description" content="List of products" />
      </Helmet>
      <Container className="products" fluid>
      <Row>
        <Col xs={{offset: 3, span: 9}} sm={{offset: 6, span: 6}} lg={{offset: 8, span: 4}} xl={{offset: 9, span: 3}}>
          <div className="select_wrp">
            <Form.Control
              as="select"
              className="select"
              value={filterType}
              onChange={handlerSelect}
            >              
              <option value="webinar">Webinar</option>
              <option value="seats">Minis/micros webinars</option>
              <option value="gifts">Gift Cards webinars</option>
              <option value="physical">Products</option>  
            </Form.Control>
          </div>
        </Col>
      </Row>
        <InfiniteScroll
          className = "own-infinite mt-3"
          dataLength={state.prevList.length}
          next={loadMoreFunc}
          hasMore={state.showLoadMore}
          loader={<Row>
            <Col className="text-center">
              <Spinner animation="grow" variant="dark" />
            </Col>
          </Row>}
        >
          { isLoading && <Row>
            <Col className="text-center">
              <Spinner animation="grow" variant="dark" />
            </Col>
          </Row>}
          <Row className="justify-content-md-center">
            { !isLoading && state.prevList?.length > 0 && state.prevList.map((item) => (
              <Col lg="3" md="6" sm="6" xs="12" key={item.id}>
                <ProductCardItem hasWebinar={item.product_type === "webinar"} product={item} showScrollPos={storeOffsetAndScroll}/>
              </Col>
            ))}            
          </Row>
        </InfiniteScroll>
      </Container>
    </>
  );
  
}

export default Products;
