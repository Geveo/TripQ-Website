import QRCode from "react-qr-code";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Card1 from "../../layout/Card";
import React, { useState } from "react";
import QRScanner from "../QRScanner";
import { Button } from "reactstrap";
import "./styles.scss";
import XrplService from "../../services-common/xrpl-service";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccessfully } from "../../features/LoginState/LoginStateSlice";

/**
 *
 * @param string  qrMessage : Message to be encoded
 * @param bool isOpen : Open and close the modal
 * @param callback onClose : A function to be called when closed manually
 * @returns
 */
const LoginModal = ({ isOpen, onClose }) => {
  const [showManualInput, setShowManualInput] = useState(true);
  const [manualInput, setManualInput] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const xrplService = XrplService.xrplInstance;

  const dispatch = useDispatch();

  const handleManualInput = (event) => {
    const inputText = event.target.value;
    setManualInput(inputText);
  };

  const handleScanSuccess = async (decodedText) => {
    setShowQRModal(false);
    setShowQRScanner(false);

    console.log(decodedText);
    if (decodedText !== "") {
      setManualInput(decodedText);
    }
  };

  const openQRScanner = () => {
    setShowQRScanner(true);
  };

  const handleLogin = () => {
    const isValidAddress = xrplService.isValidAddress(manualInput);
    if(isValidAddress){
      localStorage.setItem("Account", manualInput);
      toast.success("You have successfully logged in.");
      dispatch(loginSuccessfully(manualInput));
      setManualInput("");
      onClose(true);
    }else{
      toast.error("Invalid wallet address!")
    }
  };

  return (
    <Modal
      zIndex={9999}
      isOpen={isOpen}
      toggle={onClose}
      centered={true}
      backdrop={"static"}
      keyboard={false}
    >
      <ModalHeader toggle={onClose}>
        Sign in with your wallet address
        <div className="subtext">
          Upload your QR code or manually enter your wallet address.
        </div>
      </ModalHeader>
      <ModalBody>
        <Card1>
          {!showQRScanner && (
            <>
              <div style={{ textAlign: "center" }}>
                <label style={{ margin: 20, fontWeight: "bold" }}>
                  Enter Wallet Address :
                </label>
                <input
                  style={{ width: 400 }}
                  type="text"
                  placeholder="Enter Wallet Address"
                  value={manualInput}
                  onChange={handleManualInput}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <label style={{ fontWeight: "bold" }}>Or</label>
              </div>
            </>
          )}

          {showQRScanner && (
            <QRScanner onClose onScanSuccess={handleScanSuccess} />
          )}
          <div
            style={{
              textAlign: "center",
              marginTop: 1,
              marginBottom: 20,
            }}
          >
            {!showQRScanner && (<span className="clickable-text" onClick={openQRScanner}>
              Open QR Scanner
            </span>)}
          </div>
        </Card1>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button className="secondaryButton" onClick={handleLogin}>
            Submit
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default LoginModal;
