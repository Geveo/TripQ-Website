import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const ReservationForm = () => {
  const [step, setStep] = useState(1);
  const [reservationDetails, setReservationDetails] = useState({});
  const [searchDetails, setSearchDetails] = useState({});

  searchDetails = {
    Name: "Dinuda Resort",
    Address: "Sethawadiya Road , 61360 Kalpitiya, Sri Lanka",
    StarRate: 3,
    Facilities: [2,4,5]
  }

  const handleNext = (data) => {
    setReservationDetails((prevDetails) => ({ ...prevDetails, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  const handleConfirm = (finalDetails) => {
    // Handle final details, e.g., send to server, display confirmation, etc.
    console.log('Reservation confirmed:', finalDetails);
  };

  return (
    <div>
      {step === 1 && <Step1 searchDetails={searchDetails} onNext={handleNext} />}
      {step === 2 && <Step2 selectedDates={reservationDetails.selectedDates} location={reservationDetails.location} onNext={handleNext} />}
      {step === 3 && <Step3 reservationDetails={reservationDetails} onConfirm={handleConfirm} />}
    </div>
  );
};

export default ReservationForm;
