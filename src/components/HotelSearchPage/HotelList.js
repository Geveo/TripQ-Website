import SearchHotelResult from "./SearchHotelResult";

function HotelList(props) {
    return (
        <>
            {props.data.map((hotel, index) => {
                return <SearchHotelResult hotel={hotel} numOfPeople={props.numOfPeople} onViewAvailableClicked={props.onViewAvailableClicked} key={index} />
            })}
        </>
    );
}

export default HotelList;
