export class HotelDto {
    constructor({
        Id,
        Name,
        Description,
        StarRate,
        ContactDetails,
        Location,
        Facilities,
        ImageURLs,
        WalletAddress,
        PaymentOption,
        AccountDetails
    }){
        this.Id=Id;
        this.Name = Name;
        this.Description = Description;
        this.StarRate = StarRate;
        this.ContactDetails = ContactDetails;
        this.Location = Location;
        this.Facilities = Facilities;
        this.ImageURLs = ImageURLs;
        this.WalletAddress = WalletAddress;
        this.PaymentOption = PaymentOption;
        this.AccountDetails = AccountDetails;
    }
}




