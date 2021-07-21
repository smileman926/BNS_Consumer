import { Row, Col } from "react-bootstrap";
import React from "react";
import "./List.scss";
import routers from "router";
import { Link } from "react-router-dom";

const List = ({ header, list }) => {
  return (
    <>

        <Row className="list-header p-3">
          <Col>
            <strong>{header[0]}</strong>
          </Col>
          <Col className="text-right">
            <strong>{header[1]}</strong>
          </Col>
        </Row>
      {
        list.map((item) => {
          return (
            <Row key={item.id} className="list-item px-3 ">
              <Col className="mt-3 mb-3 ">
                <span
                  className={`${
                    item?.number_used > 0 && item?.webinar?.product_status !== "active"
                      ? "title error"
                      : "title"
                  }`}
                >
                  {item.id}
                </span>
              </Col>
              <Col className="mt-2 mb-2 d-flex flex-column justify-content-center text-right">
                {item?.number_used > 0 && item?.webinar?.product_status !== "active" ? (
                  <span>
                    <div className="reason"> Some reason</div>
                    <div>
                      <Link className="accentColorFont" to={routers.contactUs.path}>
                        Contact Customer Support
                      </Link>
                    </div>
                  </span>
                ) : (
                  <span className="webinar">{item.webinar.name}</span>
                )}
              </Col>
            </Row>
          );
        })}
    </>
  );
};

export default List;
