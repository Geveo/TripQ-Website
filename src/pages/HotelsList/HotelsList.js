import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import HotelService from "../../services-domain/hotel-service copy";
import Card1 from "../../layout/Card";
import { Label } from "reactstrap";
import toast from "react-hot-toast";
import { LocalStorageKeys } from "../../constants/constants";
import { Row, Col } from "reactstrap";

function HotelsList() {
  const [hotelsList, setHotelsList] = useState(null);
  const hotelService = HotelService.instance;

  useEffect(() => {
    const walletAddress = localStorage.getItem(LocalStorageKeys.AccountAddress);
    hotelService
      .getHotelsList(walletAddress)
      .then((data) => {
        if (data && data.length > 0) {
          console.log(data);
          setHotelsList(data);
        }
      })
      .catch((err) => {
        console.log(err.thrownError);
        toast.error("Error in fetching hotels list.");
      });
  }, []);

  const getFullAddress = (address1, address2, city) => {
    let address = address1 ?? "";
    address += address2 ? `, ${address2}` : "";
    address += city ? `, ${city}` : "";

    return address;
  };

  return (
    <>
      <Container style={{ minHeight: "35vh" }}>
        <Row>
          <Col lg={10}>
            <div
              className="page-header mt-4"
              style={{
                color: "rgb(44 44 118)",
                fontWeight: 700,
                fontSize: "50px",
                paddingBottom: "35px",
              }}
            >
              My Properties
            </div>
          </Col>
        </Row>
        {hotelsList && hotelsList.length > 0 ? (
          <Row className="mt-3">
            <Col>
              <Table striped bordered>
                <thead>
                  <tr style={{ padding: 10, textAlign: "center" }}>
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
                      <tr key={hotel.id} style={{ verticalAlign: "middle" }}>
                        <td style={{ textAlign: "center" }}>
                          <Link to={`/hotel/${hotel.id}`}>{hotel.name}</Link>
                        </td>

                        {hotel.location && (
                          <td style={{ textAlign: "center" }}>
                            {getFullAddress(
                              JSON.parse(hotel.location).AddressLine01,
                              JSON.parse(hotel.location).AddressLine02,
                              JSON.parse(hotel.location).City
                            )}
                          </td>
                        )}
                        {hotel.contactDetails && (
                          <td style={{ textAlign: "center" }}>
                            {JSON.parse(hotel.contactDetails).FullName}
                          </td>
                        )}
                        {hotel.contactDetails && (
                          <td style={{ textAlign: "center" }}>
                            {JSON.parse(hotel.contactDetails).Email}
                          </td>
                        )}
                        {hotel.starRate > 0 ? (
                          <td style={{ textAlign: "center" }}>
                            {hotel.starRate} Stars
                          </td>
                        ) : (
                          <td style={{ textAlign: "center" }}> - </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : (
          <Label>No hotels being registered here!</Label>
        )}
      </Container>
      <br />
    </>
  );
}

export default HotelsList;
