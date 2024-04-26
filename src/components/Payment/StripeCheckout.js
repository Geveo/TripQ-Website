import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

//const stripePromise = loadStripe(process.env.CLIENT_KEY);
const StripeCheckout = (props) => {

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    console.log(process.env.STRIPE_PUB_CLIENT_KEY)
    setStripePromise(loadStripe(process.env.STRIPE_PUB_CLIENT_KEY))
    const value = {
      amount: props.totalPrice*100000000, 
      currency: "LKR"
    }

    console.log(value)
    fetch('http://localhost:4200/create-payment-intent', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res)
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
        console.log(data.clientSecret)
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /*function ontests() {
    fetch('http://localhost:4200/getTest')
      .then(response => response.json())
      .then(data => {
        // Handle the response data
        console.log(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error fetching data:', error);
      });
  }
 */

  const options = {
    clientSecret,
  };

  return (
    <div>
      {clientSecret && stripePromise && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm totalPrice={props.totalPrice} />
        </Elements>
      )}
    </div>
  );
}
export default StripeCheckout;
