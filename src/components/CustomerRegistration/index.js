import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  Row,
  FormGroup,
  Label,
  Button,
  Input,
  FormFeedback,
} from "reactstrap";
import Card1 from "../../layout/Card";
import { useSelector, useDispatch } from "react-redux";
import XrplService from "../../services-common/xrpl-service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./styles.scss";
import { showPayQRWindow } from "../../services-common/xumm-api-service";
import { toast } from "react-hot-toast";
import ToastInnerElement from "../../components/ToastInnerElement/ToastInnerElement";
import { PaymentResults } from "../../constants/constants";
import { ReservationDto } from "../../dto/ReservationDto";
import { LocalStorageKeys, DestinationTags } from "../../constants/constants";
import HotelService from "./../../services-domain/hotel-service copy";
import { useNavigate } from "react-router-dom";
import { store } from "../../app/store";
import { setShowScreenLoader } from "../../features/screenLoader/ScreenLoaderSlice";

const CustomerRegistration = (props) => {
  const xrplService = XrplService.xrplInstance;
  const hotelService = HotelService.instance;

  const generatedSecretVisibility = useSelector(
    (state) => state.registerCustomer.generatedSecretVisibility
  );
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const loginState = useSelector((state) => state.loginState);

  const selectionDetails = useSelector((state) => state.selectionDetails);

  const dispatch = useDispatch();

  // disable confirm button logic
  useEffect(() => {
    if (firstName && lastName && email && phoneNo) {

      props.setDisableConfirm(false);
    } else {
      props.setDisableConfirm(true);
    }
  }, [firstName, lastName, email, phoneNo]);

  const validation = (body) => {
    // only when validate, body will pass
    if (firstName.length !== 0 && lastName.length !== 0 && email.length !== 0) {
      return true;
    }
    return false;
  };

  const registerCustomer = async (e) => {
    e.preventDefault();
    const body = {
      firstName,
      lastName,
      email,
      phoneNo,
    };

    if (firstName.length === 0) {
      setFirstNameInvalid(true);
    } else {
      setFirstNameInvalid(false);
    }
    if (lastName.length === 0) {
      setLastNameInvalid(true);
    } else {
      setLastNameInvalid(false);
    }
    if (email.length === 0) {
      setEmailInvalid(true);
    } else {
      setEmailInvalid(false);
    }

    if (validation(body)) {
    } else {
      props.setConfirmLoading(false);
      props.setDisableConfirm(false);
    }
    return;
  };
  const submitForm = async () => {
      let selectionData =
      selectionDetails[localStorage.getItem(LocalStorageKeys.AccountAddress)];

    if (!selectionData) {
      selectionData = JSON.parse(
        localStorage.getItem(LocalStorageKeys.HotelSelectionDetails)
      );
    }

    if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      phoneNo
    ) {
      const result = await showPayQRWindow(loginState.loggedInAddress, selectionData.HotelOwnerWalletAddress, props.totalPrice.toString(), DestinationTags.RESERVATION_PAYMENT, process.env.REACT_APP_CRYPTO_CURRENCY, process.env.REACT_APP_CURRENCY_ISSUER )
    
      console.log(result);
     if (result === PaymentResults.COMPLETED) {
        store.dispatch(setShowScreenLoader(true));

        let reservationData = new ReservationDto({
          HotelId: selectionData.HotelId,
          WalletAddress: localStorage.getItem(LocalStorageKeys.AccountAddress),
          Price: props.totalPrice,
          FromDate: selectionData.CheckIn,
          ToDate: selectionData.CheckOut,
          NoOfNights: selectionData.Nights,
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Telephone: phoneNo,
          RoomTypes: selectionData.RoomTypes,
          NoOfRooms: selectionData.NoOfRooms,
        });

        hotelService.makeReservation(reservationData).then((res) => {
          store.dispatch(setShowScreenLoader(false));
          if (res.rowId.lastId > 0) {
            toast.success("Reserved successfully!", {
              duration: 10000,
            });
            localStorage.removeItem(LocalStorageKeys.HotelSelectionDetails);
            navigate(`/my-reservations`);
          } else {
            toast(
              (element) => (
                <ToastInnerElement
                  message={"Registration failed!"}
                  id={element.id}
                />
              ),
              {
                duration: Infinity,
              }
            );
          }
        });
      }
    } else {
      store.dispatch(setShowScreenLoader(false));
      toast(
        (element) => (
          <ToastInnerElement
            message={"Check the details again!"}
            id={element.id}
          />
        ),
        {
          duration: Infinity,
        }
      );
    }
  };
  return (
    <Card1>
      <Form onSubmit={registerCustomer}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="firstName">
                First Name<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                invalid={firstNameInvalid}
              />
              <FormFeedback invalid={firstNameInvalid.toString()}>
                First name can not be empty
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="lastName">
                Last Name<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                invalid={lastNameInvalid}
              />
              <FormFeedback invalid={lastNameInvalid.toString()}>
                Last name can not be empty
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="email">
                E-Mail<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                invalid={emailInvalid}
              />
              <FormFeedback invalid={emailInvalid.toString()}>
                E-Mail can not be empty
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="phoneNo">
                Phone Number<span style={{ color: "red" }}>*</span>
              </Label>
              <PhoneInput
                country="lk"
                placeholder="Enter phone number"
                value={phoneNo}
                onChange={setPhoneNo}
                international={true}
                withCountryCallingCode={true}
              />
            </FormGroup>
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
          <Button
            className="secondaryButton"
            style={{ width: "180px" }}
            onClick={() => navigate(-1)}
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
            onClick={() => submitForm()}
            disabled={props.disableConfirm}
          >
            Continue To Payment
          </Button>
        </div>
          </Col>
        </Row>
    
      </Form>
    </Card1>
  );
};

export default CustomerRegistration;
