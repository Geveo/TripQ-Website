import React, { useState, useEffect } from "react";
import Step1 from "./Step1";
import MainContainer from "../../layout/MainContainer";
import Card1 from "../../layout/Card";
import { FaMapMarkerAlt } from "react-icons/fa";
import StarRating from "../../components/HotelHomePage/StarRating";
import "./styles.scss";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

//import Step2 from './Step2';
//import Step3 from './Step3';

const ReservationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [reservationDetails, setReservationDetails] = useState({});
  const [searchDetails, setSearchDetails] = useState({
    Name: "",
    Address: "",
    StarRate: 0,
    Facilities: [],
  });

  useEffect(() => {
    let searchObj = {
      Name: "Dinuda Resort",
      Address: "Sethawadiya Road, 61360 Kalpitiya, Sri Lanka",
      StarRate: 3,
      Facilities: [2, 4, 5],
      CheckIn: "Sat 20 Apr 2024",
      CheckOut: "Sat 22 Apr 2024",
      Nights: 2,
      RoomType: "Deluxe",
      RoomSize: "100sqft",
      NoOfRooms: 2,
      Price: 100,
    };
    setSearchDetails(searchObj);
  }, []);

  const handleNext = (data) => {
    setReservationDetails((prevDetails) => ({ ...prevDetails, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  const handleConfirm = (finalDetails) => {
    console.log("Reservation confirmed:", finalDetails);
  };

  return (
    <>
      <MainContainer>
        <div>
          <div className={"row"}>
            <div className={"title_1"} style={{ width: "80%" }}>
              {searchDetails.Name}
              <StarRating ratings={searchDetails.StarRate} />
            </div>
          </div>

          <div className={"row left_div"} style={{ marginTop: "-0.7rem" }}>
            <div style={{ width: "20px" }}>
              <FaMapMarkerAlt />
            </div>
            <div className={"subtext pt-2 col"}>{searchDetails.Address}</div>
          </div>
        </div>
        <div style={{ paddingTop: 30 }}>
          <div className="sub-title pt-2 pb-2">Your Booking Details</div>
          <Card1>
            <div style={{ display: "flex", paddingBottom: 20 }}>
              <div style={{ paddingRight: 400 }}>
                <div className={"sub-title"}>Check-in</div>
                <div className={"title_3"}>{searchDetails.CheckIn}</div>
              </div>
              <div style={{ paddingLeft: 400 }}>
                <div className={"sub-title"}>Check-out</div>
                <div className={"title_3"}>{searchDetails.CheckOut}</div>
              </div>
            </div>
            <div>
              <div className={"title_3"}>
                Total length of stay : {searchDetails.Nights} nights
              </div>
            </div>
          </Card1>
        </div>
        <div style={{ paddingTop: 30 }}>
          <div className="sub-title pt-2 pb-2">Room Selection</div>
          <Card1>
            <div style={{ display: "flex", paddingBottom: 20 }}>
              <div style={{ paddingRight: 400 }}>
                <div className={"sub-title"}>Room type</div>
                <div className={"title_3"}>{searchDetails.RoomType}</div>
              </div>
              <div style={{ paddingLeft: 400 }}>
                <div className={"sub-title"}>No of rooms</div>
                <div className={"title_3"}>{searchDetails.NoOfRooms}</div>
              </div>
            </div>
            <div>
              <div className={"sub-title"}>Room facilities : </div>
            </div>
          </Card1>
        </div>
        <div style={{ paddingTop: 30 }}>
          <div className="sub-title pt-2 pb-2">Price Information</div>
          <Card1>
            <div style={{ paddingBottom: 20 }}>
              <div style={{ paddingRight: 400 }}>
                <div className={"title_3"}>
                  Price : {searchDetails.Price} XAH
                </div>
                <div className={"title_3"}>
                  Service charge : {searchDetails.Price * 0.1} XAH
                </div>
                <div className={"sub-title"}>
                  Total Price :{" "}
                  {searchDetails.Price + searchDetails.Price * 0.1} XAH
                </div>
              </div>
            </div>
          </Card1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 45,
          }}
        >
          <div>
            <Button className="secondaryButton" style={{ width: "180px" }} onClick={() => navigate("/customer-details")}>
              Continue
            </Button>
          </div>
        </div>
      </MainContainer>
      <div>
        {/* {step === 1 && <Step1 searchDetails={searchDetails} onNext={handleNext} />} */}
        {/* {step === 2 && <Step2 selectedDates={reservationDetails.selectedDates} location={reservationDetails.location} onNext={handleNext} />}
    {step === 3 && <Step3 reservationDetails={reservationDetails} onConfirm={handleConfirm} />} */}
      </div>
    </>
  );
};

export default ReservationForm;
