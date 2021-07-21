/* eslint-disable react-hooks/exhaustive-deps */
import MyCommentsCard from "@components/MyCommentsCard";
import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./MyComments.module.scss";
function MyComments({ id, comments, getComments }) {
  useEffect(() => {
    getComments(id);
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="mb-4">All Comments ({comments.length})</h2>
          {comments.map((el) => (
            <MyCommentsCard comment={el} key={el.message.id} />
          ))}
          {comments.length === 0 && (
            <h3 className="text-center">No Comments</h3>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MyComments;
