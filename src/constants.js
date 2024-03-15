const RequestTypes = {
    HOTEL: "Hotel",
    ROOM: "Room",
    CUSTOMER: "Customer",
    RESERVATION: "Reservation"
}

const RequestSubTypes = {
    REGISTER_HOTEL: "RegisterHotel",
    REQUEST_TOKEN_OFFER: "RequestTokenOffer",
    REGISTRATION_CONFIRMATION: "RegistrationConfirmation",
    GET_HOTELS: "GetHotels",
    DEREG_HOTEL: "DeregHotel",
    RATE_HOTEL: "RateHotel",
    IS_REGISTERED_HOTEL: "IsRegisteredHotel",
    SEARCH_HOTELS_WITH_ROOM: "SearchHotelsWithRooms",
    GET_SINGLE_HOTEL_WITH_ROOMS: "GetSingleHotelWithRooms",
    GET_HOTELS_BY_WALLET_ADDRESS: "GetHotelsListByWalletAddress",
    GET_HOTEL_IMAGES_BY_ID: "GetHotelImagesById",

    GET_ROOMS: "GetRooms",
    GET_ROOMS_BY_HOTELID: "GetRoomTypes",
    GET_ROOMTYPE_BY_ID: "GetRoomTypeById",
    CREATE_ROOMTYPE: "CreateRoomType",
    EDIT_ROOM: "EditRoom",
    DELETE_ROOM: "DeleteRoom",

    CREATE_CUSTOMER: "CreateCustomer",
    EDIT_CUSTOMER: "EditCustomer",
    DELETE_CUSTOMER: "DeleteCustomer",
    GET_CUSTOMERS: "GetCustomers",

    MAKE_RESERVATIONS: "MakeReservations",
    GET_RESERVATIONS: "GetReservations",
    DELETE_RESERVATION: "DeleteReservation"

}

const FacilityStatuses = {
    AVAILABLE: "Available",
    UNAVAILABLE: "UnAvaialble",
}

module.exports = {
    RequestTypes,
    RequestSubTypes,
    FacilityStatuses
}