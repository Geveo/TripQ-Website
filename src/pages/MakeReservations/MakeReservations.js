import React, { useState, useEffect } from "react";
import "./styles.scss";
import BookingDetails from "../../components/BookingDetails/index";
import StripeCheckout from "../../components/Payment/StripeCheckout";
import CoingatePayment from "../../components/Payment/CGPayment";
import PaymentSelection from "../../components/Payment/PaymentSelection";
import BookedHotelDetails from "../../components/BookedHotelDetails/index";
import { Row, Col } from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import CustomerRegistration from "../../components/CustomerRegistration/CustomerRegistration";
import BookedHotelPrice from "../../components/BookedHotelPrice";
import "../../styles/layout_styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LocalStorageKeys } from "../../constants/constants";

const ReservationForm = () => {
  const selectionDetails = useSelector((state) => state.selectionDetails);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState([]);
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
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const loginState = useSelector((state) => state.loginState);

  useEffect(() => {
    let selectedDetails =
      selectionDetails[
        localStorage.getItem(LocalStorageKeys.HotelSelectionDetails)
      ];

    if (!selectedDetails) {
      selectedDetails = JSON.parse(
        localStorage.getItem(LocalStorageKeys.HotelSelectionDetails)
      );
    }
    if (
      selectedDetails &&
      selectedDetails.RoomTypes &&
      selectedDetails.RoomTypes.length > 0
    ) {
      setSelectedRoomDetails(selectedDetails.RoomTypes);
      let totalPrice = 0;
      selectedDetails.RoomTypes.forEach((element) => {
        totalPrice +=
          parseFloat(element.roomData.Price).toFixed(4) *
          element.count *
          parseInt(selectedDetails.Nights);
      });

      setTotalPrice(totalPrice);
    }

    setSearchDetails(selectedDetails);
  }, []);

  const handleConfirm = (finalDetails) => {
    console.log("Reservation confirmed:", finalDetails);
  };
  const handlePaymentEnabled = (data) => {
    setPaymentEnabled(data);
  };
  
  const handleBackToPayment = (data) => {
    setPaymentEnabled(data);
  };

  const handleSelectedGateway = (data) => {
    setSelectedGateway(data);
  };

  return (
    <>
      <MainContainer>
        <Row>
          <Col md={4}>
            <BookingDetails
              selectedRoomDetails={selectedRoomDetails}
              checkindate={searchDetails.CheckIn}
              checkoutdate={searchDetails.CheckOut}
              noOfDays={searchDetails.Nights}
              selections={JSON.stringify(selectionStrings)}
            />
            <BookedHotelPrice totalPrice={totalPrice} />
          </Col>

          <Col md={8}>
            <div>
            <BookedHotelDetails
                    hotelName={searchDetails.Name}
                    hotelAddress={searchDetails.Address}
                    starRate={searchDetails.StarRate}
                    image={searchDetails.Images} />

              {!paymentEnabled ? (
                <>
                  <CustomerRegistration
                    totalPrice={totalPrice}
                    disableConfirm={disableConfirm}
                    setDisableConfirm={setDisableConfirm}
                    confirmLoading={confirmLoading}
                    setConfirmLoading={setConfirmLoading}
                    setPaymentEnabled={handlePaymentEnabled} />
                </>
              ) : (
                <>
                  { selectedGateway == '' ? 
                    (
                      <PaymentSelection
                        //totalPrice={totalPrice}
                        setSelectedGateway={handleSelectedGateway} />
                    ) : selectedGateway == 'Stripe' ?
                      (
                        <StripeCheckout  totalPrice={totalPrice}/>
                      ) : selectedGateway == 'Coingate' ?
                        (
                        <CoingatePayment totalPrice={totalPrice}/>
                        ) : null
                  }
                </>
              )}
            </div>
          </Col>
        </Row>
      </MainContainer>
    </>
  );
};

export default ReservationForm;


/* { !paymentEnabled ?
                <>
                <BookedHotelDetails
                  hotelName={searchDetails.Name}
                  hotelAddress={searchDetails.Address}
                  starRate={searchDetails.StarRate}
                  image={searchDetails.Images} />
                  
                  <CustomerRegistration
                    totalPrice={totalPrice}
                    disableConfirm={disableConfirm}
                    setDisableConfirm={setDisableConfirm}
                    confirmLoading={confirmLoading}
                    setConfirmLoading={setConfirmLoading}
                    setPaymentEnabled={handlePaymentEnabled} />
                </>
                :
                <PaymentSelection 
                //totalPrice={totalPrice}
                setSelectedGateway={handleSelectedGateway}/>}
            </div>

            <div>
              {  selectedGateway == 'Stripe' ?
                <>
                 <StripePayment 
                totalPrice={totalPrice}
                setBackToPayment={handleBackToPayment}/>
                </>
                :
                <CoingatePayment/>}
            </div>
*/