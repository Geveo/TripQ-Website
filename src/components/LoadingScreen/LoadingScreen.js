import React from "react";
import { Modal } from "react-bootstrap";
import { Spinner } from "reactstrap";
import "./LoadingScreen.scss";

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
            <Spinner
              color="primary"
              style={{
                height: "3rem",
                width: "3rem",
              }}
              type="grow"
            />
            {props.screenLoaderText === "" ? "Loading.." : props.screenLoaderText}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoadingScreen;
