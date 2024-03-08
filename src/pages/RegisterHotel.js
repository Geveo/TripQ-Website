import MainContainer from "../layout/MainContainer";
import Card1 from "../layout/Card";
import "../styles/text_styles.scss";
import "../styles/layout_styles.scss";
import React, { useState, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Button,
  Col,
  Row,
  FormFeedback,
  Spinner,
} from "reactstrap";
import Facilities from "../components/RegisterHotelComponents/Facilities";
import ContactDetails from "../components/RegisterHotelComponents/ContactDetails";
import PropertyPhotos from "../components/RegisterHotelComponents/PropertyPhotos";
import HotelService from "./../services-domain/hotel-service copy";
import { FirebaseService } from "../services-common/firebase-service";
import { useNavigate } from "react-router-dom";
import ImagePreviewSection from "../components/RegisterHotelComponents/ImagePreviewSection";
import { toast } from "react-hot-toast";
import ToastInnerElement from "../components/ToastInnerElement/ToastInnerElement";
import { HotelDto } from "../dto/HotelDto";
import { ContactDetailsDto } from "../dto/ContactDetailsDto";
import { LocationDetailsDto } from "../dto/LocationDto";
const { useSelector } = require("react-redux");

function RegisterHotel() {
  const hotelService = HotelService.instance;
  let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  let phoneNoRegex = new RegExp("^[0-9 ]*$");
  const navigate = useNavigate();

  let user = "User";
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [registerButtonDisable, setRegisterButtonDisable] = useState(false);

  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [StarRate, setStarRate] = useState("");
  const [OwnerName, setOwnerName] = useState("");
  const [Email, setEmail] = useState("");
  const [AddressLine1, setaddressLine1] = useState("");
  const [AddressLine2, setaddressLine2] = useState("");
  const [City, setCity] = useState("");
  const [ContactNumber1, setContactNumber1] = useState("");
  const [ContactNumber2, setContactNumber2] = useState("");
  const [DistanceFromCenter, setDistanceFromCenter] = useState(0);

  const [HotelFacilities, setHotelFacilities] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [isCondition1Checked, setIsCondition1Checked] = useState(false);
  const [isCondition2Checked, setIsCondition2Checked] = useState(false);

  const [propertyNameInvaid, setPropertyNameInvaid] = useState(false);
  const [propertyDescriptionInvaid, setPropertyDescriptionInvaid] =
    useState(false);
  const [ownerNameInvaid, setOwnerNameInvaid] = useState(false);
  const [emailInvaid, setEmailInvaid] = useState(false);
  const [contactNumber1Invaid, setContactNumber1Invaid] = useState(false);
  const [addressLine1Invaid, setAddressLine1Invaid] = useState(false);
  const [cityInvaid, setCityInvaid] = useState(false);
  const [distanceFromCenterInvaid, setDistanceFromCenterInvaid] =
    useState(false);
  const [hotelFacilitiesInvaid, setHotelFacilitiesInvaid] = useState(false);
  const [uploadedImagesInvaid, setUploadedImagesInvaid] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const [ownerWalletAddress, setOwnerWalletAddress] = useState(
    "rsDEfCNEYbjGEje2fgqP1rRPVD7bmhih15"
  );
  const [isTransactionFound, setIsTransactionfound] = useState(false);
  const listenedTransactions = useSelector(
    (state) => state.listenedTransactions
  );
  const [isTransactionDone, setIsTransactionDone] = useState(false);
  const [isinputFieldsValidated, setIsinputFieldsValidated] = useState(false);
  const [hotelData, setHotelData] = useState({
    Id: "",
    Name: "",
    Description: "",
    StarRate: 0,
    ContactDetails: "",
    Location: "",
    Facilities: [],
    ImageURLs: [],
    WalletAddress: "",
  });

  const contractWalletAddress = process.env.REACT_APP_CONTRACT_WALLET_ADDRESS;
  const hotelRegiFee = process.env.REACT_APP_HOTEL_REGISTRATION_FEE;

  const handleScanSuccess = (decodedText) => {
    setScannedText(decodedText);
    setShowQRModal(false);
    setShowQRScanner(false);

    if (decodedText !== "") {
      setOwnerWalletAddress((prevOwnerWalletAddress) => decodedText);
    }
  };

  const toggleDropDown = () => {
    setDropDownOpen((prevState) => !prevState);
  };

  const onChangeUploadImages = (images) => {
    setUploadedImages((prevState) => [...prevState, ...images]);
  };

  const validationForm = () => {
    setPropertyNameInvaid(false);
    setPropertyDescriptionInvaid(false);
    setOwnerNameInvaid(false);
    setEmailInvaid(false);
    setContactNumber1Invaid(false);
    setAddressLine1Invaid(false);
    setCityInvaid(false);
    setDistanceFromCenterInvaid(false);
    setHotelFacilitiesInvaid(false);
    setUploadedImagesInvaid(false);

    if (!Name) {
      setPropertyNameInvaid(true);
    }
    if (!Description) {
      setPropertyDescriptionInvaid(true);
    }
    if (!OwnerName) {
      setOwnerNameInvaid(true);
    }
    if (!emailRegex.test(Email)) {
      setEmailInvaid(true);
    }

    if (!phoneNoRegex.test(ContactNumber1)) {
      setContactNumber1Invaid(true);
    }

    if (!(ContactNumber1.length === 10 || ContactNumber1.length === 11)) {
      setContactNumber1Invaid(true);
    }
    if (!AddressLine1) {
      setAddressLine1Invaid(true);
    }
    if (!City) {
      setCityInvaid(true);
    }
    if (!DistanceFromCenter) {
      setDistanceFromCenterInvaid(true);
    }

    if (HotelFacilities.length <= 0) {
      setHotelFacilitiesInvaid(true);
    }
    if (uploadedImages.length < 3) {
      setUploadedImagesInvaid(true);
    }
  };

  // Form submit
  const submitForm = async () => {
    setIsDataLoading(true);
    setRegisterButtonDisable(true);

    validationForm();

    if (!propertyNameInvaid) {
      console.log("submit");
    }

    try {
      // Upload Images
      if (uploadedImages.length > 0) {
        const urls = await FirebaseService.uploadFiles(Name, uploadedImages);

        if (urls.length > 0) {
          // Create request object
          let contactDetails = new ContactDetailsDto({
            FullName: OwnerName,
            Email: Email,
            PhoneNumber: ContactNumber1,
            AlternativePhoneNumber: ContactNumber2,
          });

          let locationDto = new LocationDetailsDto({
            AddressLine01: AddressLine1,
            AddressLine02: AddressLine2,
            City: City,
            DistanceFromCity: DistanceFromCenter,
          });

          let hotelData = new HotelDto({
            Id: 0,
            Name: Name,
            Description: Description,
            StarRate: parseInt(StarRate[0], 10),
            ContactDetails: JSON.stringify(contactDetails),
            Location: JSON.stringify(locationDto),
            Facilities: JSON.stringify(HotelFacilities),
            ImageURLs: urls,
            WalletAddress: localStorage.getItem("Account"),
          });
          setHotelData(hotelData);
          // only if the required validations are met, form will submit
          if (
            Name &&
            OwnerName &&
            emailRegex.test(Email) &&
            AddressLine1 &&
            City &&
            (ContactNumber1.length === 10 || ContactNumber1.length === 11) &&
            phoneNoRegex.test(ContactNumber1) &&
            DistanceFromCenter &&
            HotelFacilities.length > 0 &&
            uploadedImages.length > 2
          ) {
            setIsDataLoading(false);
            hotelService.registerHotel(hotelData).then((res) => {

              if (res.rowId.lastId > 0) {
                toast.success("Registered successfully!", {
                  duration: 10000,
                });
                navigate(`/hotel/${res.rowId.lastId}`);
              } else {
                toast(
                  (element) => (
                    <ToastInnerElement
                      message={"Registration failed!"}
                      id={element.id}
                    />
                  ),
                  {
                    duration: Infinity,
                  }
                );
              }
            });
          } else {
            setIsDataLoading(false);
            setRegisterButtonDisable(false);
            toast(
              (element) => (
                <ToastInnerElement
                  message={"Check the details again!"}
                  id={element.id}
                />
              ),
              {
                duration: Infinity,
              }
            );
          }
        }
      }
    } catch (err) {
      setIsDataLoading(false);
      setRegisterButtonDisable(false);
      console.log(err);
      toast(
        (element) => (
          <ToastInnerElement
            message={"Error occurred in Registration.!"}
            id={element.id}
          />
        ),
        {
          duration: Infinity,
        }
      );
    }
  };

  const openQRScanner = () => {
    setScannedText("");
    setShowQRScanner(true);
  };

  // async function onProceedToPayment() {
  //   await init();
  //   await listenToTransactionsByAddress(contractWalletAddress, {
  //     account: ownerWalletAddress,
  //   });

  //   //setShowQRModal(true);
  // }

  // async function onCloseQRModel() {
  //   setShowQRModal(false);
  //   await stopListeningToTransactionsByAddress(ownerWalletAddress);
  //   await deinit();
  // }

  // useEffect(() => {
  //   let tmId = 0;
  //   const checkTransactions = () => {
  //     if (listenedTransactions.hasOwnProperty(contractWalletAddress)) {
  //       const transactionFound = listenedTransactions[
  //         contractWalletAddress
  //       ].filter((transaction) => transaction.Account === ownerWalletAddress);

  //       if (
  //         transactionFound.length > 0 &&
  //         transactionFound[transactionFound.length - 1].Account ===
  //           scannedText &&
  //         parseFloat(transactionFound[transactionFound.length - 1].Amount) >=
  //           hotelRegiFee
  //       ) {
  //         setIsTransactionfound(true);
  //         setShowQRModal(false);
  //         setIsTransactionDone(true);

  //         stopListeningToTransactionsByAddress(contractWalletAddress);
  //         sendHotelRegistrationRequest();
  //         deinit();
  //         clearTimeout(tmId);
  //       } else {
  //         clearTimeout(tmId);
  //         tmId = setTimeout(checkTransactions, 1000);
  //       }
  //     }
  //   };

  //   if (!isTransactionFound) {
  //     checkTransactions();
  //   }

  //   return () => {
  //     clearTimeout(tmId);
  //   };
  // }, [listenedTransactions, isTransactionFound]);

  return (
    <>
      {/* {showQRModal && (
        <TransactionQRModal
          isOpen={showQRModal}
          qrMessage={contractWalletAddress}
          onClose={onCloseQRModel}
        />
      )} */}
      <MainContainer>
        {isDataLoading && (
          <div className="spinnerWrapper">
            <Spinner
              color="primary"
              style={{
                height: "3rem",
                width: "3rem",
              }}
              type="grow"
            >
              Loading...
            </Spinner>
          </div>
        )}
        <section>
          <div className="title_1">Welcome to VoyageLanka!</div>
          <Card1>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="property_name" className="noMargin">
                    Name of Your Property<span style={{ color: "red" }}>*</span>
                  </Label>

                  <div className="subtext">
                    Guests will see this name when they search for a place to
                    stay.
                  </div>
                  <Input
                    type="text"
                    id="property_name"
                    onChange={(e) => setName(e.target.value)}
                    invalid={propertyNameInvaid}
                  />
                  <FormFeedback>
                    Name of your property is required!
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <Label className="noMargin"> Star Rating</Label>
                <div className="subtext">Current rating of the hotel.</div>
                <div>
                  <Dropdown isOpen={dropDownOpen} toggle={toggleDropDown} group>
                    <button style={{ width: "100px", border: "none" }}>
                      {StarRate || "Select"}
                    </button>
                    <DropdownToggle caret color={"black"}></DropdownToggle>
                    <DropdownMenu style={{ width: "50%" }}>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("1 Star")}
                      >
                        1 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("2 Star")}
                      >
                        2 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("3 Star")}
                      >
                        3 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("4 Star")}
                      >
                        4 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("5 Star")}
                      >
                        5 Star
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
            <FormGroup>
              <Label style={{ marginTop: "10px" }}>Description</Label>
              <Input
                type="textarea"
                className={"text_area"}
                name="postContent"
                rows={5}
                invalid={propertyDescriptionInvaid}
                onChange={(e) => setDescription(e.target.value)}
              />
              {/* <FormFeedback>Hotel description is required!</FormFeedback> */}
            </FormGroup>
          </Card1>
        </section>

        <ContactDetails
          setOwnerName={setOwnerName}
          setEmail={setEmail}
          setContactNumber1={setContactNumber1}
          setContactNumber2={setContactNumber2}
          setaddressLine1={setaddressLine1}
          setaddressLine2={setaddressLine2}
          setCity={setCity}
          setDistanceFromCenter={setDistanceFromCenter}
          ownerNameInvaid={ownerNameInvaid}
          emailInvaid={emailInvaid}
          contactNumber1Invaid={contactNumber1Invaid}
          addressLine1Invaid={addressLine1Invaid}
          cityInvaid={cityInvaid}
          distanceFromCenterInvaid={distanceFromCenterInvaid}
        />

        <Facilities
          setHotelFacilities={setHotelFacilities}
          hotelFacilitiesInvaid={hotelFacilitiesInvaid}
        />

        <PropertyPhotos
          onChangeUploadImages={onChangeUploadImages}
          uploadedImagesInvaid={uploadedImagesInvaid}
        />
        {uploadedImages.length !== 0 && (
          <ImagePreviewSection images={uploadedImages} />
        )}

        {/* <section>
          <div className="title_2">
            Scan Your QR Code<span style={{ color: "red" }}>*</span>
          </div>
          <div className="subtext">
            Upload the QR code of your wallet address or scan it directly with
            your camera
          </div>
          <Card1>
            {showQRScanner && (
              <QRScanner onClose onScanSuccess={handleScanSuccess} />
            )}
            <div style={{ textAlign: "center" }}>
              {scannedText !== "" && (
                <h6>Your wallet address : {scannedText}</h6>
              )}
            </div>
            <div
              style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
            >
              <Button className="secondaryButton" onClick={openQRScanner}>
                Open QR Scanner
              </Button>
            </div>
          </Card1>
        </section> */}

        <section>
          <h5 style={{ lineHeight: "25px" }}>
            You’re almost done.
            <br />
            To complete your registration, check the boxes below:
          </h5>

          <div className={"pt-3"} style={{ marginLeft: "20px" }}>
            <FormGroup check inline>
              <Input
                type="checkbox"
                style={{ width: 25, height: 25 }}
                onChange={(e) => setIsCondition1Checked(e.target.checked)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label check style={{ lineHeight: "20px" }}>
                <p>
                  I certify that this is a legitimate accommodation business
                  with all necessary licenses and permits, which can be shown
                  upon first request.
                  <br /> VoyageLanka reserves the right to verify and
                  investigate any details provided in this registration.
                </p>
              </Label>
            </FormGroup>
          </div>

          <div className={"pt-3"} style={{ marginLeft: "20px" }}>
            <FormGroup check inline>
              <Input
                type="checkbox"
                style={{ width: 25, height: 25 }}
                onChange={(e) => setIsCondition2Checked(e.target.checked)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label check>
                <p style={{ lineHeight: "35px" }}>
                  I have read, accepted, and agreed to the Terms & Policies.
                </p>
              </Label>
            </FormGroup>
          </div>
        </section>

        <div className={"row center_div pt-3"}>
          <Button
            className="secondaryButton"
            style={{ width: "650px" }}
             disabled={
               registerButtonDisable ||
               !(isCondition1Checked && isCondition2Checked)
             }
            onClick={() => {
              submitForm();
            }}
          >
            Complete Hotel Registration
          </Button>
        </div>
      </MainContainer>
    </>
  );
}

export default RegisterHotel;
