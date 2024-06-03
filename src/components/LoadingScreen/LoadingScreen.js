import React from "react";
import { Modal } from "react-bootstrap";
import "./LoadingScreen.scss";
import loadingGif from "../../Assets/Gifs/tripQ.gif";

const LoadingScreen = (props) => {
  return (
    <>
      <Modal
        show={props.showLoadPopup}
        centered
        dialogClassName="custom-modal-width"
      >
        <Modal.Body>
          <div className="spinnerWrapper">
            <img
              src={loadingGif}
              alt="Loading..."
              style={{
                height: "3rem",
                width: "3rem",
              }}
            />
            <div>
              {props.screenLoaderText === "" ? "Loading.." : props.screenLoaderText}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoadingScreen;
