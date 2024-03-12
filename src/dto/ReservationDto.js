export class ReservationDto {
  constructor({
    HotelId,
    WalletAddress,
    Price,
    FromDate,
    ToDate,
    NoOfNights,
    FirstName,
    LastName,
    Email,
    Telephone,
    RoomTypes,
    NoOfRooms
  }) {
    this.HotelId = HotelId;
    this.WalletAddress = WalletAddress;
    this.Price = Price;
    this.FromDate = FromDate;
    this.ToDate = ToDate;
    this.NoOfNights = NoOfNights;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Email = Email;
    this.Telephone = Telephone;
    this.RoomTypes = RoomTypes;
    this.NoOfRooms = NoOfRooms;
  }
}
