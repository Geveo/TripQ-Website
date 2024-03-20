import React from 'react'
import { Row, Col, Card } from "reactstrap";
import styles from "./index.module.scss";
const BookedHotelPrice = (props) => {
    return (
        <Card className={styles.bookedHotelCard}>
            <Row>
                <Col>
                    <h4>Price: {props.totalPrice*115000} {process.env.REACT_APP_CURRENCY}</h4>
                    { <small>{parseFloat(props.totalPrice).toFixed(6)} EVR</small> }
                </Col>
            </Row>
        </Card>
    )
}

export default BookedHotelPrice