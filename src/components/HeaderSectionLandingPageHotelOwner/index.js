import React, { useState } from "react";
import { Input, Button } from "reactstrap";
import styles from "./index.module.scss";
import "../../index.scss";
import { useSelector, useDispatch } from "react-redux";
import { hide } from "../../redux/visibility/visibleSlice";
import { useNavigate } from "react-router-dom";
import XrplService from "../../services-common/xrpl-service";
import HotelService from "../../services-domain/hotel-service copy";
import toast from "react-hot-toast";
import ToastInnerElement from "../ToastInnerElement/ToastInnerElement";
import {xummAuthorize} from "../../services-common/xumm-api-service";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const HeaderSectionLandingPageHotelOwner = () => {
  const navigate = useNavigate();
  const visibility = useSelector((state) => state.value);
  const dispatch = useDispatch();
  const xrplService = XrplService.xrplInstance;
  const hotelService = HotelService.instance;
  const loginState = useSelector(state => state.loginState)

  const [secret, setSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  const registerHotel = async () => {
     if(!loginState.isLoggedIn) {
      if(await xummAuthorize()) {
        navigate("/register-hotel");
      }
    } else {
      navigate("/register-hotel");
    }
  };

  const viewHotelDetails = async () => {
    if(!loginState.isLoggedIn) {
      if(await xummAuthorize()) {
        navigate("/hotel-list");
      }
    } else {
      navigate("/hotel-list");
    }
};

  const submit = async (e) => {
    e.preventDefault();
    setDisableSubmitBtn(true);
    if (!xrplService.isValidSecret(secret)) {
      toast(
          (element) => (
              <ToastInnerElement message={"Invalid secret."} id={element.id}/>
          ),
          {
              duration: Infinity,
          }
      );
      setDisableSubmitBtn(false);
      return;
    }

    // Check if registered hotel
    const res = await hotelService.generateHotelWallet(secret);
    if (!res) {
      setErrorMessage("This is not a registered hotel's secret.");
      setDisableSubmitBtn(false);
      return;
    }

    dispatch(hide());
    navigate(`/hotel/${res.Id}`);
  };

  return (
    <div className={styles.heroImage}>
      <Row>
        <Col className={styles.content}>
          <span className={styles.heading}>Your world</span> <br />
          <hr className="noMargin" />
          <span className={styles.heading}>worth sharing!</span>
          <br />
          <div className={styles.breaker}></div>
          <span className={styles.description}>
            Are you a hotel owner looking to increase your bookings and reach a
            wider audience? Look no further than our hotel booking website! With
            our highly secure platform and state-of-the-art cryptographic
            wallet, you can be sure that your information and transactions are
            always safe and protected.
            <br />
            <br /> By listing your property on our platform, you'll have access
            to a vast network of potential guests, allowing you to expand your
            reach and increase your bookings. Our user-friendly interface makes
            it easy to manage your listings and keep track of your reservations,
            saving you time and hassle.
            <br />
            <br /> Plus, with our advanced booking and payment systems, you can
            rest easy knowing that your payments will always be processed
            quickly and securely. So why wait? Sign up today and start reaping
            the benefits of our trusted and secure hotel booking platform.
          </span>
          <hr className="" />
          <div>
            <Button
              className={`primaryButton smallMarginTopBottom ${styles.buttonOverride}`}
              onClick={() => viewHotelDetails()}
            >
              View Hotel Details
            </Button>
            <Button
              className="secondaryButton smallMarginTopBottom"
              onClick={() => registerHotel()}
            >
              Register Hotel
            </Button>
          </div>
          {visibility ? (
            <div className={styles.secretWrapper}>
              <Input
                type="text"
                name="secret"
                id="secret"
                placeholder="Secret"
                onChange={(e) => setSecret(e.target.value)}
              />{" "}
              <p style={{ color: "red" }}>{errorMessage}</p>
              <Button
                className="secondaryButton smallMarginTopBottom"
                onClick={(e) => submit(e)}
                disabled={disableSubmitBtn}
              >
                Let's Go
              </Button>
            </div>
          ) : null}
        </Col>
        <div className={styles.backgroundShape}></div>
      </Row>
    </div>
  );
};

export default HeaderSectionLandingPageHotelOwner;
