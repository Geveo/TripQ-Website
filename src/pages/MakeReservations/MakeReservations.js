import React, { useState, useEffect } from "react";
import "./styles.scss";
import { Button } from "reactstrap";
import BookingDetails from "../../components/BookingDetails/index";
import BookedHotelDetails from "../../components/BookedHotelDetails/index";
import { Row, Col } from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import CustomerRegistration from "../../components/CustomerRegistration";
import BookedHotelPrice from "../../components/BookedHotelPrice";
import "../../styles/layout_styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { showPayQRWindow } from "../../services-common/xumm-api-service";
import { useSelector, useDispatch } from "react-redux";
import { add as selectionDetailsAdd} from "../../features/SelectionDetails/SelectionDetailsSlice";
import {LocalStorageKeys} from "./../../constants/constants";

//import Step2 from './Step2';
//import Step3 from './Step3';

const ReservationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [reservationDetails, setReservationDetails] = useState({});
  const [searchDetails, setSearchDetails] = useState({
    Name: "",
    Address: "",
    StarRate: 0,
    Facilities: [],
  });
  const [selectionStrings, setSelectionStrings] = useState({
    RoomId: 1,
    RoomCount: 2,
    costPerRoom: 50,
    roomName: "Deluxe",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(true);
  const loginState = useSelector((state) => state.loginState);

  useEffect(() => {
    let searchObj = {
      HotelId: 1,
      Name: "Dinuda Resort",
      Address: "Sethawadiya Road, 61360 Kalpitiya, Sri Lanka",
      StarRate: 3,
      Facilities: [2, 4, 5],
      CheckIn: "Sat 20 Apr 2024",
      CheckOut: "Sat 22 Apr 2024",
      Nights: 2,
      RoomTypeId: 1,
      RoomSize: "100sqft",
      NoOfRooms: 2,
      Price: 100,
    };
    dispatch(selectionDetailsAdd({key:localStorage.getItem(LocalStorageKeys.AccountAddress),value: searchObj}));
    setSearchDetails(searchObj);
  }, []);

  const handleNext = (data) => {
    setReservationDetails((prevDetails) => ({ ...prevDetails, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  const handleConfirm = (finalDetails) => {
    console.log("Reservation confirmed:", finalDetails);
  };

  // const submitForm = async () => {
  //   console.log("making payments..");
  //   const result = await showPayQRWindow(
  //     loginState.loggedInAddress,
  //     `raQLbdsGp4FXtesk5BSGBayBFJv4DESuaf`,
  //     "6",
  //     process.env.REACT_APP_CURRENCY,
  //     process.env.REACT_APP_CURRENCY_ISSUER
  //   );
  //   console.log(result);
  // };

  return (
    <>
      <MainContainer>
        <Row>
          <Col md={4}>
            <BookingDetails
              checkindate={searchDetails.CheckIn}
              checkoutdate={searchDetails.CheckOut}
              noOfDays={searchDetails.Nights}
              selections={JSON.stringify(selectionStrings)}
            />
            <BookedHotelPrice totalPrice={searchDetails.Price} />
          </Col>

          <Col md={8}>
            <BookedHotelDetails
              hotelName={searchDetails.Name}
              hotelAddress={searchDetails.Address}
              starRate={searchDetails.StarRate}
            />
            <CustomerRegistration
              //createReservation={submitForm}
              disableConfirm={disableConfirm}
              setDisableConfirm={setDisableConfirm}
              confirmLoading={confirmLoading}
              setConfirmLoading={setConfirmLoading}
            />
          </Col>
        </Row>
      </MainContainer>
    </>
  );
};

export default ReservationForm;
