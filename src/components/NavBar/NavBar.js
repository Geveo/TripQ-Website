import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  xummAuthorize,
  xummLogout,
} from "../../services-common/xumm-api-service";
import { Nav } from "react-bootstrap";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isUnderConstruction = process.env.REACT_APP_IS_UNDER_CONSTRUCTION
  ? process.env.REACT_APP_IS_UNDER_CONSTRUCTION == 1
    ? true
    : false
  : false;
const underConstructionMsg =
  process.env.REACT_APP_UNDER_CONSTRUCTION_MESSAGE ?? "";

function NavBar(props) {
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.loginState);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const isCustomer = localStorage.getItem("customer");

  const login = async () => {
    try {
      await xummAuthorize();
    } catch (e) {
      console.log(e);
    }
  };

  const openLoginModal = () => {
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
  };

  const goToMyTransactionsPage = () => {
    navigate("/my-transactions");
  };

  const logout = async () => {
    await xummLogout();
    navigate("/");
  };

  return (
    <>
      <div>
        <Navbar
          collapseOnSelect
          expand="lg"
          className="bg-body-tertiary cus_navbar"
        >
          <Container>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              style={{ backgroundColor: "#fbb725" }}
            />
            <Navbar.Brand href="/">
              <img
                src="/Assets/Images/TripQ.png"
                width="200"
                height="70"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Navbar.Brand>
          </Container>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className={`ms-auto`}>
              <Button
                variant="outline-warning"
                className={`list_button `}
                onClick={() => navigate("/list-property")}
              >
                My Properties
              </Button>
              <Button
                variant="outline-warning"
                style={{ marginLeft: "5px" }}
                className={`list_button `}
                onClick={() => navigate("/my-reservations")}
              >
                My Reservations
              </Button>

              {/* <Button
                outline
                className="primaryButton smallMarginLeftRight"
                onClick={() => navigate(`/availability/${9}/${'2024-04-21'}/${'2024-04-23'}/${3}`)}
              >
                Make Reservations
              </Button> */}

              {loginState.isLoggedIn ? (
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  direction={"down"}
                >
                  <Button variant="outline-warning"
                  style={{ marginLeft: "5px" }}>
                  <DropdownToggle
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      outline: false,
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} size="lg" color="white" />
                  </DropdownToggle>
                  </Button>
                 

                  <DropdownMenu style={{ marginTop: " 15px" }}>
                    <DropdownItem text className="address-text">
                      {loginState.loggedInAddress}
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => goToMyTransactionsPage()}>
                      My account
                    </DropdownItem>
                    <DropdownItem onClick={() => logout()}>
                      Log out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Button
                  style={{ marginLeft: "5px",backgroundColor: "transparent",
                  border: "none", }}
                  onClick={() => login()}
                >
                  <FontAwesomeIcon icon={faUser} size="lg" color="white" />
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}

export default NavBar;
