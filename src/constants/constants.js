const cancellation_policies = [
    {
        Id: 1,
        Name: "None"
    },
    {
        Id: 2,
        Name: "Free cancellation"
    },
    {
        Id: 3,
        Name: "Book without credit card"
    },
    {
        Id: 4,
        Name: "No prepayment"
    },
]

const bed_types = [
    {
        Id: 1,
        Name: "Single"
    },
    {
        Id: 2,
        Name: "Double"
    },
    {
        Id: 3,
        Name: "Queen"
    },
    {
        Id: 4,
        Name: "King"
    },

]

const LocalStorageKeys ={
    PublicKey: "public-key",
    PrivateKey: "private-key",
    AccountAddress: "account-address",
    XummPkceJwt: 'XummPkceJwt',
    pkce_state: 'pkce_state',
    HotelSelectionDetails: 'hotel-selection-details',
    BookingCustomer: 'booking-customer',
    AiHotelSearchResult: 'ai-hotel-search-result'
}

const XRPLAccountEventTypes = {
    PAYMENT: 'payment'
}

const PaymentResults = {
    COMPLETED: "completed",
    REJECTED: "rejected",
    ABORTED: "aborted"
}

const DestinationTags = {
    RESERVATION_PAYMENT: 1002
}

module.exports = {
    XRPLAccountEventTypes,
    LocalStorageKeys,
    bed_types,
    cancellation_policies,
    PaymentResults,
    DestinationTags
}

