import "./styles.scss";
import React, { useState } from "react";
import Card1 from "../../layout/Card";
import { Label, Input, Row, Col, FormGroup, FormFeedback } from "reactstrap";
import { PaymentOption } from "../../constants/Enums/Hotels";

function PaymentOptions(props) {
  const [showCreditCardDetails, setShowCreditCardDetails] = useState(false);
  const [showCryptoCurrencyDetails, setShowCryptoCurrencyDetails] =
    useState(false);

  const handlePaymentMethodChange = (e) => {
    if (e.target.value === PaymentOption.CREDITCARD) {
      setShowCreditCardDetails(e.target.checked);
      props.setCreditCard(e.target.checked);
    }
    if (e.target.value === PaymentOption.CRYPTOCURRENCIES) {
      setShowCryptoCurrencyDetails(e.target.checked);
      setShowCryptoCurrencyDetails(e.target.checked);
      props.setCryptoCurrency(e.target.checked);
    }
  };

  return (
    <div>
      <div className="title_2">
        Payment Options<span style={{ color: "red" }}>*</span>
      </div>
      <div className="subtext">
        Choose the payment methods you want to accept from guests.
      </div>

      <Card1>
        <Row className="payment-options">
          <Col className="payment-option-box">
            <Label className="payment-option-label">
              <Input
                type="checkbox"
                className="payment-option-checkbox"
                name="paymentMethod"
                value="creditCard"
                onChange={handlePaymentMethodChange}
              />
              <span>Credit Card</span>
            </Label>
            {showCreditCardDetails && (
              <div className="payment-option-details">
                <FormGroup>
                  <Label>
                    Account Number<span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    className="form-control input_half"
                    id="account_number"
                    onChange={(e) => props.setAccountNumber(e.target.value)}
                    invalid={props.accountNumberInvalid}
                  />
                  <FormFeedback>Account number is required!</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Bank Holder's Name<span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    className="form-control input_half"
                    id="bank_holder_name"
                    onChange={(e) => props.setBankHolderName(e.target.value)}
                    invalid={props.bankHolderNameInvalid}
                  />
                  <FormFeedback>Bank holder's name is required!</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Bank Name<span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    className="form-control input_half"
                    id="bank_name"
                    onChange={(e) => props.setBankName(e.target.value)}
                    invalid={props.bankNameInvalid}
                  />
                  <FormFeedback>Bank name is required!</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Branch Name<span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    className="form-control input_half"
                    id="branch_name"
                    onChange={(e) => props.setBranchName(e.target.value)}
                    invalid={props.branchNameInvalid}
                  />
                  <FormFeedback>Branch name is required!</FormFeedback>
                </FormGroup>
              </div>
            )}
          </Col>
          <Col className="payment-option-box">
            <Label className="payment-option-label">
              <Input
                type="checkbox"
                className="payment-option-checkbox"
                name="paymentMethod"
                value="cryptoCurrency"
                onChange={handlePaymentMethodChange}
              />
              <span>Crypto Currencies</span>
            </Label>

            {showCryptoCurrencyDetails && (
              <FormGroup className="payment-option-details">
                <Label>
                  Wallet Address<span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  className="form-control input_half"
                  id="wallet_address"
                  onChange={(e) => props.setOwnerWalletAddress(e.target.value)}
                  invalid={props.walletAddressInvalid}
                />
                <FormFeedback>
                  Wallet address is required and should be in valid format!
                </FormFeedback>
              </FormGroup>
            )}
          </Col>
        </Row>
      </Card1>
      <br />
    </div>
  );
}

export default PaymentOptions;
