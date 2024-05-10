import { Input, Row, Col, InputGroup } from "reactstrap";
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaCity, FaUsers } from "react-icons/fa";
import "./styles.scss";
import { RangeDatePicker } from "@y0c/react-datepicker";

function SearchBar(props) {
  const [dateRange, setDateRange] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [guests, setGuests] = useState(props.numOfPeople);
  const [displayCity, setDisplayCity] = useState(props.city);
  const [city, setCity] = useState(props.city);
  const [checkInDate, setCheckInDate] = useState(props.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState(props.checkOutDate);

  const onChangeBedRooms = (isAdding) => {
    props.setBedRooms((prevState) => {
      return (isAdding ? prevState + 1 : prevState - 1) >= 0
        ? isAdding
          ? prevState + 1
          : prevState - 1
        : 0;
    });
  };

  const onDateChange = (...args) => {
    setIsDirty(true);
    setDateRange(args)
    setDisplayCity(city)
  };

  const onChangeSearchText = (event) => {
    props.setSearchText(event.target.value);
  };

  const onSearchClick = () => {
    setDisplayCity(city);
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate)

    props.setSearchCity(city);
    props.setGuestCount(guests);
    if(dateRange.length>0){
      props.setCheckInDate(new Date(dateRange[0]).toISOString().split("T")[0]);
      props.setCheckOutDate(new Date(dateRange[1]).toISOString().split("T")[0]);
    }else{
      props.setCheckInDate(checkInDate);
      props.setCheckOutDate(checkOutDate);
    }
   
    props.onClickSearch(city, dateRange.length>0 ? new Date(dateRange[0]).toISOString().split("T")[0] : checkInDate, dateRange.length>0 ? new Date(dateRange[1]).toISOString().split("T")[0] : checkOutDate, guests);
  };

  const onChangeCity = (event) => {
    setIsDirty(true);
    setCity(event.target.value);
    props.setSearchCity(event.target.value);
  };

  const onChangeGuestCount = (event) => {
    setIsDirty(true);
    setGuests(event.target.value);
    props.setGuestCount(event.target.value);
    setDisplayCity(city)
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
                style={{ position: "relative", width: "250px", height: "50px",borderRadius: "0", }}
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
                style={{ position: "relative", height: "50px", borderRadius: "0" }}
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
                justifyContent: "flex-end",
                paddingLeft: "100px",
              }}
            >
              <button
                className={"search_button"}
                style={{ maxWidth: "100px", marginTop: "10px" }}
                onClick={onSearchClick}
              >
                <span className={"title_4"}>Search</span>
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default SearchBar;
