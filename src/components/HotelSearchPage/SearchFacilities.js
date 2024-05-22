import { Label } from 'reactstrap';
import React, { useState } from 'react';
import "./styles.scss";

function SearchFacilities(props) {
  const rowsData = [];
  const [facilityNames, setFacilityNames] = useState(props.facilityNames);

  // Group facility names into rows of three
  for (let i = 0; i < props.facilityNames.length; i += 3) {
    const rowItems = props.facilityNames.slice(i, i + 3);
    rowsData.push(rowItems);
  }

  console.log("RowData:", rowsData);
  const handleDelete = (nameToDelete) => {
    console.log("eeeee")
    setFacilityNames(facilityNames.filter(name => name !== nameToDelete));
  };
  return (
    <>
     {rowsData.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((name, index) => (
            <div key={index} className="cardStyle">
              
              <Label className='name-text'>{name}</Label>
              <span className="deleteIcon" onClick={() => handleDelete(name)}>&times;</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default SearchFacilities;
