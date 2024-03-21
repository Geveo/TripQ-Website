import { Row, Col, Card } from "reactstrap";
import styles from "./index.module.scss";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LocalStorageKeys } from "../../constants/constants";

const BookHotelRoom = (props) => {
  const [selectedRoomDetails, setSelectedRoomDetails] = useState([]);
  const selectionDetails = useSelector((state) => state.selectionDetails);

  useEffect(() => {
    let selectedDetails =
      selectionDetails[localStorage.getItem(LocalStorageKeys.AccountAddress)];

    if (!selectedDetails) {
      selectedDetails = JSON.parse(
        localStorage.getItem(LocalStorageKeys.HotelSelectionDetails)
      );
    }

    setSelectedRoomDetails(selectedDetails.RoomTypes);
    console.log("selection details:", selectedDetails);
    if (
      selectedDetails &&
      selectedDetails.RoomTypes &&
      selectedDetails.RoomTypes.length > 0
    ) {
      setSelectedRoomDetails(selectedDetails.RoomTypes);
      let totalPrice = 0;
      selectedDetails.RoomTypes.forEach((element) => {
        totalPrice += (parseFloat(element.roomData.Price) * parseInt(element.count))*parseInt(selectedDetails.Nights);
      });
    }
  }, []);
  return (
    <div>
      <Card className={styles.bookingDetailCard}>
        <h2>Your booking details</h2>
        <br />
        <Row>
          <Col md={6}>
            <div>
              <p className="fontBold">Check-in</p>
              <p>{props.checkindate}</p>
              <small className={styles.checkinoutTime}>Before noon</small>
            </div>
          </Col>
          <Col md={6}>
            <div>
              <p className="fontBold">Check-out</p>
              <p>{props.checkoutdate}</p>
              <small className={styles.checkinoutTime}>After noon</small>
              <br />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div style={{ marginTop: "20px" }}>
              <p className="fontBold">Total days of stay</p>
              <p>{`${props.noOfDays} nights, ${props.noOfDays + 1} days`}</p>
            </div>
          </Col>
        </Row>
        <Col>
          <div style={{ marginTop: "20px" }}>
            <p className="fontBold">Selected room details</p>
            {selectedRoomDetails.map((roomType, index) => (
              <p
                key={index}
              >{`${roomType.roomData.RoomName} - ${roomType.count} rooms`}</p>
            ))}
          </div>
        </Col>
        <hr />
      </Card>
    </div>
  );
};

export default BookHotelRoom;
