import MainContainer from "../layout/MainContainer";
import "../components/HotelHomePage/StarRating";
import StarRating from "../components/HotelHomePage/StarRating";
import { FaMapMarkerAlt, FaWallet } from "react-icons/fa";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AvailabilityRooms from "../components/AvailabiityRooms/AvailabilityRooms";
import DateFunctions from "../helpers/DateFunctions";
import HotelService from "../services-domain/hotel-service copy";
import { add as selectionDetailsAdd } from "../redux/SelectionDetails/SelectionDetailsSlice";
import { LocalStorageKeys } from "../constants/constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { xummAuthorize } from "../services-common/xumm-api-service";

function AvailabilityPage() {
  const loginState = useSelector((state) => state.loginState);
  let selectionDetails = useSelector((state) => state.selectionDetails.value);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();

  const { checkInDate } = useParams();
  const { checkOutDate } = useParams();
  const [images, setImages] = useState([]);
  const [address1, setAddress1] = useState("P.O Box 11");
  const [address2, setAddress2] = useState("Heritance Kandalama");
  const [city, setCity] = useState("Sigiriya");
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [reserveBtnDisabled, setReserveBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get hotel details
    if (!selectionDetails) {
      selectionDetails = localStorage.getItem(
        LocalStorageKeys.HotelSelectionDetails
      );
    }

    const hotelDetails = JSON.parse(selectionDetails);

    let hotelData = {
      Id: hotelDetails.Id,
      Name: hotelDetails.Name,
      StarRating: hotelDetails.StarRatings,
      Location: hotelDetails.Location.City,
      ImageURLs: hotelDetails.ImageURL,
      HotelOwnerWalletAddress: hotelDetails.WalletAddress,
      Description: hotelDetails.Description,
    };

    setHotelData(hotelData);
    setAddress1(hotelDetails.Location.AddressLine01);
    setAddress2(hotelDetails.Location.AddressLine02);
    setCity(hotelDetails.Location.City);
    setImages(Array.from(hotelDetails.ImageURL));

    let newRoomTypes = [];
    for (const roomIndex in hotelDetails.AvailableRooms) {
      let facilitiesIds = [];

      let roomType = hotelDetails.AvailableRooms[roomIndex];

      newRoomTypes.push({
        Id: roomType.RoomTypeId,
        RoomName: roomType.RoomTypeCode,
        Price: roomType.Price,
        RoomsCount: roomType.AvailableRooms,
        SingleBedCount: roomType.SingleBedCount,
        DoubleBedCount: roomType.DoubleBedCount,
        TripleBedCount: roomType.TripleBedCount,
        TotalSleeps: roomType.TotalSleepCapacity,
        Facilities: facilitiesIds,
        SelectedRooms: 0,
      });
    }

    setRoomTypes(newRoomTypes);
  }, [id]);

  const onChangeSelectedRooms = (room, isAdding) => {
    setSelectedRooms((prevState) => {
      let newState = { ...prevState };
      if (!(room.Id in newState))
        newState[room.Id] = { roomData: room, count: 0 };

      newState[room.Id].count = isAdding
        ? newState[room.Id].count + 1
        : newState[room.Id].count - 1;
      if (newState[room.Id].count < 0) newState[room.Id].count = 0;
      else if (newState[room.Id].count > room.RoomsCount)
        newState[room.Id].count = room.RoomsCount;

      // For disabling the reserve button
      let countTotal = 0;
      for (const kk in newState) {
        countTotal += newState[kk].count;
      }
      if (countTotal > 0) setReserveBtnDisabled(false);
      else setReserveBtnDisabled(true);

      return newState;
    });
  };

  const infoSection = useRef(null);
  const facilitiesSection = useRef(null);
  const houseRulesSection = useRef(null);
  const roomLayoutSection = useRef(null);
  const aboutUsSection = useRef(null);

  const [rooms, setRooms] = useState([]);

  const [activeTab, setActiveTab] = useState(null);
  const onClickInfoSectionButton = () => {
    setActiveTab("info");
    infoSection.current.scrollIntoView({ behavior: "smooth" });
  };

  const onClickFacilitiesSectionButton = () => {
    setActiveTab("facilities");
    facilitiesSection.current.scrollIntoView({ behavior: "smooth" });
  };

  const onClickHouseRulesSectionButton = () => {
    setActiveTab("house_rules");
    houseRulesSection.current.scrollIntoView({ behavior: "smooth" });
  };

  const onClickAboutUsSectionButton = () => {
    setActiveTab("about_us");
    aboutUsSection.current.scrollIntoView({ behavior: "smooth" });
  };

  const onClickRoomLayoutSectionButton = () => {
    setActiveTab("room_layout");
    roomLayoutSection.current.scrollIntoView({ behavior: "smooth" });
  };
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [deleteRoomDetails, setDeleteRoomDetails] = useState(null);

  const onCloseCreateRoomModal = () => {
    setCreatingRoom(false);
  };

  const onOpenCreateRoomModal = () => {
    setCreatingRoom(true);
  };

  const onChangeCheckInCheckOutDates = (checkIn, checkOut) => {
    let checkInDate = DateFunctions.convertDateObjectToDateOnlyString(
      new Date(checkIn)
    );
    let checkOutDate = DateFunctions.convertDateObjectToDateOnlyString(
      new Date(checkOut)
    );
  };

  const getFullAddress = () => {
    let address = address1 ?? "";
    address += address2 ? ` ${address2}` : "";
    address += city ? ` ${city}` : "";

    return address;
  };

  const onReserve = async () => {
     if (!loginState.isLoggedIn) {
       await xummAuthorize();
     }
    let roomsCount = 0;
    const selectedRoomsArray = Object.values(selectedRooms);

    const dateParts1 = checkInDate.split("-");
    const dateParts2 = checkOutDate.split("-");
    const date1 = new Date(dateParts1[0], dateParts1[1] - 1, dateParts1[2]);
    const date2 = new Date(dateParts2[0], dateParts2[1] - 1, dateParts2[2]);

    const differenceMs = Math.abs(date2 - date1);

    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    let selectedObj = {
      HotelId: id,
      Name: hotelData.Name,
      Address: getFullAddress(),
      StarRate: hotelData.StarRating,
      Images: hotelData.ImageURLs,
      CheckIn: checkInDate,
      CheckOut: checkOutDate,
      Nights: differenceDays,
      RoomTypes: selectedRoomsArray,
      HotelOwnerWalletAddress: hotelData.HotelOwnerWalletAddress,
    };

    dispatch(
      selectionDetailsAdd({
        key: localStorage.getItem(LocalStorageKeys.AccountAddress),
        value: selectedObj,
      })
    );

    localStorage.setItem(
      LocalStorageKeys.HotelSelectionDetails,
      JSON.stringify(selectedObj)
    );

    let selectedRoomList = [];
    for (const [roomId, values] of Object.entries(selectedRooms)) {
      if (values.count === 0) continue;

      let temp = {
        roomId: roomId,
        roomName: values.roomData.RoomName,
        roomCount: values.count,
        costPerRoom: values.roomData.PricePerNight,
      };

      selectedRoomList.push(temp);
    }
    let result = { selections: selectedRoomList };

    navigate("/make-reservations");
  };

  return (
    <MainContainer>
      <>
        <section>
          <div className={"row"}>
            <div className={"title_1"} style={{ width: "80%" }}>
              {hotelData.Name}
              <StarRating ratings={hotelData.StarRating} />
            </div>
          </div>

          <div className={"row left_div"} style={{ marginTop: "-0.7rem" }}>
            <div style={{ width: "20px" }}>
              <FaMapMarkerAlt />
            </div>
            <div className={"subtext pt-2 col"}>{getFullAddress()}</div>
          </div>
          <div className={"row left_div"} style={{ marginTop: "-0.7rem" }}>
            <div style={{ width: "20px" }}>
              <FaWallet />
            </div>
            <div className={"subtext pt-2 col"}>
              {hotelData.HotelOwnerWalletAddress}
            </div>
          </div>

          <div className={"pt-4 pb-4 center_div"}>
            <button
              className={
                "navigation_button " +
                (activeTab === "info" ? "navigation_button_active" : "")
              }
              onClick={onClickInfoSectionButton}
            >
              Images
            </button>
            <button
              className={
                "navigation_button " +
                (activeTab === "about_us" ? "navigation_button_active" : "")
              }
              onClick={onClickHouseRulesSectionButton}
            >
              About Us
            </button>
            <button
              className={
                "navigation_button " +
                (activeTab === "house_rules" ? "navigation_button_active" : "")
              }
              onClick={onClickHouseRulesSectionButton}
            >
              House Rules
            </button>
            <button
              className={
                "navigation_button " +
                (activeTab === "room_layout" ? "navigation_button_active" : "")
              }
              onClick={onClickRoomLayoutSectionButton}
            >
              Room Types
            </button>
          </div>
        </section>
        <section ref={infoSection} id="info_section" className={"pt-2"}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            {images.length > 0 &&
              images.slice(0,3).map((image, index) => (
                <img
                  key={index}
                  style={{ margin: 10, width: 350, height: 250 }}
                  src={image.ImageURL}
                  alt={`Displayed Image ${index}`}
                />
              ))}
          </div>
        </section>
        {hotelData.Description && (
          <section id={"house_rules_section"} ref={houseRulesSection}>
            <div className="title_2 pt-2 pb-2">About As</div>

            <div
              className={"subtext"}
              style={{ lineHeight: "25px", textAlign: "justify" }}
            >
              <br />
              {hotelData.Description}
            </div>
          </section>
        )}
        <section id={"house_rules_section"} ref={houseRulesSection}>
          <div className="title_2 pt-2 pb-2">House Rules</div>

          <div
            className={"subtext"}
            style={{ lineHeight: "25px", textAlign: "justify" }}
          >
            To ensure a pleasant and safe stay for all guests, please abide by
            the following rules:
            <br />
            <br />
            check-in and check-out times, presentation of valid identification,
            prompt settlement of charges, adherence to our smoke-free policy,
            respect for noise levels and privacy, prohibition of pets (except
            service animals), accountability for damages, vigilance in safety
            and security, personal responsibility for lost items, and courteous
            conduct towards others. Any disruptive behavior may result in
            immediate eviction without refund. Thank you for choosing TripQ for
            your accommodation needs; we're here to make your stay enjoyable and
            comfortable.
          </div>
        </section>
        <section id={"roomLayout_section"} ref={roomLayoutSection}>
          <div className="title_2 pt-2 pb-2">Room Types</div>

          {roomTypes.length > 0 && (
            <AvailabilityRooms
              roomData={roomTypes}
              onReserve={onReserve}
              selectedRooms={selectedRooms}
              reserveBtnDisabled={reserveBtnDisabled}
              onChangeSelectedRooms={onChangeSelectedRooms}
            />
          )}
        </section>
      </>
    </MainContainer>
  );
}

export default AvailabilityPage;
