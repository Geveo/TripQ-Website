import {
  Col,
  Container,
  Row,
  List,
  InputGroup,
  Button,
  Input,
} from "reactstrap";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

function Footer(props) {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col>
            <h4>About Us</h4>
            <div
              className="image-container"
              onClick={() => {
                navigate("/");
                navigate(0);
              }}
            >
              <img
                src="/Assets/Images/TripQ.png"
                alt="tripQ"
                className="logo"
              />
            </div>
          </Col>
          <Col>
            <h4>Property Categories</h4>
            <List type="unstyled">
              <li>Hotels</li>
              <li>Apartmemnts</li>
              <li>Restaurants</li>
              <li>Villas</li>
              <li>Resorts</li>
            </List>
            <h4>Travel Categories</h4>
            <List type="unstyled">
              <li>Beaches</li>
              <li>Historicals</li>
              <li>Adventure</li>
              <li>City</li>
              <li>Romance</li>
            </List>
          </Col>
          <Col>
            <h4>Quick Links</h4>
            <List type="unstyled">
              <li>Offers</li>
              <li>Popular</li>
              <li>Vacation rentals</li>
              <li>Help</li>
            </List>
          </Col>
          <Col>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <h4>Newsletter</h4>
              <p>Save time, save money!</p>
              <InputGroup>
                <Input
                  type="text"
                  name="newsletter"
                  placeholder="Your email address"
                />
                <Button className="primaryButton">Subscribe</Button>
              </InputGroup>
              <h4 className="customer_support">Customer Support</h4>
              <p>+94 11 4443 333</p>

              <div className="powered_by">
                <h6> Powered by </h6>
                <h4 className="powered_by_text">
                  <a
                    href="https://everpower.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Everpower Labs
                  </a>
                </h4>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <hr />
        </Row>
        <Row>
          <Col className="text-center">
            Copyright 2024. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
