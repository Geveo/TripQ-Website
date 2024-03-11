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
    RoomTypeId,
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
    this.RoomTypeId = RoomTypeId;
    this.NoOfRooms = NoOfRooms;
  }
}
