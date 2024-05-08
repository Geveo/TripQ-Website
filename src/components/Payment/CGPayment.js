import React, { useState } from 'react';
import axios from 'axios';

function CGPayment() {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [description, setDescription] = useState('');

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/payment', {
        amount,
        currency,
        description,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response.data:', response.data);
      setPaymentStatus(response.data);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment error. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Hotel Booking Payment</h1>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handlePayment}>Pay Now</button>
      <p>{paymentStatus}</p>
    </div>
  );
}

export default CGPayment;