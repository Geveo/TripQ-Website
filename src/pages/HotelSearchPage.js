import MainContainer from "../layout/MainContainer";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/HotelSearchPage/SearchBar";
import HotelList from "../components/HotelSearchPage/HotelList";
import HotelService from "../services-domain/hotel-service copy";
import { Alert, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { LocalStorageKeys } from "../constants/constants";
import { add as selectionDetailsAdd } from "../redux/SelectionDetails/SelectionDetailsSlice";
import { store } from "../redux/store";
import { AzureOpenaiService } from "../services-common/azure-openai-service";
import { setShowScreenLoader } from "../redux/screenLoader/ScreenLoaderSlice";
import { resetAiHotelSearchState } from "../redux/AiHotelSearchState/AiHotelSearchStateSlice";
import { resetHotelSearchState } from "../redux/AiHotelSearchState/MoreAiSearchStateSlice";
import { setAiHotelSearchResults } from "../redux/AiHotelSearchState/AiHotelSearchStateSlice";
import { setMoreAiSearchResults } from "../redux/AiHotelSearchState/MoreAiSearchStateSlice";
import toast from "react-hot-toast";

//http://localhost:3000/search-hotel?city=Galle&fromDate=2023-03-17&toDate=2023-03-20&people=2
function HotelSearchPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const hotelService = HotelService.instance;
  const openAiService = AzureOpenaiService.getInstance();

  const loginState = useSelector((state) => state.loginState);
  let aiHotelSearchState = useSelector((state) => state.AiHotelSearchState);
  let moreAiHotelSearchState = useSelector(
    (state) => state.moreAihotelSearchState
  );

  if (!moreAiHotelSearchState) {
    moreAiHotelSearchState = JSON.parse(localStorage.getItem(
      LocalStorageKeys.MoreAiHotelSearchResult
    ));
     //localStorage.removeItem(LocalStorageKeys.MoreAiHotelSearchResult);
  }
  const [isDataLoading, setIsDataLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const [city, setCity] = useState(queryParams.get("city"));

  const [bedRooms, setBedRooms] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [budget, setBudget] = useState("");
  const [distance, setDistance] = useState("");
  const [conveniences, setConveniences] = useState([]);
  const [roomFacilities, setRoomFacilities] = useState([]);

  const [cancellationPolicy, setCancellationPolicy] = useState("None");
  const [bedTypes, setBedTypes] = useState([]);
  const isFilerDisable = true;

  const [hotelResultListCopy, setHotelResultListCopy] = useState([]);
  const [hotelNames, setHotelNames] = useState([]);
  const [hotelMap, setHotelMap] = useState(new Map());
  const [hotelsInDB, setHotelsInDB] = useState([]);

  useEffect(() => {
    store.dispatch(setShowScreenLoader(true));
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
      setSearchText(aiHotelSearchState.destination);
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
      });
    }
  }, [aiHotelSearchState]);

  useEffect(() => {
    if (hotelNames.length > 0) {
      let hotels = new Map();
      hotelNames.forEach((element) => {
        openAiService.getHotelDetails(element, city).then((res) => {
          hotels.set(element, res);
          setHotelMap(new Map(hotels));
        });
      });
    }
  }, [hotelNames]);

  const onClickSearch = (city, fromDate, toDate, guests) => {
    loadMoreHotels();
    store.dispatch(setShowScreenLoader(true));
    setHotelNames([]);
    setHotelMap(new Map());
    store.dispatch(resetAiHotelSearchState());
    setCity(searchCity);

    const searchText = `${searchCity} hotels from ${fromDate} to ${toDate} for ${guests} people.`;
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
    } else if (!checkInDate || !checkOutDate) {
      toast.error(
        "Please enter valid check-in, check-out dates and guest count"
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

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (isAtBottomOfPage()) {
  //       showMoreHotels();
  //     }
  //   };
  
  //   window.addEventListener("scroll", handleScroll);
  
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [moreAiHotelSearchState.length]);

  function isAtBottomOfPage() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }

  function showMoreHotels() {
    // window.location.reload(true);
    let hotelNames = [];
    if(moreAiHotelSearchState){
      setHotelResultListCopy([])
      moreAiHotelSearchState.forEach((hotel) => {
        hotelNames.push(hotel.hotel_name);
      });
  
      setHotelNames(hotelNames);
      let hotelsNotInDatabase = [];
      hotelNames.forEach((hotelAI) => {
        let found = false;
  
        // Case-insensitive wildcard match
        const regex = new RegExp(`^${hotelAI.replace(/\*/g, ".*")}$`, "i");
  
        hotelsInDB.forEach((hotelDB) => {
          if (regex.test(hotelDB.Name)) {
            found = true;
          }
        });
        if (!found) {
          hotelsNotInDatabase.push(hotelAI);
        }
      });
  
      let hotelList = hotelsInDB;
      hotelsNotInDatabase.forEach((hotel) => {
        moreAiHotelSearchState.forEach((aiHotel) => {
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
      dispatch(resetHotelSearchState());
    }
  }

  function loadMoreHotels() {
    const promises = [openAiService.searchHotels(searchText, 25)];

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

  return (
    <MainContainer>
      <div className={"row_fit"} style={{ width: "100%" }}>
        {hotelResultListCopy && hotelResultListCopy.length > 0 ? (
          <SearchBar
            searchCity={searchCity}
            city={aiHotelSearchState.destination}
            checkInDate={aiHotelSearchState.from_date}
            checkOutDate={aiHotelSearchState.to_date}
            numOfPeople={aiHotelSearchState.total_head_count}
            hotelsData={hotelResultListCopy}
            bedRooms={bedRooms}
            setBedRooms={setBedRooms}
            onCitySearchChanged={onCitySearchChanged}
            searchText={searchText}
            setSearchText={setSearchText}
            onClearSearchText={onClearSearchText}
            onClickSearch={onClickSearch}
            setSearchCity={setSearchCity}
            setGuestCount={setGuestCount}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
          />
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
        <div className={"row_fit"} style={{ width: "100%" }}>
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
    </MainContainer>
  );
}

export default HotelSearchPage;
