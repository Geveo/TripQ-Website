import React from 'react';

const Step1 = ({ searchDetails, onNext }) => {
  const handleNext = () => {
    // Validate or process data if needed
    // Call onNext to proceed to the next step
    onNext();
  };

  return (
    <div>
      <h2>Step 1: Your Selection</h2>
      <p>Location: {searchDetails.location}</p>
      <p>Dates: {searchDetails.startDate} to {searchDetails.endDate}</p>
      {/* Add more details as needed */}
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Step1;
