import "../../styles/components_styles.scss";
import { useState } from "react";

const StarRating = (props) => {
  return (
    <div style={{ display: "inline", paddingLeft: 30 }}>
      <div style={{ display: "inline" }}>
        {[...Array(6)].map((star, index) => {
          index += 1;

          return index < 6 ? (
            <span
              key={index}
              className={`star ${
                index <= props.ratings ? "star_button_on" : "star_button_off"
              }`}
              style={{ color: index <= props.ratings ? "rgb(255, 215, 0)" : "" , fontSize: "30px"}}
            >
              &#9733;
            </span>
          ) : (
            <span
              key={index}
              className={"subtext"}
              style={{ fontSize: "14px" }}
            >
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
