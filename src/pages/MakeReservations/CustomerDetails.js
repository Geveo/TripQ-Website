import MainContainer from "../../layout/MainContainer";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Button,
  Col,
  Row,
  FormFeedback,
} from "reactstrap";
import Card1 from "../../layout/Card";
import { showPayQRWindow } from "../../services-common/xumm-api-service";
import { useSelector } from "react-redux";
import {DestinationTags} from "../../constants/constants";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const loginState = useSelector((state) => state.loginState); 
  const submitForm = async () => {
    console.log("making payments..");
    const result = await showPayQRWindow(
      loginState.loggedInAddress,
      `raQLbdsGp4FXtesk5BSGBayBFJv4DESuaf`,
      "6",
      DestinationTags.RESERVATION_PAYMENT,
      process.env.REACT_APP_CURRENCY,
      process.env.REACT_APP_CURRENCY_ISSUER
    );
    console.log(result);
    if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      country.length > 0
    ) {
    }
  };
  return (
    <>
      <MainContainer>
        <div className="title_1">Enter Your Details</div>
        <Card1>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="first_name" className="noMargin">
                  First Name<span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  onChange={(e) => setFirstName(e.target.value)}
                  //invalid={propertyNameInvaid}
                />
                <FormFeedback>First name is required!</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="last_name" className="noMargin">
                  Last Name<span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  onChange={(e) => setLastName(e.target.value)}
                  //invalid={propertyNameInvaid}
                />
                <FormFeedback>Last name is required!</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="email" className="noMargin">
                  Email Address<span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  //invalid={propertyNameInvaid}
                />
                <FormFeedback>Email is required!</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="country" className="noMargin">
                  Country<span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="country"
                  onChange={(e) => setCountry(e.target.value)}
                  //invalid={propertyNameInvaid}
                />
                <FormFeedback>Country is required!</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>
                  Contact Number<span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  id="contact_number"
                  onChange={(e) => setContactNumber(e.target.value)}
                />
                <FormFeedback>
                  Phone Number should be a 10 digit number!
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div style={{ paddingTop: 30 }}>
                <Button
                  className="secondaryButton"
                  style={{ width: "180px" }}
                  onClick={() => navigate("/make-reservations")}
                >
                  Back
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: 30,
                }}
              >
                <div>
                  <Button
                    className="secondaryButton"
                    style={{ width: "180px" }}
                    onClick={() => submitForm()}
                  >
                    Continue To Payment
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card1>
      </MainContainer>
    </>
  );
};
export default CustomerDetails;
