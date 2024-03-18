import MainContainer from "../layout/MainContainer";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/HotelSearchPage/SearchBar";
import Filters from "../components/HotelSearchPage/Filters";
import facilitiesData from "../data/facilities"
import roomFacilitiesData from "../data/room_facilities";
import { bed_types } from "../constants/constants";
import HotelList from "../components/HotelSearchPage/HotelList";
import HotelService from "../services-domain/hotel-service copy";
import {Alert, Spinner} from 'reactstrap'
import toast from "react-hot-toast";


//http://localhost:3000/search-hotel?city=Galle&fromDate=2023-03-17&toDate=2023-03-20&people=2
function HotelSearchPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const hotelService = HotelService.instance;

    const [isDataLoading, setIsDataLoading] = useState(false);


    const queryParams = new URLSearchParams(location.search);
    const [city, setCity] = useState(queryParams.get("city"));
    let checkInDate = queryParams.get("fromDate");
    let checkOutDate = queryParams.get("toDate");
    let numOfPeople = queryParams.get("peopleCount");

    const [bedRooms, setBedRooms] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchCity, setSearchCity] = useState("");



    const [budget, setBudget] = useState("");
    const [distance, setDistance] = useState("");
    const [conveniences, setConveniences] = useState([])
    const [roomFacilities, setRoomFacilities] = useState([])

    const [cancellationPolicy, setCancellationPolicy] = useState("None");
    const [bedTypes, setBedTypes] = useState([]);

    const isFilerDisable = true;

    const [hotelResultList, setHotelResultList] = useState(null);
    const [hotelResultListCopy, setHotelResultListCopy] = useState(null);

    async function searchHotelsWithRooms(city, checkInDate, checkOutDate, numOfPeople) {
        setIsDataLoading(true);
        if (!(city && checkInDate && checkOutDate && numOfPeople && numOfPeople > 0)) {
            setIsDataLoading(false);
            toast.error("Invalid search criteria!")
            return;
        }
        const obj = {
            City: city,
            CheckInDate:  new Date(checkInDate).toISOString().split('T')[0],
            CheckOutDate: new Date(checkOutDate).toISOString().split('T')[0],
            GuestCount: numOfPeople
        }

        try {
            hotelService.SearchHotelsWithRooms(obj)
            .then((res) => {
                console.log("res:", res)
                if (res && res.length > 0) {
                    const newHotellist = res.map(hh => {
                        return {
                            Id: hh.Id,
                            Name: hh.Name,
                            City: hh.city,
                            roomDetails: hh.roomDetails,
                            imageUrl: hh.ImageUrl,
                            noOfDays: hh.noOfDays
                        };
                    });
    
                    setCity(city);
                    setHotelResultList(newHotellist);
                    setHotelResultListCopy(newHotellist);
    
                    setIsDataLoading(false)
                } else {
                    setIsDataLoading(false);
                    setHotelResultListCopy([])
                }
            });
           

           
        } catch (error) {
            setIsDataLoading(false)
            console.log(error);
            return;
        }
    }

    useEffect(() => {
        let convenienceWithAvailability = facilitiesData.map(facility => {
            return {
                ...facility,
                status: false,
            }
        })

        let quickPlannersWithAvailability = facilitiesData.map(facility => {
            return {
                ...facility,
                status: false,
            }
        })

        let bedTypeAvailability = bed_types.map(bed_type => {
            return {
                ...bed_type,
                status: false,
            }
        })

        let roomFacilityAvailability = roomFacilitiesData.map(room_facility => {
            return {
                ...room_facility,
                status: false,
            }
        })

        setConveniences(convenienceWithAvailability);
        setRoomFacilities(roomFacilityAvailability);
        setBedTypes(bedTypeAvailability);
        setSearchCity(city);
        searchHotelsWithRooms(city, checkInDate, checkOutDate, numOfPeople);
    }, []);

    const onClickSearch = async () => {
        let selected_conveniences = conveniences.filter(convenience => convenience.status);
        let selected_bed_types = bedTypes.filter(bed_type => bed_type.status);
        let selected_room_facilities = roomFacilities.filter(facility => facility.status);
        console.log(
            {
                "Bed Rooms": bedRooms,
                "Search Text": searchText,
                "Budget": budget,
                "Conveniences": selected_conveniences,
                "Distance": distance,
                "Cancellation Policy": cancellationPolicy,
                "Bed Preferences": selected_bed_types,
                "Room Facilities": selected_room_facilities,
            }
        );

        if (searchCity !== city) {
            setCity(searchCity);
            await searchHotelsWithRooms(searchCity, checkInDate, checkOutDate, numOfPeople);
        }

        if (searchText && searchText.length > 0) {
            setHotelResultListCopy(hotelResultList);
            setHotelResultListCopy(hotelResultListCopy.filter(hh => hh.Name.includes(searchText)));
        }
    }

    const resetFilters = () => {
        let temp_conveniences = conveniences.map(convenience => {
            return {
                ...convenience, status: false,
            }
        })

        let bed_types = bedTypes.map(bed_type => {
            return {
                ...bed_type, status: false,
            }
        })

        let room_facilities = roomFacilities.map(facility => {
            return {
                ...facility, status: false,
            }
        })
        setBudget("");
        setConveniences(temp_conveniences);
        setDistance("");
        setCancellationPolicy("None");
        setBedTypes(bed_types);
        setRoomFacilities(room_facilities);
    }

   

    function onViewAvailableClicked(hotelId) {
        navigate(`/availability/${hotelId}/${checkInDate}/${checkOutDate}`);
    }

    function onCitySearchChanged(newCity) {
        setSearchCity(newCity);
    }

    const onClearSearchText = () => {
        setSearchText("");
        console.log(hotelResultList)
        setHotelResultListCopy(hotelResultList);
    }


    return (
        <MainContainer>

            <SearchBar searchCity={searchCity} city={city} checkInDate={checkInDate} checkOutDate={checkOutDate} numOfPeople={numOfPeople} hotelsData={hotelResultListCopy}
                bedRooms={bedRooms} setBedRooms={setBedRooms} onCitySearchChanged={onCitySearchChanged}
                searchText={searchText} setSearchText={setSearchText} onClearSearchText={onClearSearchText}
                onClickSearch={onClickSearch} />

            {isDataLoading ?
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
                :  hotelResultListCopy?.length < 1 ? (<Alert color="warning" style={{ marginBottom: "40vh" }}>
                No Hotels Found!
            </Alert>) : 

                <div className={"row_fit"} style={{ width: "100%" }}>

                    <div className={"col"}>
                        {(hotelResultListCopy && hotelResultListCopy.length > 0) ? <HotelList data={hotelResultListCopy} numOfPeople={numOfPeople} onViewAvailableClicked={onViewAvailableClicked} /> : ''}
                    </div>


                </div>
            }
        </MainContainer>
    )
}

export default HotelSearchPage