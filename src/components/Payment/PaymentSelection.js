import React, { useEffect, useState } from "react";
import { Col, Row, Label, Button, } from "reactstrap";
import Card1 from "../../layout/Card";

const PaymentSelection = (props) => {

  const proceedToPayWithStripe = () => {
    props.setSelectedGateway('Stripe')
  }

  const proceedToPayWithCoingate = () => {
    props.setSelectedGateway('Coingate')
  }

  const goBack = () => {
    console.log("hit")
    props.setBackToPayment(false)

  }

  return (
    <Card1>
      <Row>
        <Col md={12}>
          <Label for="firstName">
            Please select a payment method?
          </Label>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 25,
            }}
          >
            <Button
              className="secondaryButton"
              style={{ width: "250px" }}
              onClick={() => proceedToPayWithStripe()}
            // disabled={props.disableConfirm}
            >
              Pay with Credit/Debit Card
            </Button>
          </div>

        </Col>
        <Col md={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 25,
            }}
          >
            <Button
              className="secondaryButton"
              style={{ width: "250px" }}
              onClick={() => proceedToPayWithCoingate()}
            // disabled={props.disableConfirm}
            >
              Pay with Digital Currency
            </Button>
          </div>
        </Col>
      </Row>
    </Card1>
  );
};

export default PaymentSelection;
