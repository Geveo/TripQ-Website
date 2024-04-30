import MainContainer from "../layout/MainContainer";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/HotelSearchPage/SearchBar";
import facilitiesData from "../data/facilities";
import roomFacilitiesData from "../data/room_facilities";
import { bed_types } from "../constants/constants";
import HotelList from "../components/HotelSearchPage/HotelList";
import HotelService from "../services-domain/hotel-service copy";
import { Alert, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { LocalStorageKeys } from "../constants/constants";
import { add as selectionDetailsAdd } from "../redux/SelectionDetails/SelectionDetailsSlice";

//http://localhost:3000/search-hotel?city=Galle&fromDate=2023-03-17&toDate=2023-03-20&people=2
function HotelSearchPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const hotelService = HotelService.instance;

  const loginState = useSelector((state) => state.loginState);
  const aiHotelSearchState = useSelector((state) => state.AiHotelSearchState);

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

  const [hotelResultList, setHotelResultList] = useState(null);
  const [hotelResultListCopy, setHotelResultListCopy] = useState(null);

  useEffect(() => {
    // Get AI searched results
    if (!aiHotelSearchState) {
      aiHotelSearchState = localStorage.getItem(
        LocalStorageKeys.AiHotelSearchResult
      );
    }
    const obj = {
      City: aiHotelSearchState.destination,
      CheckInDate: new Date(aiHotelSearchState.from_date),
      CheckOutDate: new Date(aiHotelSearchState.to_date),
      GuestCount: aiHotelSearchState.total_head_count,
      AISearchedList: aiHotelSearchState.hotel_names,
    };

    setCity(aiHotelSearchState.destination);
    setSearchCity(aiHotelSearchState.destination);
    setSearchText(aiHotelSearchState.destination);
    setCheckInDate(aiHotelSearchState.from_date);
    setCheckOutDate(aiHotelSearchState.to_date);

    hotelService.GetHotelsListMappedWithAISearch(obj).then((res) => {
      setHotelResultList(res);
      setHotelResultListCopy(res);
    });
  }, []);

  async function searchHotelsWithRooms(
    city,
    checkInDate,
    checkOutDate,
    numOfPeople
  ) {
    setIsDataLoading(true);
    if (
      !(city && checkInDate && checkOutDate && numOfPeople && numOfPeople > 0)
    ) {
      setIsDataLoading(false);

      return;
    }
    const obj = {
      City: city,
      CheckInDate: new Date(checkInDate).toISOString().split("T")[0],
      CheckOutDate: new Date(checkOutDate).toISOString().split("T")[0],
      GuestCount: numOfPeople,
    };

    try {
      hotelService.SearchHotelsWithRooms(obj).then((res) => {
        if (res && res.length > 0) {
          const newHotellist = res.map((hh) => {
            return {
              Id: hh.Id,
              Name: hh.Name,
              City: hh.Location,
              ImageURL: hh.ImageURL,
              StarRatings: hh.StarRatings,
              ContactDetails: hh.ContactDetails,
              Description: hh.Description,
              WalletAddress: hh.WalletAddress,
            };
          });
          setCity(city);

          setHotelResultList(newHotellist);
          setHotelResultListCopy(newHotellist);

          setIsDataLoading(false);
        } else {
          setIsDataLoading(false);
          setHotelResultListCopy([]);
        }
      });
    } catch (error) {
      setIsDataLoading(false);
      console.log(error);
      return;
    }
  }

  const onClickSearch = async () => {
    setCity(searchCity);

    const obj = {
      City: searchCity,
      CheckInDate: checkInDate,
      CheckOutDate: checkOutDate,
      GuestCount: 2,
    };

    try {
      hotelService.SearchHotelsWithRooms(obj).then((res) => {
        if (res && res.length > 0) {
          const newHotellist = res.map((hh) => {
            return {
              Id: hh.Id,
              Name: hh.Name,
              Location: hh.Location,
              ImageURL: hh.ImageURL,
              StarRatings: hh.StarRatings,
              ContactDetails: hh.ContactDetails,
              Description: hh.Description,
              WalletAddress: hh.WalletAddress,
              AvailableRooms: hh.AvailableRooms,
            };
          });
          setCity(city);

          setHotelResultList(newHotellist);
          setHotelResultListCopy(newHotellist);

          setIsDataLoading(false);
        } else {
          setIsDataLoading(false);
          setHotelResultListCopy([]);
        }
      });
    } catch (error) {
      setIsDataLoading(false);
      console.log(error);
      return;
    }

    if (searchText && searchText.length > 0) {
      setHotelResultListCopy(hotelResultList);
      setHotelResultListCopy(
        hotelResultListCopy.filter((hh) => hh.Name.includes(searchText))
      );
    }
  };

  const resetFilters = () => {
    let temp_conveniences = conveniences.map((convenience) => {
      return {
        ...convenience,
        status: false,
      };
    });

    let bed_types = bedTypes.map((bed_type) => {
      return {
        ...bed_type,
        status: false,
      };
    });

    let room_facilities = roomFacilities.map((facility) => {
      return {
        ...facility,
        status: false,
      };
    });
    setBudget("");
    setConveniences(temp_conveniences);
    setDistance("");
    setCancellationPolicy("None");
    setBedTypes(bed_types);
    setRoomFacilities(room_facilities);
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
    navigate(
      `/availability/${hotel.Id}/${formatDate(checkInDate)}/${formatDate(
        checkOutDate
      )}`
    );
  }

  function onCitySearchChanged(newCity) {
    setSearchCity(newCity);
  }

  const onClearSearchText = () => {
    setSearchText("");
    setHotelResultListCopy(hotelResultList);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  return (
    <MainContainer>
      <div className={"row_fit"} style={{ width: "100%" }}>
        <SearchBar
          searchCity={searchCity}
          city={city}
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
