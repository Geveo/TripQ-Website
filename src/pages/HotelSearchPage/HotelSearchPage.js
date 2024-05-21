import "./hotel_search_page_styles.scss";
import MainContainer from "../../layout/MainContainer";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "../../components/HotelSearchPage/SearchBar";
import HotelList from "../../components/HotelSearchPage/HotelList";
import HotelService from "../../services-domain/hotel-service copy";
import { Alert, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { LocalStorageKeys } from "../../constants/constants";
import { add as selectionDetailsAdd } from "../../redux/SelectionDetails/SelectionDetailsSlice";
import { store } from "../../redux/store";
import { AzureOpenaiService } from "../../services-common/azure-openai-service";
import { setShowScreenLoader } from "../../redux/screenLoader/ScreenLoaderSlice";
import { setScreenLoaderText } from "../../redux/screenLoader/ScreenLoaderSlice";
import { resetAiHotelSearchState } from "../../redux/AiHotelSearchState/AiHotelSearchStateSlice";
import { resetHotelSearchState } from "../../redux/AiHotelSearchState/MoreAiSearchStateSlice";
import { setAiHotelSearchResults } from "../../redux/AiHotelSearchState/AiHotelSearchStateSlice";
import { setMoreAiSearchResults } from "../../redux/AiHotelSearchState/MoreAiSearchStateSlice";
import toast from "react-hot-toast";
import SearchMenu from "../../components/SearchMenu";
import { Col, Container, Row, Input, Button } from "reactstrap";
import InputGroup from "react-bootstrap/InputGroup";
import SpeechService from "../../services-common/speech-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function HotelSearchPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchTextMessage = queryParams.get("searchText");
  const [city, setCity] = useState(queryParams.get("city"));

  const hotelService = HotelService.instance;
  const openAiService = AzureOpenaiService.getInstance();
  const speechService = new SpeechService();
  let hotels = new Map();

  let aiHotelSearchState = useSelector((state) => state.AiHotelSearchState);
  let moreAiHotelSearchState = useSelector(
    (state) => state.moreAihotelSearchState
  );

  if (!moreAiHotelSearchState) {
    moreAiHotelSearchState = JSON.parse(
      localStorage.getItem(LocalStorageKeys.MoreAiHotelSearchResult)
    );
    //localStorage.removeItem(LocalStorageKeys.MoreAiHotelSearchResult);
  }
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchText, setSearchText] = useState(searchTextMessage);
  const [searchCity, setSearchCity] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelResultListCopy, setHotelResultListCopy] = useState([]);
  const [hotelNames, setHotelNames] = useState([]);
  const [hotelMap, setHotelMap] = useState(new Map());
  const [hotelsInDB, setHotelsInDB] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [start, setStart] = useState(5);
  const [end, setEnd] = useState(10);

  useEffect(() => {
    store.dispatch(setShowScreenLoader(true));
    store.dispatch(
      setScreenLoaderText(
        "We are working on getting the best hotel for you"
      )
    );
    // Get AI searched results
    if (!aiHotelSearchState) {
      aiHotelSearchState = localStorage.getItem(
        LocalStorageKeys.AiHotelSearchResult
      );
      localStorage.removeItem(LocalStorageKeys.AiHotelSearchResult);
    }
    if (
      aiHotelSearchState &&
      aiHotelSearchState.hotels &&
      aiHotelSearchState.hotels.length > 0
    ) {
      let hotelNames = [];
      let searchResult = [];
      let hotelList = [];

      aiHotelSearchState.hotels.forEach((hotel) => {
        hotelNames.push(hotel.hotel_name);
      });

      setHotelNames(hotelNames);
      const obj = {
        City: aiHotelSearchState.destination,
        CheckInDate: new Date(aiHotelSearchState.from_date),
        CheckOutDate: new Date(aiHotelSearchState.to_date),
        GuestCount: aiHotelSearchState.total_head_count,
        AISearchedList: hotelNames,
      };

      setCity(aiHotelSearchState.destination);
      setSearchCity(aiHotelSearchState.destination);
      //setSearchText(aiHotelSearchState.destination);
      setCheckInDate(aiHotelSearchState.from_date);
      setCheckOutDate(aiHotelSearchState.to_date);
      setGuestCount(aiHotelSearchState.total_head_count);

      hotelService.GetHotelsListMappedWithAISearch(obj).then((res) => {
        if (res) {
          res.forEach((hotel) => {
            searchResult.push(hotel.Name);
          });
        }

        let hotelsNotInDatabase = [];
        let hotelsInDatabase = [];
        hotelNames.forEach((hotelAI) => {
          let found = false;

          // Case-insensitive wildcard match
          const regex = new RegExp(`^${hotelAI.replace(/\*/g, ".*")}$`, "i");

          searchResult.forEach((hotelDB) => {
            if (regex.test(hotelDB)) {
              found = true;
            }
          });
          if (!found) {
            hotelsNotInDatabase.push(hotelAI);
          }
        });

        if (res) {
          res.forEach((hotel) => {
            const hotelObj = {
              AvailableRooms: hotel.AvailableRooms,
              ContactDetails: JSON.parse(hotel.ContactDetails),
              CreatedOn: hotel.CreatedOn,
              Description: hotel.Description,
              Facilities: JSON.parse(hotel.Facilities),
              Id: hotel.Id,
              ImageURL: hotel.ImageURL,
              LastUpdateOn: hotel.LastUpdateOn,
              Location: JSON.parse(hotel.Location),
              Name: hotel.Name,
              StarRatings: hotel.StarRatings,
              WalletAddress: hotel.WalletAddress,
              WebsiteURL: "",
              PhoneNumber: JSON.parse(hotel.ContactDetails).PhoneNumber,
            };
            hotelsInDatabase.push(hotelObj);
            hotelList.push(hotelObj);
          });
        }

        setHotelsInDB(hotelsInDatabase);
        hotelsNotInDatabase.forEach((hotel) => {
          aiHotelSearchState.hotels.forEach((aiHotel) => {
            if (aiHotel.hotel_name === hotel) {
              const hotelObj = {
                AvailableRooms: [],
                ContactDetails: "",
                CreatedOn: "",
                Description: aiHotel.hotel_description,
                Facilities: "",
                Id: "",
                ImageURL: aiHotel.star_ratings,
                LastUpdateOn: "",
                Location: aiHotel.hotel_address,
                Name: aiHotel.hotel_name,
                StarRatings: aiHotel.star_ratings,
                WalletAddress: "",
                WebsiteURL: aiHotel.website_link,
                PhoneNumber: aiHotel.phone,
              };
              hotelList.push(hotelObj);
            }
          });
        });
        setHotelResultListCopy(hotelList);
        store.dispatch(setShowScreenLoader(false));
        store.dispatch(setScreenLoaderText(""));
      });
    }
  }, [aiHotelSearchState]);

  useEffect(() => {
    if (hotelNames.length > 0) {
      hotelNames.forEach((element) => {
        openAiService.getHotelDetails(element, city).then((res) => {
          setHotelMap((prevHotelMap) => {
            const updatedHotelMap = new Map(prevHotelMap);
            updatedHotelMap.set(element, res);
            return updatedHotelMap;
          });
        });
      });
    }
  }, [hotelNames, city]);

  const onClickSearch = (city, fromDate, toDate, guests) => {
    loadMoreHotels();
    setStart(5);
    setEnd(10);
    setShowMore(true);
    store.dispatch(setShowScreenLoader(true));
    setHotelNames([]);
    setHotelMap(new Map());
    store.dispatch(resetAiHotelSearchState());
    setCity(searchCity);

    const promises = [openAiService.searchHotels(searchText)];

    Promise.all(promises)
      .then(([searchResult]) => {
        if (searchResult.hotels.length > 0) {
          dispatch(setAiHotelSearchResults(searchResult));
          localStorage.setItem(
            LocalStorageKeys.AiHotelSearchResult,
            JSON.stringify(searchResult)
          );
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };

  function onViewAvailableClicked(hotel) {
    dispatch(
      selectionDetailsAdd({
        key: localStorage.getItem(LocalStorageKeys.HotelSelectionDetails),
        value: hotel,
      })
    );

    localStorage.setItem(
      LocalStorageKeys.HotelSelectionDetails,
      JSON.stringify(hotel)
    );

    if (hotel.WebsiteURL && hotel.WebsiteURL.length > 0) {
      window.open(hotel.WebsiteURL, "_blank");
    } else if (!checkInDate || !checkOutDate || guestCount == 0) {
      toast.error(
        "Please ensure your search query includes valid check-in/check-out dates and the number of guests"
      );
    } else {
      navigate(
        `/availability/${hotel.Id}/${formatDate(checkInDate)}/${formatDate(
          checkOutDate
        )}`
      );
    }
  }

  function onCitySearchChanged(newCity) {
    setSearchCity(newCity);
  }

  const onClearSearchText = () => {
    setSearchText("");
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  function showMoreHotels(start, end) {
    if (moreAiHotelSearchState) {
      let newHotels = [];

      end = Math.min(end, moreAiHotelSearchState.length);

      for (let i = start; i < end; i++) {
        const hotel = moreAiHotelSearchState[i];
        if (
          newHotels.length < 5 &&
          !hotelNames.includes(hotel.hotel_name) &&
          !newHotels.includes(hotel.hotel_name)
        ) {
          newHotels.push(hotel.hotel_name);
        }
      }

      if (end >= moreAiHotelSearchState.length) {
        setShowMore(false);
      }

      setHotelNames(newHotels);

      let hotelList = [];
      newHotels.forEach((hotel) => {
        const hotelObj = {
          AvailableRooms: [],
          ContactDetails: "",
          CreatedOn: "",
          Description: "",
          Facilities: "",
          Id: "",
          ImageURL: "",
          LastUpdateOn: "",
          Location: "",
          Name: hotel,
          StarRatings: "",
          WalletAddress: "",
          WebsiteURL: "",
          PhoneNumber: "",
        };
        hotelList.push(hotelObj);
      });

      setHotelResultListCopy((prevHotelList) => [
        ...prevHotelList,
        ...hotelList,
      ]);

      setStart(end);
      setEnd(end + 5);
    }
  }

  function loadMoreHotels() {
    const promises = [openAiService.searchHotels(searchText, 30)];

    Promise.all(promises)
      .then(([searchResult]) => {
        if (searchResult.hotels.length > 0) {
          dispatch(setMoreAiSearchResults(searchResult.hotels));
          localStorage.setItem(
            LocalStorageKeys.MoreAiHotelSearchResult,
            JSON.stringify(searchResult.hotels)
          );
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }

  async function handleSpeechToTextFromMic() {
    setSearchText("");
    setIsListening(true);
    speechService
      .speechToTextFromMic()
      .then((displayText) => {
        setSearchText(displayText);
        setIsListening(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsListening(false);
      });
  }

  function onSearchSubmit() {
    loadMoreHotels();
    const promises = [openAiService.searchHotels(searchText)];

    Promise.all(promises)
      .then(([searchResult]) => {
        if (searchResult.hotels.length > 0) {
          dispatch(setAiHotelSearchResults(searchResult));
          localStorage.setItem(
            LocalStorageKeys.AiHotelSearchResult,
            JSON.stringify(searchResult)
          );
          navigate(`/search-hotel`);
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }

  return (
    <>
      <MainContainer>
        <div className={"row_fit"} style={{ width: "100%" }}>
          {hotelResultListCopy && hotelResultListCopy.length > 0 ? (
            // <SearchBar
            //   searchCity={searchCity}
            //   city={aiHotelSearchState.destination}
            //   checkInDate={aiHotelSearchState.from_date}
            //   checkOutDate={aiHotelSearchState.to_date}
            //   numOfPeople={aiHotelSearchState.total_head_count}
            //   hotelsData={hotelResultListCopy}
            //   bedRooms={bedRooms}
            //   setBedRooms={setBedRooms}
            //   onCitySearchChanged={onCitySearchChanged}
            //   searchText={searchText}
            //   setSearchText={setSearchText}
            //   onClearSearchText={onClearSearchText}
            //   onClickSearch={onClickSearch}
            //   setSearchCity={setSearchCity}
            //   setGuestCount={setGuestCount}
            //   setCheckInDate={setCheckInDate}
            //   setCheckOutDate={setCheckOutDate}
            // />
            <div className="search_section hotel-search-page">
              <div className={"title_2"}>
                {hotelResultListCopy.length > 0
                  ? hotelResultListCopy.length
                  : `No `}{" "}
                Hotels in {aiHotelSearchState.destination}
              </div>
              <div
                className={"subtext"}
                style={{ lineHeight: "15px", marginBottom: "40px" }}
              >
                Book your next stay at one of our properties
              </div>
              <div className="search-area">
                <div>
                  <Row>
                    <Col>
                      <div className="container">
                        <div className="icon-and-text">
                          <div className="search-area-phrase">
                            Eg-: I want to take my family of four to a beach
                            resort in Asia from the 1st December to the 31st
                            December 2024. We are also interested in trekking.
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "center" }}>
                    <Col md={10}>
                      <InputGroup className="">
                        <textarea
                          placeholder="Search your next stay here..."
                          aria-label="Search your next stay here..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          rows={3}
                          cols={130}
                        />
                      </InputGroup>
                    </Col>
                    <Col
                      md={2}
                      className="d-flex justify-content-end align-items-center"
                    >
                      <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        className={`mr-2 ${
                          isListening
                            ? "microphone-icon-isListening remove-right-border-radius"
                            : "microphone-icon remove-right-border-radius"
                        }`}
                        onClick={handleSpeechToTextFromMic}
                        title="Speak freely in your native tongue. Remember to include your preferences, check-in and check-out dates, and the number of guests while you talk."
                      >
                        <FontAwesomeIcon
                          size="lg"
                          icon={faMicrophone}
                          className="fa fa-microphone"
                        />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        className={`mr-2 search-icon remove-left-border-radius`}
                        onClick={onClickSearch}
                        title="Search"
                        disabled={searchText.length === 0}
                      >
                        <FontAwesomeIcon
                          size="lg"
                          icon={faSearch}
                          className="fa fa-search"
                        />
                      </Button>
                    </Col>
                  </Row>
                  {isListening ? (
                    <div className="listening">Listening...</div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {isDataLoading ? (
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
        ) : hotelResultListCopy?.length < 1 ? (
          <Alert color="warning" style={{ marginBottom: "40vh" }}>
            No Hotels Found!
          </Alert>
        ) : (
          <div className={"row_fit hotel-list"} style={{ width: "100%" }}>
            <div className={"col"}>
              {hotelResultListCopy && hotelResultListCopy.length > 0 ? (
                <HotelList
                  data={hotelResultListCopy}
                  hotelMap={hotelMap}
                  numOfPeople={guestCount}
                  onViewAvailableClicked={onViewAvailableClicked}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        )}
        {showMore && (
          <div className="centered-button-container">
            <Button
              className="show_more"
              onClick={() => showMoreHotels(start, end)}
            >
              Show More
            </Button>
          </div>
        )}
      </MainContainer>
    </>
  );
}

export default HotelSearchPage;
