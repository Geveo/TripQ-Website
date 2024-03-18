import hotelsData from "../../data/hotels";
import {Dropdown} from "reactstrap";
import React, {useState} from "react";
import DateFunctions from "../../helpers/DateFunctions";
import {FaCalendarAlt, FaCity, FaUsers, FaPlus, FaWindowMinimize} from "react-icons/fa";
import "./styles.scss"
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function SearchBar(props) {

    const navigate = useNavigate();
    const onChangeBedRooms = (isAdding) => {
        props.setBedRooms(prevState => {
            return (isAdding ? prevState + 1 : prevState - 1) >= 0 ? (isAdding ? prevState + 1 : prevState - 1) : 0;
        })
    }

    const onChangeSearchText = (event) => {
        props.setSearchText(event.target.value);
    }

    const onBackClick  = () =>{
        navigate(-1);
    }

    
    return (
        <section>
            <div className={"title_2"}>{props.hotelsData ? props.hotelsData.length : `No `} Hotels in {props.city}</div>
            <div className={"subtext"} style={{lineHeight: "15px"}}>Book your next stay at one of our properties</div>

            <div className={"row mt-4"}>
                <div className={"mb-3"} style={{width: "auto"}}>
                <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                            <span
                                className={"title_4 date_range_text"}>{props.searchCity}
                            </span>

                        <FaCity size={22} className={"mt-2"} style={{marginRight: "10px"}} color={"#908F8F"}/>

                    </Dropdown>
                   
                </div>

                <div className={"mb-3"} style={{width: "auto"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                            <span
                                className={"title_4 date_range_text"}>{DateFunctions.convertDateMonthDate(props.checkInDate)} - {DateFunctions.convertDateMonthDate(props.checkOutDate)}
                            </span>

                        <FaCalendarAlt size={22} className={"mt-2"} style={{marginRight: "10px"}} color={"#908F8F"}/>

                    </Dropdown>
                </div>

                <div className={"mb-3"} style={{width: "auto"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                        <span className={"title_4 people_text"}>{props.numOfPeople} Guests</span>
                        <FaUsers size={22} className={"mt-2"} style={{marginRight: "10px"}} color={"#908F8F"}/>

                    </Dropdown>
                </div>
                 <div className={"col-md-2 col-sm-3 mb-3"}  style={{width: "auto"}}>
                    <button className={"clear_button"} style={{maxWidth: "200px"}} onClick={onBackClick} >
                        <span className={"title_4"}>Back</span>
                    </button>
                </div> 
                

            </div>


        </section>
    )
}

export default SearchBar