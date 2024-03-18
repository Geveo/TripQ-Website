import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import HotelService from "../../services-domain/hotel-service copy";
import Card1 from "../../layout/Card";
import { Label } from "reactstrap";
import toast from "react-hot-toast";
import { LocalStorageKeys } from "../../constants/constants";

function HotelsList() {
  const [hotelsList, setHotelsList] = useState(null);
  const hotelService = HotelService.instance;

  useEffect(() => {
    const walletAddress = localStorage.getItem(LocalStorageKeys.AccountAddress);
    hotelService
      .getHotelsList(walletAddress)
      .then((data) => {
        if (data && data.length > 0) {
          console.log(data)
          setHotelsList(data);
        }
      })
      .catch((err) => {
        console.log(err.thrownError);
        toast.error("Error in fetching hotels list.");
      });
  }, []);

  return (
    <>
      <Container style={{paddingTop: 10}} fluid className="hotels-list bg-white rounded">
        <Card1>
          {hotelsList && hotelsList.length > 0 ? (
            <Table striped responsive>
              <thead>
                <tr style={{padding: 10, textAlign: 'center'}}>
                  <th>Hotel Name</th>
                  <th>Location</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Star Ratings</th>
                </tr>
              </thead>
              <tbody>
                {hotelsList &&
                  hotelsList.map((hotel) => (
                    <tr key={hotel.id}>
                      <td style={{ textAlign: 'center' }}>
                        <Link to={`/hotel/${hotel.id}`}>{hotel.name}</Link>
                      </td>
                     {/* Cann  uncomment when removing seeded data at the back end scripts
                      * {hotel.location && (
                        <td style={{ textAlign: 'center' }}>{JSON.parse(hotel.location).AddressLine01}</td>
                      )}
                      {hotel.contactDetails && (
                        <td style={{ textAlign: 'center' }}>{JSON.parse(hotel.contactDetails).FullName}</td>
                      )}
                      {hotel.contactDetails && (
                        <td style={{ textAlign: 'center' }}>{JSON.parse(hotel.contactDetails).Email}</td>
                      )}
                      {hotel.starRate>0 ? (
                        <td style={{ textAlign: 'center' }}>{hotel.starRate} Stars</td>
                      ):(
                        <td style={{ textAlign: 'center' }}> - </td>
                      )} */} 
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <Label>No hotels being registered here!</Label>
          )}
        </Card1>
      </Container>
      <br />
    </>
  );
}

export default HotelsList;
