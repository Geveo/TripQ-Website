import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import HotelService from "../../services-domain/hotel-service copy";
import Card1 from "../../layout/Card";
import { Label } from "reactstrap";
import toast from "react-hot-toast";

function HotelsList() {
  const [hotelsList, setHotelsList] = useState(null);
  const hotelService = HotelService.instance;

  useEffect(() => {
    const walletAddress = localStorage.getItem("Account");
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
                <tr style={{padding: 10}}>
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
                      <td>
                        <Link to={`/hotel/${hotel.id}`}>{hotel.name}</Link>
                      </td>
                      {hotel.location && (
                        <td>{JSON.parse(hotel.location).AddressLine01}</td>
                      )}
                      {hotel.contactDetails && (
                        <td>{JSON.parse(hotel.contactDetails).FullName}</td>
                      )}
                      {hotel.contactDetails && (
                        <td>{JSON.parse(hotel.contactDetails).Email}</td>
                      )}
                      {hotel.starRate && (
                        <td>{hotel.starRate} Stars</td>
                      )}
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
