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
import HotelsList from "./HotelsList"

function ScanQRCode() {
  const navigate = useNavigate();
  const hotelService = HotelService.instance;

  let user = "User";

  const [showQRModal, setShowQRModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const [ownerWalletAddress, setOwnerWalletAddress] = useState(
    "rsDEfCNEYbjGEje2fgqP1rRPVD7bmhih15"
  );

  const handleScanSuccess = async (decodedText) => {
    setScannedText(decodedText);

    setShowQRModal(false);
    setShowQRScanner(false);

    if (decodedText !== "") {
      localStorage.setItem("key", decodedText);
      console.log("Getting hotels list...")
      let res = await hotelService.getHotelsList(decodedText);
      if(res && res.length > 0){
        console.log("showing hotel list...")
        navigate(`/hotel-list`);
        return <HotelsList hotelsList={res} />;
      }
      console.log("res", res);
    }
  };

  const openQRScanner = () => {
    setScannedText("");
    setShowQRScanner(true);
  };

  async function onCloseQRModel() {
    setShowQRModal(false);
  }

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
            Scan Your QR Code<span style={{ color: "red" }}>*</span>
          </div>
          <div className="subtext">
            Upload the QR code of your wallet address or scan it directly with
            your camera
          </div>
          <Card1>
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

export default ScanQRCode;
