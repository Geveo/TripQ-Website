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
import { format } from 'date-fns';


function AvailabilityPage() {
  const hotelService = HotelService.instance;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();

  const { checkInDate } = useParams();
  const { checkOutDate } = useParams();
  
const checkIn = new Date(checkInDate);
const checkOut = new Date(checkOutDate);

const checkInFormatted = format(checkIn, 'yyyy-MM-dd');
const checkOutFormatted = format(checkOut, 'yyyy-MM-dd');

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
            console.log("availableRoomCount",availableRoomCount)
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
                    RoomsCount: availableRoomCount.find(item => item.Id == roomType.Id).RoomsCount,
                    SingleBedCount: availableRoomCount.find(item => item.Id == roomType.Id).SingleBedCount,
			              DoubleBedCount: availableRoomCount.find(item => item.Id == roomType.Id).DoubleBedCount,
			              TripleBedCount: availableRoomCount.find(item => item.Id == roomType.Id).TripleBedCount,
			              TotalSleeps: availableRoomCount.find(item => item.Id == roomType.Id).TotalSleeps,
                    Facilities: facilitiesIds,
                    SelectedRooms: 0,
                  });
                  id++;
                }
                setRoomTypes(newRoomTypes);
                console.log("newRoomTypes",newRoomTypes)
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



  const onReserve = () => {
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
                (activeTab === "facilities" ? "navigation_button_active" : "")
              }
              onClick={onClickFacilitiesSectionButton}
            >
              Facilities
            </button>
            <button
              className={
                "navigation_button " +
                (activeTab === "house_rules" ? "navigation_button_active" : "")
              }
              onClick={onClickHouseRulesSectionButton}
            >
              House rules
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
        <section id={"house_rules_section"} ref={houseRulesSection}>
          <div className="title_2 pt-2 pb-2">House Rules</div>

          <div
            className={"subtext"}
            style={{ lineHeight: "25px", textAlign: "justify" }}
          >
            You are liable for any damage howsoever caused (whether by
            deliberate, negligent, or reckless act) to the room(s), hotel's
            premises or property caused by you or any person in your party,
            whether or not staying at the hotel during your stay. Crest Wave
            Boutique Hotel reserves the right to retain your credit card and/or
            debit card details, or forfeit your security deposit of MYR50.00 as
            presented at registration and charge or debit the credit/debit card
            such amounts as it shall, at its sole discretion, deem necessary to
            compensate or make good the cost or expenses incurred or suffered by
            Crest Wave Boutique Hotel as a result of the aforesaid. Should this
            damage come to light after the guest has departed, we reserve the
            right, and you hereby authorize us, to charge your credit or debit
            card for any damage incurred to your room or the Hotel property
            during your stay, including and without limitation for all property
            damage, missing or damaged items, smoking fee, cleaning fee, guest
            compensation, etc. We will make every effort to rectify any damage
            internally prior to contracting specialist to make the repairs, and
            therefore will make every effort to keep any costs that the guest
            would incur to a minimum.
            <br />
            <br />
            Damage to rooms, fixtures, furnishing and equipment including the
            removal of electronic equipment, towels, artwork, etc. will be
            charged at 150% of full and new replacement value plus any shipping
            and handling charges. Any damage to hotel property, whether
            accidental or wilful, is the responsibility of the registered guest
            for each particular room. Any costs associated with repairs and/or
            replacement will be charged to the credit card of the registered
            guest. In extreme cases, criminal charges will be pursued.
          </div>
        </section>
        {roomTypes.length > 0 && (
          <AvailabilityRooms
            roomData={roomTypes}
            onReserve={onReserve}
            selectedRooms={selectedRooms}
            reserveBtnDisabled={reserveBtnDisabled}
            onChangeSelectedRooms={onChangeSelectedRooms}
          />
        )}
      </>
    </MainContainer>
  );
}

export default AvailabilityPage;
