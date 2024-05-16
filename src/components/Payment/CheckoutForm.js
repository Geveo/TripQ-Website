import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { Col, Row, Label, Button, Form } from "reactstrap";
import { store } from "../../redux/store";
import { setShowScreenLoader } from "../../redux/screenLoader/ScreenLoaderSlice";
import ToastInnerElement from "../../components/ToastInnerElement/ToastInnerElement";
import { ReservationDto } from "../../dto/ReservationDto";
import { useSelector, useDispatch } from "react-redux";
import { LocalStorageKeys, DestinationTags } from "../../constants/constants";
import { toast } from "react-hot-toast";
import HotelService from "./../../services-domain/hotel-service copy";
import { remove as bookingCustomerRemove } from "../../redux/BookingCustomer/BookingCustomerSlice";

const CheckoutForm = () => {
  const hotelService = HotelService.instance;
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectionDetails = useSelector((state) => state.selectionDetails);
  const bookingCustomer = useSelector((state) => state.bookingCustomer);
  const state = useSelector(state => state); // Get the entire state

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let selectionData =
      selectionDetails[localStorage.getItem(LocalStorageKeys.AccountAddress)];

    if (!selectionData) {
      selectionData = JSON.parse(
        localStorage.getItem(LocalStorageKeys.HotelSelectionDetails)
      );
    }

    let customerData =
      bookingCustomer[localStorage.getItem(LocalStorageKeys.AccountAddress)];

    if (!customerData) {
      customerData = JSON.parse(
        localStorage.getItem(LocalStorageKeys.BookingCustomer)
      );
    }

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/my-reservations"
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error(error);
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
        } else {
          setMessage("An unexpected error occurred.");
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment Completed!", {
          duration: 10000,
        });
        // handleSuccess(paymentIntent);
        console.log("PaymentIntent details:", paymentIntent);

      }

    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleSuccess = async (paymentIntent) => {
    
        // Save relevant payment details to database
        /*  const paymentDetails = {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            // Add more relevant details as needed
          };
          
  
          let reservationData = new ReservationDto({
            HotelId: selectionData.HotelId,
            WalletAddress: localStorage.getItem(LocalStorageKeys.AccountAddress),
            Price: props.totalPrice,
            FromDate: selectionData.CheckIn,
            ToDate: selectionData.CheckOut,
            NoOfNights: selectionData.Nights,
            FirstName: customerData.firstName,
            LastName: customerData.lastName,
            Email: customerData.email,
            Telephone: customerData.phoneNo,
            RoomTypes: selectionData.RoomTypes,
            NoOfRooms: selectionData.NoOfRooms,
          });
  
          hotelService.makeReservation(reservationData).then((res) => {
            store.dispatch(setShowScreenLoader(false));
            if (res.rowId.lastId > 0) {
              toast.success("Tentative booking saved!", {
                duration: 10000,
              });
              localStorage.removeItem(LocalStorageKeys.HotelSelectionDetails);
              dispatch(
                bookingCustomerRemove( bookingCustomer.email)
              );
              navigate(`/my-reservations`);
            } else {
              toast(
                (element) => (
                  <ToastInnerElement
                    message={"Booking saving failed!"}
                    id={element.id}
                  />
                ),
                {
                  duration: Infinity,
                }
              );
            }
          });
          */
   }


  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
    

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 25, }}>
        <Button
          className="secondaryButton"
          style={{ width: "180px" }}
          type="submit"
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? "Loading..." : "Pay now"}
        </Button>
      </div>

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </Form>

    // </form>
  );
}

export default CheckoutForm;