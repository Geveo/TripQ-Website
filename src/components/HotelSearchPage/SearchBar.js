import { Input, Row, Col, InputGroup, Button } from "reactstrap";
import React, { useState } from "react";
import { FaCalendarAlt, FaCity, FaUsers } from "react-icons/fa";
import "./styles.scss";
import { RangeDatePicker } from "@y0c/react-datepicker";
import SearchFacilities from "../HotelSearchPage/SearchFacilities";
import { AzureOpenaiService } from "../../services-common/azure-openai-service";
import toast from "react-hot-toast";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar(props) {
  const openAiService = AzureOpenaiService.getInstance();

  const [dateRange, setDateRange] = useState([]);
  const [isDirty, setIsDirty] = useState(true);
  const [guests, setGuests] = useState(props.numOfPeople);
  const [displayCity, setDisplayCity] = useState(props.city);
  const [city, setCity] = useState(props.city);
  const [checkInDate, setCheckInDate] = useState(props.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState(props.checkOutDate);
  const [facilities, setFacilities] = useState(props.facilities);
  const [facilitiesText, setFacilitiesText] = useState("");
  const [isFacilityValidating, setIsFacilityValidating] = useState(false);

  const onDateChange = (...args) => {
    setIsDirty(false);
    setDateRange(args);
    setDisplayCity(city);
  };

  const onSearchClick = () => {
    setDisplayCity(city);
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    props.setSearchCity(city);
    props.setGuestCount(guests);
    props.setFacilities(facilities);

    if (dateRange.length > 0) {
      props.setCheckInDate(new Date(dateRange[0]).toISOString().split("T")[0]);
      props.setCheckOutDate(new Date(dateRange[1]).toISOString().split("T")[0]);
    } else {
      props.setCheckInDate(checkInDate);
      props.setCheckOutDate(checkOutDate);
    }
    props.onClickSearch();
  };

  const onChangeCity = (event) => {
    setIsDirty(false);
    setCity(event.target.value);
    props.setSearchCity(event.target.value);
  };

  const onChangeGuestCount = (event) => {
    setIsDirty(false);
    setGuests(event.target.value);
    props.setGuestCount(event.target.value);
    setDisplayCity(city);
  };

  const onChangeAddFacility = (event) => {
    setIsDirty(false);
    setFacilitiesText(event.target.value);
    };

  const handleDelete = (namesToDelete) => {
    setIsDirty(false);
    setFacilities(namesToDelete);
  };

  const onAddFacilityClick = () => {
    setIsFacilityValidating(true);
    setFacilitiesText("");
    const promises = [openAiService.getHotelFacilities(facilitiesText)];

    Promise.all(promises)
      .then(([facilitiesResult]) => {
        let newFacilities = facilitiesResult.hotelFacilities;
        if (facilitiesResult.hotelFacilities.length > 0) {
          const mergedArray = [...new Set([...facilities, ...newFacilities])];

          setFacilities(mergedArray);
          setIsFacilityValidating(false);
        } else {
          setIsFacilityValidating(false);
          toast.error("Please mention your requirements clearly");
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };

  return (
    <section>
      <div className={"title_2"}>
        {props.hotelsData ? props.hotelsData.length : `No `} Hotels in{" "}
        {displayCity}
      </div>
      <div className={"subtext"} style={{ lineHeight: "15px" }}>
        Book your next stay at one of our properties
      </div>
      <div className={"row mt-4"}>
        <Row className="search-wrapper-row">
          <Col style={{ flex: "1 0" }}>
            <InputGroup>
              <Input
                placeholder="City"
                value={props.searchCity}
                onChange={(e) => onChangeCity(e)}
                style={{
                  position: "relative",
                  width: "250px",
                  height: "50px",
                  borderRadius: "0",
                }}
              />
              <FaCity
                size={22}
                className={"mt-2"}
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "8px",
                  transform: "translateY(-50%)",
                }}
                color={"#908F8F"}
              />
            </InputGroup>
          </Col>
          <Col style={{ flex: "0 0", position: "relative" }}>
            <InputGroup>
              <RangeDatePicker
                onChange={onDateChange}
                dateFormat="DD/MM/YYYY"
                startPlaceholder={checkInDate}
                endPlaceholder={checkOutDate}
                startText={checkInDate}
                endText={checkOutDate}
              />
              <FaCalendarAlt
                size={22}
                className={"mt-2"}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "8px",
                  transform: "translateY(-50%)",
                }}
                color={"#908F8F"}
              />
            </InputGroup>
          </Col>
          <Col style={{ flex: "1 0" }}>
            <InputGroup>
              <Input
                placeholder="0"
                type="number"
                value={guests}
                onChange={(e) => onChangeGuestCount(e)}
                style={{
                  position: "relative",
                  height: "50px",
                  borderRadius: "0",
                }}
              />
              <FaUsers
                size={22}
                className={"mt-2"}
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "8px",
                  transform: "translateY(-50%)",
                }}
                color={"#908F8F"}
              />
            </InputGroup>
          </Col>

          <Col>
            <div
              className={"col-md-1 col-sm-3 mb-3"}
              style={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-start",
                paddingLeft: "10px",
              }}
            >
              <Button
                className={"search_button"}
                style={{ width: "100px" }}
                onClick={onSearchClick}
                disabled={isDirty}
              >
                Search
              </Button>
            </div>
          </Col>
        </Row>
        <div className="facility_card">
          <Row>
            <Col md={7}>
              <Input
                placeholder="Type Facilities"
                value={facilitiesText}
                onChange={(e) => onChangeAddFacility(e)}
                style={{
                  height: "50px",
                  width: "100%",
                  marginTop: "30px",
                  borderRadius: "0",
                }}
              />
            </Col>
            <Col md={3}>
              <div
                style={{
                  width: "auto",
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingLeft: "10px",
                }}
              >
                <Button
                  className={"add_button"}
                  style={{ width: "100px" }}
                  disabled={facilitiesText.length <= 0}
                  onClick={onAddFacilityClick}
                >
                  Add
                </Button>
              </div>
            </Col>
            {isFacilityValidating && (
              <div
                className={"col"}
                style={{
                  paddingTop: "20px",
                  color: "#2c2c76",
                  paddingLeft: "22%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"
                    size="2x"
                  />
                  <span style={{ paddingLeft: "20px" }}>
                    Validating your input....
                  </span>
                </div>
              </div>
            )}
          </Row>
          <Row>
            <Col className={"facilities"}>
              <SearchFacilities
                facilityNames={facilities}
                handleDelete={handleDelete}
              />
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
