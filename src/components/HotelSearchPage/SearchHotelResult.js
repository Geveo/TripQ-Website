import { FaMapMarkerAlt, FaMobile } from "react-icons/fa";
import StarRating from "../HotelHomePage/StarRating";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function SearchHotelResult({ hotel, numOfPeople, onViewAvailableClicked }) {
  const styles = {
    image: {
      width: "284px",
      height: "241px",
      objectFit: "cover",
      borderRadius: "5px",
    },
  };

  const location = hotel.Location;
  let address = "";

  if (location) {
    if (!location.AddressLine01 || !location.AddressLine02) {
      address = location;
    } else {
      address = `${location.AddressLine01}, ${location.AddressLine02}, ${location.City}`;
    }
  }

  return (
    <div className={"hotel_card mb-5"} style={{ width: "1000px" }}>
      <div className={"row_fit p-5"}>
        <img
          key={hotel.Id}
          src={
            hotel.ImageURL && hotel.ImageURL.length > 0
              ? hotel.ImageURL[0].ImageURL
              : "/Assets/Images/no_image.jpg"
          }
          alt={"Hotel image"}
          style={styles.image}
        />
        <div className={"col-md"} style={{ paddingLeft: "20px" }}>
          <div className={"title_2"} style={{ fontSize: "22px" }}>
            {hotel.Name}{" "}
            <StarRating ratings={hotel.StarRatings} reviews={726} />
          </div>

          {hotel.Location ? (
            <div className={"row_fit"}>
              <div style={{ width: "20px", paddingTop: "2px" }}>
                <FaMapMarkerAlt color={"#908F8F"} />
              </div>
              <div className={"col"} style={{ paddingTop: "4px" }}>
                {address}
              </div>
            </div>
          ) : null}

          {hotel.PhoneNumber ? (
            <div className={"row_fit"}>
              <div style={{ width: "20px", paddingTop: "2px" }}>
                <FaMobile color={"#908F8F"} />
              </div>
              <div className={"col"} style={{ paddingTop: "4px" }}>
                {hotel.PhoneNumber}
              </div>
            </div>
          ) : null}

          <div className={"row_fit"}>
            {hotel.Description ? (
              <div className={"col"} style={{ paddingTop: "4px" }}>
                {hotel.Description}
              </div>
            ) : (
              <div
                className={"col"}
                style={{
                  paddingTop: "4px",
                  color: "#2c2c76",
                  paddingTop: "12%",
                  paddingLeft: "22%",
                }}
              >
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"
                  size="2x"
                />
              </div>
            )}
          </div>

          {hotel.AvailableRooms.length > 0 || hotel.WebsiteURL ? (
            <div className={"pt-3 row_right"} style={{}}>
              <button
                className={"view_availability_button"}
                style={{ width: "200px" }}
                onClick={() => onViewAvailableClicked(hotel)}
              >
                View Availability
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SearchHotelResult;
