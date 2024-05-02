import "./styles.scss";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import styles from "../../components/HeaderSectionLandingPageHotelOwner/index.module.scss";
// import {Button} from "reactstrap";
import { xummAuthorize } from "../../services-common/xumm-api-service";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { InputGroup, Label } from "reactstrap";

export default function SignUp() {
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.loginState);

  const registerHotel = async () => {
    if (!loginState.isLoggedIn) {
      if (await xummAuthorize()) {
        navigate("/register-hotel");
      }
    } else {
      navigate("/register-hotel");
    }
  };

  return (
    <>
      <div className="background-image"></div>

      <Container className="content-container">
        <Card>
        <Row>
            <div className="blue-bar">
              <div className="logo-container">
                <img
                  className="logo-image"
                  src="/Assets/Images/TripQ.png"
                  alt="React Bootstrap logo"
                />
              </div>
            </div>
          </Row>
        </Card>
        <div className="user-auth">
          <Row>
            <div className="blue-bar">
              <div className="logo-container">
                <img
                  className="logo-image"
                  src="/Assets/Images/TripQ.png"
                  alt="React Bootstrap logo"
                />
              </div>
            </div>
          </Row>
          <Row>
            <div
              className="signup-text mt-4"
              style={{ color: "rgb(44 44 118)" }}
            >
              SignUp
            </div>
          </Row>
          <Row>
            <span>Username</span>
          </Row>
        </div>
      </Container>
    </>
  );
}
