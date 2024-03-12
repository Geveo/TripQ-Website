import {useState} from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import LoginModal from "../Login/LoginModal";
import { useSelector, useDispatch } from "react-redux";
import {xummAuthorize, xummLogout} from "../../services-common/xumm-api-service";
import {Nav} from "react-bootstrap";

const isUnderConstruction = process.env.REACT_APP_IS_UNDER_CONSTRUCTION
? process.env.REACT_APP_IS_UNDER_CONSTRUCTION == 1
? true
: false
: false;
const underConstructionMsg = process.env.REACT_APP_UNDER_CONSTRUCTION_MESSAGE ?? "";

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
      console.log(e)
    }
  }

  const openLoginModal = () => {
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
  };

  const goToMyTransactionsPage = () => {
    navigate('/my-transactions');
  }

  const logout = async () => {
    await xummLogout();
    navigate('/')
  }

  return (
    <>
      <div>
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary cus_navbar">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{backgroundColor: '#fbb725'}} />
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
              <Button  variant="outline-warning" className={`list_button `}
                       onClick={() => navigate("/list-property")}
              >
                My Properties
              </Button>
              <Button variant="outline-warning" style={{  marginLeft: '5px'}} className={`list_button `}
                      onClick={() => navigate("/reservations")}
              >
                My Reservations
              </Button>

              <Button variant="outline-warning" style={{  marginLeft: '5px'}} className={`list_button `}
                      onClick={() => navigate("/make-reservations")}
              >
                Make Reservations
              </Button>

              {loginState.isLoggedIn ? (
                  <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggle}
                      direction={"down"}
                      style={{ border: 'solid 1px #fbb725',  borderRadius: '5px', backgroundColor: '#fbb725'}}

                  >
                    <DropdownToggle
                        className=""
                        style={{ height: "100%", backgroundColor: '#fbb725', color: '#2c2c76', border: 'none' }}
                    >
                      {`${loginState.loggedInAddress.slice(0,7)}...`}
                    </DropdownToggle>
                    <DropdownMenu style={{ marginTop: " 15px" }}>
                      <DropdownItem text className="address-text">
                        {loginState.loggedInAddress}
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => goToMyTransactionsPage()}>
                        My transactions
                      </DropdownItem>
                      <DropdownItem onClick={() => logout()}>
                        Log out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

              ) : (
                  <Button variant="outline-warning" style={{  marginLeft: '5px', width: '60px'}}
                          onClick={() => login()}
                  >
                    Login
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
