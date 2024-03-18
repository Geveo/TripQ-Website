import MainContainer from "../layout/MainContainer";
import "../components/HotelHomePage/StarRating";
import StarRating from "../components/HotelHomePage/StarRating";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import HotelImages from "../components/HotelHomePage/HotelImages";
import FacilitiesReadOnly from "../components/HotelHomePage/FacilitiesReadOnly";
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateRoomModal from "../components/HotelHomePage/CreateRoomModal";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import RoomTypesGrid from "../components/HotelHomePage/RoomTypesGrid";
import HotelService from "../services-domain/hotel-service copy";
import SharedStateService from "../services-domain/sharedState-service";
import { toast } from "react-hot-toast";
import ContractService from "../services-common/contract-service";
import { HotelDto } from "../dto/HotelDto";
import { LocalStorageKeys } from "../constants/constants";
import { store } from "./../app/store";
import { setShowScreenLoader } from "../features/screenLoader/ScreenLoaderSlice";
const { useDispatch } = require("react-redux");

function HotelHomePage() {
  const dispatch = useDispatch();
  const { idString } = useParams(); // hotel id
  const id = parseInt(isNaN(idString) ? "0" : idString, 10);
  const sharedInstance = SharedStateService.instance;
  const hotelService = HotelService.instance;
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState({
    Id: "",
    Name: "",
    Description: "",
    StarRate: 0,
    ContactDetails: "",
    Location: "",
    Facilities: "",
    ImageURLs: "",
    WalletAddress: "",
  });

  useEffect(() => {
    store.dispatch(setShowScreenLoader(true));
    getRoomTypes();
    const walletAddress = localStorage.getItem(LocalStorageKeys.AccountAddress);
    hotelService
      .getHotelsList(walletAddress)
      .then((data) => {
        if (data && data.length > 0) {
          const matchingHotel = data.filter((element) => element.id === id);
          if (matchingHotel.length > 0) {
            let selectedHotel = new HotelDto({
              Id: matchingHotel[0].id,
              Name: matchingHotel[0].name,
              Description: matchingHotel[0].description,
              StarRate: matchingHotel[0].starRate,
              ContactDetails: matchingHotel[0].contactDetails,
              Location: matchingHotel[0].location,
              Facilities: matchingHotel[0].facilities,
              ImageURLs: matchingHotel[0].imageUrls,
              WalletAddress: localStorage.getItem(
                LocalStorageKeys.AccountAddress
              ),
            });
            store.dispatch(setShowScreenLoader(false));
            setIsDataLoading(false);
            setHotelName(selectedHotel.Name);
            const location = JSON.parse(selectedHotel.Location);
            setAddress1(location.AddressLine01 ?? null);
            setAddress2(location.AddressLine02 ?? null);
            setCity(location.City);
            setSelectedHotel(selectedHotel);
            setDescription(matchingHotel[0].Description);

            let facilities = JSON.parse(matchingHotel[0].facilities);

            let selectedFacilitiesIDs = [];

            facilities.forEach((element) => {
              selectedFacilitiesIDs.push(element.Id);
            });
            setSelectedFacilityIds(selectedFacilitiesIDs);

            getRoomTypes(id)
              .then((rms) => {
                setRooms(rms);
              })
              .catch((e) => {
                console.log(e);
              })
              .finally(() => {
                store.dispatch(setShowScreenLoader(false));
              });
          } else {
            store.dispatch(setShowScreenLoader(false));
          }
        }
        // Get hotel images
        hotelService
          .getHotelImagesById(id)
          .then((data) => {
            if (data && data.length > 0) setImages(data);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error in fetching hotel images.");
          });
      })
      .catch((err) => {
        store.dispatch(setShowScreenLoader(false));
        console.log(err.thrownError);
        toast.error("Error in fetching hotels list.");
      });
  }, [id]);

  async function innnit() {
    await ContractService.instance.init();
  }

  const [images, setImages] = useState([]);
  const [hotelName, setHotelName] = useState(null);
  const [address1, setAddress1] = useState(null);
  const [address2, setAddress2] = useState(null);
  const [city, setCity] = useState(null);
  const [description, setDescription] = useState(null);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);

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

  const onSubmitRoom = async (room_data) => {
    room_data.HotelId = id;
    try {
      const res = await hotelService.createRoom(room_data);
      if (res > 0) {
        toast.success("Room type created successfully!", {
          duration: 10000,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setCreatingRoom(false);
      const res = await getRoomTypes(id);
      setRooms(res);
    }
  };

  // Load RoomType details
  async function getRoomTypes(hotelId) {
    const res = await hotelService.getHotelRoomTypes(hotelId);
    if (res && res.length > 0) {
      return res;
    } else {
      return [];
    }
  }

  const onDeleteRoom = async () => {
    // delete the room and call to get rooms again
    const res = await HotelService.instance.deleteMyRoom(deleteRoomDetails.Id);
    console.log(res);

    setDeleteRoomDetails(null);
    setDeletingRoom(false);
  };

  const onCloseDeleteRoomModal = () => {
    setDeletingRoom(false);
    setDeleteRoomDetails(null);
  };

  const onOpenDeleteRoomModal = (delete_room_details) => {
    setDeletingRoom(true);
    setDeleteRoomDetails(delete_room_details);
  };

  const getFullAddress = () => {
    let address = address1 ?? "";
    address += address2 ? `, ${address2}` : "";
    address += city ? `, ${city}` : "";

    return address;
  };

  return (
    <>
      <div className=" z-index: 1;">
        <Modal
          isOpen={creatingRoom}
          toggle={onCloseCreateRoomModal}
          size="lg"
          centered
          className={""}
          style={{ maxWidth: "850px", width: "100%" }}
        >
          <CreateRoomModal
            onSubmitRoom={onSubmitRoom}
            onClose={onCloseCreateRoomModal}
          />
        </Modal>
      </div>

      {deletingRoom && (
        <Modal isOpen={deletingRoom} toggle={onCloseDeleteRoomModal}>
          <ModalHeader toggle={onCloseDeleteRoomModal}>
            Delete Room "{deleteRoomDetails.Name}"
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete room named "{deleteRoomDetails.Name}
            " ?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onDeleteRoom}>
              Delete
            </Button>{" "}
            <Button color="secondary" onClick={onCloseDeleteRoomModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}

      <MainContainer>
        <>
          <section>
            <div className={"row"}>
              <div className={"title_1"} style={{ width: "80%" }}>
                {hotelName}
                <StarRating ratings={selectedHotel.StarRate} />
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
                  (activeTab === "house_rules"
                    ? "navigation_button_active"
                    : "")
                }
                onClick={onClickHouseRulesSectionButton}
              >
                House rules
              </button>
              <button
                className={
                  "navigation_button " +
                  (activeTab === "room_layout"
                    ? "navigation_button_active"
                    : "")
                }
                onClick={onClickRoomLayoutSectionButton}
              >
                Room Types
              </button>
            </div>
          </section>
          <section ref={infoSection} id="info_section" className={""}>
            <div>
              {images &&
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
          {/* <section ref={infoSection} id="info_section" className={"pt-2"}>
              <div
                className={"subtext"}
                style={{
                  lineHeight: "25px",
                  textAlign: "justify",
                  padding: "0 10px",
                }}
              >
                {description}
              </div>
            </section> */}

          <section ref={facilitiesSection} id="facilities" className={""}>
            <FacilitiesReadOnly
              facilitiesSection={facilitiesSection}
              selectedFacilityIds={selectedFacilityIds}
            />
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
              Boutique Hotel reserves the right to retain your credit card
              and/or debit card details, or forfeit your security deposit of
              MYR50.00 as presented at registration and charge or debit the
              credit/debit card such amounts as it shall, at its sole
              discretion, deem necessary to compensate or make good the cost or
              expenses incurred or suffered by Crest Wave Boutique Hotel as a
              result of the aforesaid. Should this damage come to light after
              the guest has departed, we reserve the right, and you hereby
              authorize us, to charge your credit or debit card for any damage
              incurred to your room or the Hotel property during your stay,
              including and without limitation for all property damage, missing
              or damaged items, smoking fee, cleaning fee, guest compensation,
              etc. We will make every effort to rectify any damage internally
              prior to contracting specialist to make the repairs, and therefore
              will make every effort to keep any costs that the guest would
              incur to a minimum.
              <br />
              <br />
              Damage to rooms, fixtures, furnishing and equipment including the
              removal of electronic equipment, towels, artwork, etc. will be
              charged at 150% of full and new replacement value plus any
              shipping and handling charges. Any damage to hotel property,
              whether accidental or wilful, is the responsibility of the
              registered guest for each particular room. Any costs associated
              with repairs and/or replacement will be charged to the credit card
              of the registered guest. In extreme cases, criminal charges will
              be pursued.
            </div>
          </section>

          <section id={"room_layout_section"} ref={roomLayoutSection}>
            <div className="title_2 pt-2 pb-2">Room Types</div>
            <div className={"subtext"}>Details about your rooms.</div>
            {rooms.length > 0 && (
              <RoomTypesGrid
                rooms={rooms}
                onOpenDeleteRoomModal={onOpenDeleteRoomModal}
              />
            )}

            <button
              className={"create_room_button mt-5"}
              style={{ width: "200px" }}
              onClick={onOpenCreateRoomModal}
            >
              <FaPlusCircle size={26} /> <span>&nbsp;Add Room Type</span>
            </button>
          </section>
        </>
      </MainContainer>
    </>
  );
}

export default HotelHomePage;
