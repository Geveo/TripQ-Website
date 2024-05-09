import React, { useEffect, useState } from "react";
import {Col, Form, Row, FormGroup, Label, Button, Input, FormFeedback,} from "reactstrap";
import StripeCheckout from "./StripeCheckout";
import Card1 from "../../layout/Card";

const StripePayment = (props) => {
  const goBack = () => {
    console.log("hit")
    props.setBackToPayment(false)

  }
  return (
    <Card1>
        <Row>
        <StripeCheckout totalPrice={props.totalPrice}/>
       
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
            style={{ width: "180px" }}
            onClick={() => goBack()}
          >
            Back
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
            style={{ width: "180px" }}
           // onClick={() => submitForm()}
           // disabled={props.disableConfirm}
           // onClick={() => proceedToPay()}
          >
            Continue To Payment
          </Button>
        </div>
          </Col>
        </Row>
    </Card1>
  );
};

export default StripePayment;
