import React, { useState } from "react";
import PurchaseHistoryList from "./PurchaseHistoryList";
import WinnedItemList from "./WinnedItemList";
import { InputGroup, FormControl, Button, Container, Row, Col } from "react-bootstrap";
import "./PurchaseHistory.style.scss";
import withAuth from "utils/HOC/withAuth";

function PurchaseHistory(props) {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");

  const handlerSearch = () => setValue(search);

  return (
    <Container className="purchase-history">
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search by product"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            />
            <InputGroup.Append>
              <Button className="btn-bns" onClick={handlerSearch}>
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <PurchaseHistoryList search={value} />
      <WinnedItemList />
    </Container>
  );
}

PurchaseHistory.propTypes = {};

// export default PurchaseHistory;
export default withAuth(PurchaseHistory);
