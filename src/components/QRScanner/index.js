import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const QRScanner = ({ onClose, onScanSuccess }) => {
  useEffect(() => {
    function handleScanSuccess(decodedText, decodedResult) {
      onScanSuccess(decodedText);
      html5QrcodeScanner.clear();
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );
    html5QrcodeScanner.render(handleScanSuccess);
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
