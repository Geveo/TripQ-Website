import SearchHotelResult from "./SearchHotelResult";

function HotelList(props) {
  return (
    <>
      {props.data.map((hotel, index) => {
        return (
          <SearchHotelResult
            hotel={hotel}
            hotelDetails={props.hotelMap.get(hotel.Name)}
            numOfPeople={props.numOfPeople}
            onViewAvailableClicked={props.onViewAvailableClicked}
            key={index}
          />
        );
      })}
    </>
  );
}

export default HotelList;
