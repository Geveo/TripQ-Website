import { Label } from "reactstrap";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

function SearchFacilities(props) {
  const [facilityNames, setFacilityNames] = useState(props.facilityNames);

  useEffect(() => {
    setFacilityNames(props.facilityNames);
  }, [props.facilityNames]);

  const rowsData = [];
  if (facilityNames) {
    for (let i = 0; i < facilityNames.length; i += 4) {
      const rowItems = facilityNames.slice(i, i + 4);
      rowsData.push(rowItems);
    }
  }
  const handleDelete = (nameToDelete) => {
    const updatedFacilityNames = facilityNames.filter(
      (name) => name !== nameToDelete
    );
    setFacilityNames(updatedFacilityNames);
    props.handleDelete(updatedFacilityNames);
  };

  return (
    <>
      {rowsData.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((name, index) => (
            <div key={index} className="cardStyle">
              <Label className="name-text">
                {name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Label>
              <FontAwesomeIcon
                size="lg"
                icon={faTimesCircle}
                className="fa fa-remove remove-icon"
                onClick={() => handleDelete(name)}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default SearchFacilities;
