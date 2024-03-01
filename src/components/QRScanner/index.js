import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useEffect } from "react";

const QRScanner = ({ onClose, onScanSuccess }) => {
  useEffect(() => {
    function handleScanSuccess(decodedText, decodedResult) {
      onScanSuccess(decodedText);
      html5QrcodeScanner.clear();
    }

    function handleScanError(error) {
      if(typeof error === 'string' && error.startsWith('QR code parse error')){
        // console.log(error);
      } else {
        html5QrcodeScanner.clear();
      }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 , supportedScanTypes: [ Html5QrcodeScanType.SCAN_TYPE_FILE, Html5QrcodeScanType.SCAN_TYPE_CAMERA], rememberLastUsedCamera : false},
      false
    );
    html5QrcodeScanner.render(handleScanSuccess, handleScanError );
  }, [onClose, onScanSuccess]);

  return (
    <div>
      <h6>
        <div id="reader"></div>
      </h6>
    </div>
  );
};

export default QRScanner;
