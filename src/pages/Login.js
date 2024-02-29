import MainContainer from "../layout/MainContainer";
import Card1 from "../layout/Card";
import "../styles/text_styles.scss";
import "../styles/layout_styles.scss";
import React, { useState, useCallback, useEffect } from "react";
import QRScanner from "../components/QRScanner";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ToastInnerElement from "../components/ToastInnerElement/ToastInnerElement";
import TransactionQRModal from "../components/TransactionQRModal";
import HotelService from "./../services-domain/hotel-service copy";
import HotelsList from "./HotelsList";

function Login() {
  const navigate = useNavigate();

  const [showQRModal, setShowQRModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [showManualInput, setShowManualInput] = useState(true);
  const [ownerWalletAddress, setOwnerWalletAddress] = useState(
    "rsDEfCNEYbjGEje2fgqP1rRPVD7bmhih15"
  );

  const handleScanSuccess = async (decodedText) => {
    setScannedText(decodedText);

    setShowQRModal(false);
    setShowQRScanner(false);

    if (decodedText !== "") {
      localStorage.setItem("key", decodedText);
      navigate(`/`);
      toast.success("You have Successfully logged in");
    }
  };

  const openQRScanner = () => {
    setShowManualInput(false);
    setScannedText("");
    setShowQRScanner(true);
  };

  async function onCloseQRModel() {
    setShowQRModal(false);
  }

  const handleManualInput = (event) => {
    setManualInput(event.target.value);
    if (event.target.value.trim() !== "") {
      localStorage.setItem("key", manualInput.trim());
      navigate(`/`);
      toast.success("You have Successfully logged in");
    }
  };

  return (
    <>
      {showQRModal && (
        <TransactionQRModal
          isOpen={showQRModal}
          qrMessage={"contractWalletAddress"}
          onClose={onCloseQRModel}
        />
      )}
      <MainContainer>
        <section>
          <div className="title_2">
            Sign in with your wallet address
            <span style={{ color: "red" }}>*</span>
          </div>
          <div className="subtext">
            Upload the QR code or manually enter your wallet address.
          </div>
          <Card1>
            {showManualInput && (
              <>
                <div style={{ textAlign: "center" }}>
                  <label
                    style={{ margin: 20, fontWeight: "bold" }}
                    htmlFor="walletAddressInput"
                  >
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
            <div style={{ textAlign: "center" }}>
              {scannedText !== "" && (
                <h6>Your wallet address : {scannedText}</h6>
              )}
            </div>
            <div
              style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
            >
              <Button className="secondaryButton" onClick={openQRScanner}>
                Open QR Scanner
              </Button>
            </div>
          </Card1>
        </section>
      </MainContainer>
    </>
  );
}

export default Login;
