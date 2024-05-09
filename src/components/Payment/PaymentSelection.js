import React, { useEffect, useState } from "react";
import {Col, Row,  Label, Button,} from "reactstrap";
import Card1 from "../../layout/Card";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-hot-toast";
import ToastInnerElement from "../ToastInnerElement/ToastInnerElement";
import { PaymentResults } from "../../constants/constants";
import { LocalStorageKeys, DestinationTags } from "../../constants/constants";
import HotelService from "../../services-domain/hotel-service copy";
import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import { setShowScreenLoader } from "../../redux/screenLoader/ScreenLoaderSlice";

const PaymentSelection = (props) => {

  const navigate = useNavigate();


  const selectionDetails = useSelector((state) => state.selectionDetails);

  const dispatch = useDispatch();

  // disable confirm button logic
/*  useEffect(() => {
    if (firstName && lastName && email && phoneNo) {

      props.setDisableConfirm(false);
    } else {
      props.setDisableConfirm(true);
    }
  }, [firstName, lastName, email, phoneNo]);

*/

  const proceedToPayWithStripe = () => {
    props.setSelectedGateway('Coingate')

  }

   const proceedToPayWithCoingate = () => {
    props.setSelectedGateway('Coingate')
   // navigate(`/cg-payment`);

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
                Please select the payment gateway?
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
            onClick={() => proceedToPayWithStripe()}
           // disabled={props.disableConfirm}
          >
            Pay with Stripe
          </Button>
          <Button
            className="secondaryButton"
            style={{ width: "180px" }}
            onClick={() => proceedToPayWithCoingate()}
           // disabled={props.disableConfirm}
          >
            Pay with Coingate
          </Button>
        </div>
          </Col>
        </Row>
    </Card1>
  );
};

export default PaymentSelection;
