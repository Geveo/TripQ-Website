import { Row, Col, Card, Badge } from "reactstrap";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import StarRating from "../../components/HotelHomePage/StarRating";
import React from "react";

const BookedHotelDetails = (props) => {
  return (
    <Card className={styles.bookedHotelCard}>
      <Row>
        {props.image && props.image.length > 0 && (
          <Col md={5}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                style={{ margin: "0 auto", width: 250, height: 150 }}
                src={props.image[0].ImageURL}
                alt={`Displayed Image`}
              />
            </div>
          </Col>
        )}
        <Col md={7}>
          <h3 className="fontBold">{props.hotelName}</h3>
          <p>{props.hotelAddress}</p>
          <Badge color="warning">4.5 Ratings</Badge>
          <StarRating ratings={props.starRate} />
          <div className={styles.facilities}>
            <FontAwesomeIcon
              icon={solid("square-parking")}
              className={styles.facilityIcon}
            />
            <span className={styles.FacilityText}>Parking</span>
            <FontAwesomeIcon
              icon={solid("wifi")}
              className={styles.facilityIcon}
            />
            <span>Free Wifi</span>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BookedHotelDetails;
