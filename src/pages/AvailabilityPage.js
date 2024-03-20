import MainContainer from "../layout/MainContainer";
import "../components/HotelHomePage/StarRating";
import StarRating from "../components/HotelHomePage/StarRating";
import { FaMapMarkerAlt, FaWallet } from "react-icons/fa";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AvailabilityRooms from "../components/AvailabiityRooms/AvailabilityRooms";
import DateFunctions from "../helpers/DateFunctions";
import HotelService from "../services-domain/hotel-service copy";
import { add as selectionDetailsAdd } from "../features/SelectionDetails/SelectionDetailsSlice";
import { LocalStorageKeys } from "../constants/constants";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { xummAuthorize } from "../services-common/xumm-api-service";

function AvailabilityPage() {
  const hotelService = HotelService.instance;
  const loginState = useSelector((state) => state.loginState);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();

  const { checkInDate } = useParams();
  const { checkOutDate } = useParams();

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const checkInFormatted = format(checkIn, "yyyy-MM-dd");
  const checkOutFormatted = format(checkOut, "yyyy-MM-dd");

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
    hotelService
      .getHotelById(id)
      .then((data) => {
        if (data) {
          let hotelData = {
            Id: data.hotelDetails[0].Id,
            Name: data.hotelDetails[0].Name,
            StarRating: data.hotelDetails[0].StarRatings,
            Location: data.hotelDetails[0].Location,
            ImageURLs: data.hotelImages,
            HotelOwnerWalletAddress: data.hotelDetails[0].WalletAddress,
            Description: data.hotelDetails[0].Description,
          };
          setHotelData(hotelData);

          setAddress1(JSON.parse(data.hotelDetails[0].Location).AddressLine01);
          setAddress2(JSON.parse(data.hotelDetails[0].Location).AddressLine02);
          setCity(JSON.parse(data.hotelDetails[0].Location).City);
          setImages(data.hotelImages);
        }

        // Get available room count
        hotelService
          .getAvailableRoomCount(id, checkInDate, checkOutDate)
          .then((res) => {
            let availableRoomCount = res;
            // Get room details
            hotelService
              .getHotelRoomTypes(id)
              .then(async (res) => {
                let newRoomTypes = [];
                let id = 0;
                for (const roomType of res) {
                  const resObj = await hotelService.getRoomTypeById(
                    roomType.Id
                  );

                  let facilitiesIds = [];

                  for (const facility of resObj.Facilities) {
                    facilitiesIds.push(facility.id);
                  }
                  newRoomTypes.push({
                    Id: roomType.Id,
                    RoomName: roomType.Code,
                    Price: roomType.Price,
                    RoomsCount: availableRoomCount.find(
                      (item) => item.Id == roomType.Id
                    ).RoomsCount,
                    SingleBedCount: availableRoomCount.find(
                      (item) => item.Id == roomType.Id
                    ).SingleBedCount,
                    DoubleBedCount: availableRoomCount.find(
                      (item) => item.Id == roomType.Id
                    ).DoubleBedCount,
                    TripleBedCount: availableRoomCount.find(
                      (item) => item.Id == roomType.Id
                    ).TripleBedCount,
                    TotalSleeps: availableRoomCount.find(
                      (item) => item.Id == roomType.Id
                    ).TotalSleeps,
                    Facilities: facilitiesIds,
                    SelectedRooms: 0,
                  });
                  id++;
                }
                setRoomTypes(newRoomTypes);
              })
              .catch((error) => {
                console.error("Error fetching room types:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching available rooms count:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching hotel details:", error);
      });
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

    //setCheckInCheckOutDates({ checkIn: checkInDate, checkOut: checkOutDate });
  };

  const getFullAddress = () => {
    let address = address1 ?? "";
    address += address2 ? `, ${address2}` : "";
    address += city ? `, ${city}` : "";

    return address;
  };

  const onReserve = async () => {
    if (!loginState.isLoggedIn) {
      await xummAuthorize();
    }
    let roomsCount = 0;
    const selectedRoomsArray = Object.values(selectedRooms);
    const checkIn = new Date(checkInFormatted);
    const checkOut = new Date(checkOutFormatted);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = checkOut - checkIn;

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    let selectedObj = {
      HotelId: id,
      Name: hotelData.Name,
      Address: getFullAddress(),
      StarRate: hotelData.StarRating,
      Images: hotelData.ImageURLs,
      CheckIn: checkInFormatted,
      CheckOut: checkOutFormatted,
      Nights: differenceInDays,
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
      console.log(roomId, values);

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

    console.log(result);

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
            <div className={"subtext pt-2 col"}>{hotelData.HotelOwnerWalletAddress}</div>
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
          <div>
            {images.length > 0 &&
              images.map((image, index) => (
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
