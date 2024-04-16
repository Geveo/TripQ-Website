import React from "react";
import {FaMapMarkerAlt, FaMobile} from "react-icons/fa";
import StarRating from "../HotelHomePage/StarRating";

function SearchHotelResult({hotel, numOfPeople, onViewAvailableClicked}) {
    const styles = {
        image: {
            width: "284px",
            height: "241px",
            objectFit: "cover",
            borderRadius: "5px",
        },
    };
    console.log("hotel", hotel)
    const location = JSON.parse(hotel.City)
    const contact = JSON.parse(hotel.ContactDetails)

    return (
        <div className={"hotel_card mb-5"} style={{width: "1000px"}}>
            <div className={"row_fit p-5"}>
                <img
                    key={hotel.Id}
                    src={hotel.ImageURL[0].ImageURL}
                    alt={"Hotel image"}
                    style={styles.image}
                />

                <div className={"col-md"} style={{paddingLeft: "20px"}}>
                    <div className={"title_2"} style={{fontSize: "22px"}}>{hotel.Name} <StarRating ratings={hotel.StarRatings} reviews={726}/>
                        </div>

                    <div className={"row_fit"}>
                        <div style={{width: "20px", paddingTop: "2px"}}>
                            <FaMapMarkerAlt color={"#908F8F"}/>
                        </div>
                        <div className={"col"} style={{paddingTop: "4px"}}>
                            {location.AddressLine01},{location.AddressLine02},{location.City}
                        </div>
                    </div>
                    <div className={"row_fit"}>
                        <div style={{width: "20px", paddingTop: "2px"}}>
                            <FaMobile color={"#908F8F"}/>
                        </div>
                        <div className={"col"} style={{paddingTop: "4px"}}>
                        {contact.PhoneNumber}
                        </div>
                    </div>
                    <div className={"row_fit"}>
                        <div className={"col"} style={{paddingTop: "4px"}}>
                        {hotel.Description}
                        
                        </div>
                    </div>

                    <div className={"pt-3 row_right"} style={{}}>
                        <button className={"view_availability_button"} style={{width: "200px"}} onClick={() => onViewAvailableClicked(hotel)} >
                            View Availability
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default SearchHotelResult;