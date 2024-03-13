
import MainContainer from "../../../layout/MainContainer";
import React, { useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import HotelService from "../../../services-domain/hotel-service copy";
import {Spinner} from "reactstrap";
import {toast} from "react-hot-toast";
import RoomFacilitiesReadOnly from './RoomFacilitiesReadOnly';
import { useNavigate } from 'react-router-dom';


function RoomTypeDetails() {
    const [roomDetails, setRoomDetails] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const facilitiesSection = useRef(null);
    const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(id);
        // Fetch room details from backend using roomTypeId
        getRoomTypeById();
    }, []); 

    async function getRoomTypeById() {
        try {
            console.log(parseInt(id, 10));
            setIsLoading(true);
            HotelService.instance.getRoomTypeById(id)
             .then((data) => {
                console.log("data: ",data);
                setRoomDetails(data.roomType);
                setFacilities(data.Facilities);
                let selectedFacilitiesIDs = [];
                data.Facilities.forEach((element) => {
                    selectedFacilitiesIDs.push(element.id);
                });
                setSelectedFacilityIds(selectedFacilitiesIDs);
                setIsLoading(false);
             });
              
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(error);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };
/*
    if (!roomDetails) {
        return <div>Loading...</div>; // Display loading message until details are fetched
    }
*/
    return (
        <div>
             {isLoading ? (
                <div className="spinnerWrapper">
                    <Spinner
                        color="primary"
                        style={{
                            height: '3rem',
                            width: '3rem'
                        }}
                        type="grow"
                    >
                        Loading...
                    </Spinner>
                </div>
            ) : (
                <MainContainer>
            <div >

        <div className="row">
            <div style={{paddingLeft:'15px', color: '#2c2c76'}} className={"title_2 col-11"}><strong>{roomDetails.Code}</strong></div>
        </div>

        <div className="title_3 mt-3 ">Description</div>
        <div style={{paddingLeft:'15px'}}>{roomDetails.Description}</div>

        <div style={{paddingLeft:'15px'}} className="mt-3">Room Size in Sqft : {roomDetails.Sqft}</div>

        <div style={{paddingLeft:'15px'}} className=" mt-3">Number of Rooms :{roomDetails.RoomsCount} </div>

        <div className="title_3 mt-4">Bed Options</div>
        <div style={{paddingLeft:'15px'}} className="mt-3">Number of Single Beds : {roomDetails.SingleBedCount}</div>
        <div style={{paddingLeft:'15px'}} className=" mt-3">Number of Double Beds : {roomDetails.DoubleBedCount}</div>
        <div style={{paddingLeft:'15px'}} className=" mt-3">Number of Triple Beds : {roomDetails.TripleBedCount}</div>

        <div className="title_3 mt-4">Base price per day</div>
        <div style={{paddingLeft:'15px'}} className="mt-3">Price in Evers : {parseFloat(roomDetails.Price).toFixed(2)}</div>

        <section ref={facilitiesSection} id="facilities" className={"pt-2"}>
              <RoomFacilitiesReadOnly
                selectedFacilityIds={selectedFacilityIds}
              />
            </section>

       

      {/*<RoomFacilities facilities={roomDetails.facilities}
       {facilities.map(facility => {
                                        return (
                                            <div className={"facility"} key={facility.Id}>
                                                <FaCheck color={"#004cb8"}/>
                                                <span className={"facility-text"}>{facility.Name}</span>
                                            </div>
                                        );
                                    })} />*/}  


        <div className={"row center_div pt-0"}>
            <button className={"create_room_button"} style={{ width: "500px" }} onClick={handleClose}>
                Close
            </button>
        </div>
    </div>
    </MainContainer>
    )}
    </div>
    
        
    );
}

export default RoomTypeDetails;