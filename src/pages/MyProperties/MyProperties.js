import "./MyProperties.scss"
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import styles from "../../components/HeaderSectionLandingPageHotelOwner/index.module.scss";
// import {Button} from "reactstrap";
import {xummAuthorize} from "../../services-common/xumm-api-service";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export default function MyProperties() {
    const navigate = useNavigate();
    const loginState = useSelector(state => state.loginState)


    const registerHotel = async () => {
        if(!loginState.isLoggedIn) {
            if(await xummAuthorize()) {
                navigate("/register-hotel");
            }
        } else {
            navigate("/register-hotel");
        }
    };

    const viewHotelDetails = async () => {
        if(!loginState.isLoggedIn) {
            if(await xummAuthorize()) {
                navigate("/hotel-list");
            }
        } else {
            navigate("/hotel-list");
        }
    };


    return (
        <>
            <div className="background-image"></div>
            <Container className="content-container">
                <Row className="blue-box" style={{ textAlign:'center', fontSize: '20px'}}>
                    <Col className={`d-grid gap-2`}>
                        View your property list if registered.
                        <br />
                        <Button  className={`view-btn`} onClick={() => viewHotelDetails()}> List Properties</Button>
                    </Col>
                    <Col className={`d-grid gap-2`}>
                        To list your hotel, please register.
                        <br />
                        <Button  variant="outline-warning"  className={`register-btn box_button`} onClick={() => registerHotel()}> Register New</Button>

                    </Col>
                </Row>
                <Row className="blue-box mt-5" style={{}}>
                    <Col>
                        <Row>
                            <Col className="big-heading">
                                Your world worth sharing!
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr className="divider" />
                            </Col>
                        </Row>
                        {/*<Row>*/}
                        {/*    <Col className="big-heading">*/}
                        {/*        worth sharing!*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        <Row>
                            <Col className="descripto">
                                Are you a hotel owner looking to increase your bookings and reach a
                                wider audience? Look no further than our hotel booking website! With
                                our highly secure platform and state-of-the-art cryptographic
                                wallet, you can be sure that your information and transactions are
                                always safe and protected.
                                <br />
                                <br /> By listing your property on our platform, you'll have access
                                to a vast network of potential guests, allowing you to expand your
                                reach and increase your bookings. Our user-friendly interface makes
                                it easy to manage your listings and keep track of your reservations,
                                saving you time and hassle.
                                <br />
                                <br /> Plus, with our advanced booking and payment systems, you can
                                rest easy knowing that your payments will always be processed
                                quickly and securely. So why wait? Sign up today and start reaping
                                the benefits of our trusted and secure hotel booking platform.
                            </Col>


                                {/*<Card className="text-center mt-4 p-3">*/}
                                {/*    <Card.Text> You can see your property list here if you have already registered your properties.</Card.Text>*/}
                                {/*    <Button  className={`view-btn`} onClick={() => viewHotelDetails()}> List Properties</Button>*/}
                                {/*    <Card.Text className="mt-3">Or</Card.Text>*/}
                                {/*    <Card.Text> You wanner list your hotel with us? Please register here.</Card.Text>*/}
                                {/*    <Button  className={`register-btn`} onClick={() => registerHotel()}> Register New</Button>*/}
                                {/*</Card>*/}
                                {/*<div style={{ textAlign: 'center', height: '60px', marginTop: '60px', flex: '3'}}>*/}
                                {/*    <div style={{ textAlign: 'center', marginBottom:'10px'}}>*/}
                                {/*        You can see your property list here if you have already registered your*/}
                                {/*        properties.*/}
                                {/*    </div>*/}
                                {/*    <Button*/}
                                {/*        className={`primaryButton smallMarginTopBottom ${styles.buttonOverride}`}*/}
                                {/*        onClick={() => viewHotelDetails()}*/}
                                {/*    >*/}
                                {/*        List Properties*/}
                                {/*    </Button>*/}
                                {/*</div>*/}

                                {/*<div style={{ textAlign: 'center', height: '60px', marginTop: '60px', flex: '5'}}>*/}
                                {/*    <div style={{textAlign: 'center', fontSize: '14px',  marginBottom:'10px'}}>*/}
                                {/*        <span style={{ fontSize: '14px'}}>Or</span>*/}
                                {/*        <br />*/}
                                {/*        You wanner list your hotel with us? Please register here.*/}
                                {/*    </div>*/}
                                {/*    <Button*/}
                                {/*        className="secondaryButton smallMarginTopBottom"*/}
                                {/*        onClick={() => registerHotel()}*/}
                                {/*    >*/}
                                {/*        Register New*/}
                                {/*    </Button>*/}
                                {/*</div>*/}

                        </Row>
                    </Col>
                    {/*<Col lg={5} style={{ display: "flex"}}>*/}
                    {/*    <Card className="text-center mt-4 p-3  card-box">*/}
                    {/*        <Card.Text> You can see your property list here if you have already registered your properties.</Card.Text>*/}
                    {/*        <Button  className={`view-btn`} onClick={() => viewHotelDetails()}> List Properties</Button>*/}
                    {/*        <Card.Text className="mt-3">Or</Card.Text>*/}
                    {/*        <Card.Text> You wanner list your hotel with us? Please register here.</Card.Text>*/}
                    {/*        <Button  className={`register-btn`} onClick={() => registerHotel()}> Register New</Button>*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                </Row>
            </Container>

        </>
    )
}