import './styles.scss'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useEffect, useState} from "react";
import ReservationService from "../../services-domain/reservation-service";
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import {useSelector} from "react-redux";

const ViewCustomerReservations = () => {
    const [reservationList, setReservationList] = useState([]);
    const loginState = useSelector(state => state.loginState)

    const getReservationList = async (filteringAddress) => {
        const _reservationService = new ReservationService();
        const reservationsRes = await _reservationService.getReservations(0, filteringAddress);
        return reservationsRes;
    }

    useEffect(() => {
        getReservationList(loginState.loggedInAddress).then(res => {
            if(res && res.length > 0) {
                setReservationList(res);
                console.log(res)
            } else {
                setReservationList([]);
            }
        }).catch(e => {
            console.log(e)
        })
    }, [loginState]);


    return (
        <>
            <Container style={{minHeight: '85vh'}}>
                <Row>
                    <Col lg={10}>
                        <div className='page-header mt-4' style={{color: 'rgb(44 44 118)', fontWeight: 600, fontSize: '40px'}}>
                            My Reservations
                        </div>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col>
                        <Table striped bordered>
                            <thead>
                                <tr style={{textAlign: 'center'}}>
                                    <th>Hotel</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>No. of nights</th>
                                    <th>Room details</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                            {reservationList.map(rs => {
                                return (
                                    <tr key={rs.Id} style={{textAlign: 'center'}}>
                                        <td style={{ width: '25%'}}>{rs.HotelName}</td>
                                        <td style={{ width: '12%'}}>{rs.FromDate}</td>
                                        <td style={{ width: '12%'}}>{rs.ToDate}</td>
                                        <td style={{ width: '10%'}}>{rs.NoOfNights}</td>
                                        <td>
                                            <Card style={{ backgroundColor: '#ffffff00', border: 'solid #c4c4c4 1px'}}>
                                                <Card.Body style={{ backgroundColor: '#ffffff00', padding: '5px'}}>
                                                    {rs.rooms.map(rm => {
                                                        return (
                                                            <Row key={rm.RoomTypeId}>
                                                                <Col>{rm.Code} &nbsp;&nbsp;&nbsp;&nbsp;x{rm.NoOfRooms}</Col>
                                                            </Row>
                                                        )
                                                    })}

                                                </Card.Body>
                                            </Card>
                                        </td>
                                        <td style={{ width: '12%'}}>{rs.Price}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ViewCustomerReservations;