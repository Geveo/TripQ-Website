import React, { useState, useEffect } from 'react';
import axios from 'axios'; import { Col, Form, Row, FormGroup, Label, Button, Input, FormFeedback, } from "reactstrap";
import Card1 from "../../layout/Card";

function CGPayment(props) {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [description, setDescription] = useState('');
  const [redirectUrl, setRedirectUrl] = useState(null);
 // const currencyOptions = ['USD', 'EUR', 'BTC']; // Array of currency options


  useEffect(() => {
    setAmount((props.totalPrice * 115000).toFixed(2))
     setCurrency('USD')
   // setCurrency(currencyOptions[0])
   handlePayment()
  }, [amount,currency]);


  const handlePayment = async () => {
    try {
      console.log(amount)
      console.log(currency)
      //const response = await axios.post('http://localhost:4200/api/payment', {
        const response = await axios.post('https://tripq-webapi.azurewebsites.net/api/payment', {
        amount,
        currency,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response.data:', response.data);
      setRedirectUrl(response.data.paymentUrl);

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect the user
        return null; // Render nothing if redirecting
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment error. Please try again later.');
    }
  };

  // return (
  //   <Card1>
  //     <div>
  //       <h1>Hotel Booking Payment</h1>
  //       {/* <Form onSubmit={handlePayment}> */}
  //         <Row>
  //           <Col md={6}>
  //             <FormGroup>
  //               <Label for="price">
  //                 Price <span style={{ color: "red" }}>*</span>
  //               </Label>
  //               <Input
  //                 id="price"
  //                 name="price"
  //                 type="number"
  //                 value={amount}
  //                 onChange={(e) => setAmount(e.target.value)}
  //                 disabled={amount}
  //               />
  //             </FormGroup>
  //           </Col>
  //           <Col md={6}>
  //             <FormGroup>
  //               <Label for="currency">
  //                 Currency
  //               </Label>


  //               <Input
  //                 type="select"
  //                 name="currency"
  //                 id="currency"
  //                 value={currency}
  //                 onChange={(e) => setCurrency(e.target.value)}
  //               >
  //                 {currencyOptions.map(option => (
  //                   <option key={option} value={option}>{option}</option>
  //                 ))}
  //               </Input>
  //               {/* <Input
  //                 id="currency"
  //                 name="currency"
  //                 type="text"
  //                 value={currency}
  //                 onChange={(e) => setCurrency(e.target.value)}
  //               /> */}
  //             </FormGroup>
  //           </Col>
  //         </Row>
  //         <Row>

  //           <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 25, }}>
  //             <Button
  //               className="secondaryButton"
  //               style={{ width: "180px" }}
  //               onClick={handlePayment}
  //             >
  //               Pay now
  //             </Button>
  //           </div>
  //         </Row>

  //         {/* 
  //     
  //         <p>{paymentStatus}</p>

  //       {/* </Form> */}
  //     </div>
  //   </Card1>
  // );
}

export default CGPayment;