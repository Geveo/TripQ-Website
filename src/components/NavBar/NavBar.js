import {useState} from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import LoginModal from "../Login/LoginModal";
import { useSelector, useDispatch } from "react-redux";
import {xummAuthorize, xummLogout} from "../../services-common/xumm-api-service";

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
        <Navbar className="cus_navbar" dark>
          {isUnderConstruction ? (
            <div
              style={{
                marginBottom: "20px",
                marginLeft: "10%",
                minHeight: "35px",
                backgroundColor: "yellow",
                position: "fixed",
                width: "auto",
                paddingRight: "10%",
                paddingLeft: "10%",
                paddingTop: "5px",
                top: "-1px",
                zIndex: "99999",
                fontSize: "18px",
                color: "red",
                fontWeight: "500",
              }}
              classsName="under-construction-div"
            >
              {underConstructionMsg}
            </div>
          ) : (
            <></>
          )}
          <NavbarBrand href="/" style={{ marginLeft: "40px" }}>
            <img
              alt="logo"
              src="/Assets/Images/TripQ.png"
              style={{
                height: 70,
                width: 185,
              }}
            />
          </NavbarBrand>
          {isCustomer === "true" ? (
            <>
              <NavbarText className="explore_txt white-text">
                Explore
              </NavbarText>
              <NavbarText className="vacation_txt white-text">
                Vacation Rental
              </NavbarText>
              <NavbarText className="community_txt white-text">
                Community
              </NavbarText>{" "}
            </>
          ) : (
            <>
              <NavbarText className="help_button">Help</NavbarText>
              <NavbarText className="faq-text">FAQ</NavbarText>
            </>
          )}

          <Button
            outline
            className="primaryButton smallMarginLeftRight"
            onClick={() => navigate("/list-property")}
          >
            List Your Property
          </Button>
          {loginState.isLoggedIn ?
              <Button
                  outline
                  className="primaryButton smallMarginLeftRight"
                  onClick={() => navigate("/my-reservations")}
              >
            My Reservations
          </Button>
              :
              <></>}

          <Button
            outline
            className="primaryButton smallMarginLeftRight"
            onClick={() => navigate(`/availability/${5}`)}
          >
            Make Reservations
          </Button>

          {loginState.isLoggedIn ? (
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            direction={"down"}
            className="primaryButton setting-button"
          >
            <DropdownToggle
              className="primaryButton setting-button"
              style={{ height: "100%" }}
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
            <Button
              outline
              className="primaryButton smallMarginLeftRight"
              onClick={() => login()}
            >
              Login
            </Button>
          )}
          { loginOpen && <LoginModal isOpen={loginOpen} onClose={closeLoginModal} />} 
          {/* <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            direction={"down"}
            className="primaryButton setting-button"
          >
            <DropdownToggle
              className="primaryButton setting-button"
              style={{ height: "100%" }}
            >
              <RiFileSettingsFill style={{ fontSize: "1.5rem" }} />{" "}
            </DropdownToggle>
            <DropdownMenu style={{ marginTop: " 15px" }}>
              <DropdownItem text>
                <span className="wallet_address_title">Wallet Address: </span>
                <span className={"wallet_address"}>{walletAddress}</span>
                <span className={"copy_button"}>
                  <CopyToClipboard
                    text={walletAddress}
                    onCopy={() => setIsCopiedAddress(true)}
                  >
                    <FaCopy size={"20px"} />
                  </CopyToClipboard>
                </span>

                {isCopiedAddress ? (
                  <span className={"subtext"}>Copied</span>
                ) : null}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </Navbar>
      </div>
    </>
  );
}

export default NavBar;
