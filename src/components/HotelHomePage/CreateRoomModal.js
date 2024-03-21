import Card1 from "../../layout/Card";
import React, { useEffect, useState } from "react";
import RoomFacilities from "./RoomFacilities";
import {Spinner} from "reactstrap";

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CreateRoomModal(props) {
    const { onSubmitRoom } = props;
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [numOfRooms, setNumOfRooms] = useState(0);
    const [numOfSingleBeds, setNumOfSingleBeds] = useState(0);
    const [numOfDoubleBeds, setNumOfDoubleBeds] = useState(0);
    const [numOfTripleBeds, setNumOfTripleBeds] = useState(0);
    const [sqft, setSqft] = useState(0);
    const [pricePerDay, setPricePerDay] = useState(0.0);
    const [roomCreateDisabled, setRoomCreateDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [checkedFacilities, setCheckedFacilities] = useState([]);

    const onChangeRoomName = (event) => {
        setRoomName(event.target.value);
    }

    const onChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const onChangeNumOfRooms = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setNumOfRooms(parseInt(event.target.value, 10));
    }

    const onChangeNumOfSingleBeds = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setNumOfSingleBeds(parseInt(event.target.value, 10));
    }

    const onChangeNumOfDoubleBeds = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setNumOfDoubleBeds(parseInt(event.target.value, 10));
    }

    const onChangeNumOfTripleBeds = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setNumOfTripleBeds(parseInt(event.target.value, 10));
    }

    const onChangeSqft = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setSqft(parseInt(event.target.value, 10));
    }

    const onChangePricePerDay = (event) => {
        let regexp = /^[+]?\d*\.?\d*$/;

        if (!regexp.test(event.target.value)) {
            return;
        }
        console.log(event.target.value)
        setPricePerDay(event.target.value);
    }

    const onChangeFacility = (checked, facility) => {
        if (checked) {
            setCheckedFacilities(prevState => {
                return [...prevState, facility];
            })
        } else {
            setCheckedFacilities(prevState => {
                return prevState.filter(cur_facility => {
                    return cur_facility.Id !== facility.Id;
                })
            })
        }
    }

    const onSubmitRoomModal = () => {
        try {
            setIsLoading(true);
            const data = {
                "HotelId": 0,
                "Code": roomName,
                "Sqft": sqft,
                "Description": description,
                "RoomsCount": numOfRooms,
                "SingleBedCount": numOfSingleBeds,
                "DoubleBedCount": numOfDoubleBeds,
                "TripleBedCount": numOfTripleBeds,
                "Price": pricePerDay,
                "Facilities": checkedFacilities.map(fc => ({ RFacilityId: fc.Id, ...fc }))
            };
            onSubmitRoom(data);
            setIsLoading(false);
            setRoomCreateDisabled(true)
              console.log(data);
        }
        catch (error) {
            console.log(error);
            throw error;
        }

    }



    /* 
    const toggleBedTypeDropDown = () => {
        setBedTypeDropDownOpen(prevState => !prevState)

    const changeBedType = (value) => {
        setBedType(value);
    }
    const [bedTypeDropDownOpen, setBedTypeDropDownOpen] = useState(false);
    }*/


    //disable create room button logic
    useEffect(() => {
        if (roomName && description && numOfRooms && numOfSingleBeds && numOfDoubleBeds && pricePerDay && numOfTripleBeds && checkedFacilities.length > 0) {
            setRoomCreateDisabled(false);
        }
        else {
            setRoomCreateDisabled(false);
        }
    }, [roomName, description, numOfRooms, numOfSingleBeds, numOfDoubleBeds, pricePerDay, numOfTripleBeds, checkedFacilities])

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
        <div className={"room_modal pt-5 mt-8"}>
            <Card1 width={"850px"} className={"mt-7 pt-15"}> 
               <div className="row">
                <div className={"title_2 col-11"} > Create Room Type</div>
                <div className={"col-1 "} style={{flex: 1, display: 'flex', alignItems: 'center'}}><FontAwesomeIcon size="2x" icon={faTimes} className="fa fa-window-close " onClick={props.onClose} /></div>   
               </div>
               

                <div className="title_3_sub mt-3">Room Type Name</div>
                <input type="text" className="form-control input_full" id="room_name"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F" }} value={roomName}
                    onChange={onChangeRoomName} />

                <div className="title_3_sub mt-3">Description</div>
                <textarea className={"text_area"} name="description" rows={5} value={description}
                    onChange={onChangeDescription} />

                <div className="title_3_sub mt-3">Room Size in Sqft</div>
                <input type="number" className="form-control input_half" id="sqfts"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "30%" }} value={sqft}
                    onChange={onChangeSqft} />

                <div className="title_3_sub mt-3">Number of Rooms</div>
                <input type="number" className="form-control input_half" id="num_of_rooms"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "30%" }} value={numOfRooms}
                    onChange={onChangeNumOfRooms} />


                <div className="title_3 mt-4">Bed Options</div>
                <div className={"subtext"} style={{ lineHeight: "20px" }}>Tell us only about the existing beds in a
                    room (don't include extra beds).
                </div>
                <div className="title_3_sub mt-3">Number of Single Beds</div>
                <input type="number" className="form-control input_half" id="numOfSingleBeds"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "30%" }} value={numOfSingleBeds}
                    onChange={onChangeNumOfSingleBeds} />
                <div className="title_3_sub mt-3">Number of Double Beds</div>
                <input type="number" className="form-control input_half" id="numOfDoubleBeds"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "30%" }} value={numOfDoubleBeds}
                    onChange={onChangeNumOfDoubleBeds} />
                <div className="title_3_sub mt-3">Number of Triple Beds</div>
                <input type="number" className="form-control input_half" id="numOfDoubleBeds"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "30%" }} value={numOfTripleBeds}
                    onChange={onChangeNumOfTripleBeds} />


               


                <div className="title_3 mt-4">Base price per day</div>
                <div className={"subtext"} style={{ lineHeight: "20px" }}>
                </div>

                <div className="title_3_sub mt-3">Price per day (EVR)</div>
                <input type="text" className="form-control input_half" id="price_per_day"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "50%" }} value={pricePerDay}
                    onChange={onChangePricePerDay} />
                <RoomFacilities onChange={onChangeFacility} />

                <div className={"row center_div pt-0"}>
                    <button className={"create_room_button"} style={{ width: "500px" }} onClick={onSubmitRoomModal} disabled={roomCreateDisabled}>
                        Create Room
                    </button>
                </div>


            </Card1>
        </div> )}
        </div>
    );
}

export default CreateRoomModal

 {/*  <div className={"row left_div"}>
                    <div className={"col"} style={{ width: "100%" }}>
                        <div className="title_3_sub mt-3">Bed Type</div>
                        <Dropdown isOpen={bedTypeDropDownOpen} toggle={toggleBedTypeDropDown}
                            className={"dropdown_bed_container"} style={{ height: "50px" }}>
                            <DropdownToggle caret
                                className={"dropdown_bed_type"} color={"black"}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <span style={{ textAlign: "left" }} className={"title_3_sub"}>{bedType}</span>

                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>

                                {bed_types.map((bed_type, index) => {
                                    return (
                                        <DropdownItem className="dropdown_items" key={index}>
                                            <div onClick={changeBedType.bind(this, bed_type.Name)}>{bed_type.Name}</div>
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className={"col"}>
                        <div className="title_3_sub mt-3">Number of Sleeps</div>
                        <input type="number" className="form-control input_full" id="num_of_beds"
                            style={{ backgroundColor: '#ffffff', borderColor: "#908F8F" }} value={numOfBeds}
                            onChange={onChangeNumOfBeds} />
                    </div>
                </div>*/}
