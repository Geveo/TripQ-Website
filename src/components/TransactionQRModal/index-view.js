// import { Modal, ModalHeader, ModalBody} from 'reactstrap';/
import {useEffect, useState} from "react";
import eventEmitter from "../../services-common/eventEmitter";
import {createPayload} from "../../services-common/xumm-api-service";
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';


/**
 *
 * @param isOpen Boolean | open the modal
 * @param onClose () => boolean | A function that takes a boolean parameter denoting the completion of transaction or not.
 * @param sourceAddress
 * @param destinationAddress
 * @param amount String | Amount to be transferred as a string
 * @param currency string
 * @param issuer string | Issuer address of the currency
 * @returns {JSX.Element}
 * @constructor
 */
const TransactionQRViewModal = ({ isOpen, onClose, sourceAddress, destinationAddress, amount, currency, issuer }) => {
  const [qRCodeImg, setQRCodeImg] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  const paymentResultCallback =  (event) => {
    // Return if signed or not signed (rejected)
    // setLastPayloadUpdate(JSON.stringify(event.data, null, 2))

    console.log(event)
    if (Object.keys(event.data).indexOf('signed') > -1 && event.data.signed) {
      eventEmitter.emit('PaymentResult', "Payment done")
      return true;
    } else if (Object.keys(event.data).indexOf('signed') > -1 && !event.data.signed) {
      eventEmitter.emit('PaymentResult', "Payment rejected")
      return true;
    }
    return true;
  }


  useEffect(() => {
    console.log("Use effect calls")
        setPaymentCompleted(false);
        createPayload(sourceAddress, destinationAddress, paymentResultCallback, amount, currency, issuer).then(payloadInfo => {
          console.log(payloadInfo)
          setQRCodeImg(payloadInfo.created.refs.qr_png);

          eventEmitter.on('PaymentResult', (message) => {
            if(message === "Payment done") {
              eventEmitter.off('PaymentResult');
              setPaymentCompleted(true);
              onClose(true)
            } else if(message === "Payment failed") {
              eventEmitter.off('PaymentResult');
              setPaymentCompleted(false);
              onClose(true)
            }
          })

        });


  }, [sourceAddress, destinationAddress,amount, currency, issuer]);

  const onModalClose = () => {
    onClose(paymentCompleted);
  }

    return (
      <Modal
        show={isOpen}
        centered={true}
        backdrop={"static"}
        keyboard={false}
             onHide={() => onModalClose()}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Complete the payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center", fontSize: '18px' }}>Please check your Xaman app's notification to approve the payment request.</div>
          <div style={{ textAlign: "center", fontSize: '14px' }}>Or <br /> you can  scan the below QR code to continue.</div>

          <div style={{ height: "auto", maxWidth: "512px", minHeight: "150px", width: "auto", display: 'flex', justifyContent: 'center', alignItems: "center"}}>
            {qRCodeImg ? <img src={qRCodeImg} width={'150px'} alt={"Payment QR"} /> : <Spinner style={{backgroundColor:'blue'}} animation="grow" />}
          </div>
        </Modal.Body>
            {/* <Modal.Footer>
                    <Button color="primary" onClick={onClose}>
                        Do Something
                    </Button>{' '}
                    <Button color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Modal.Footer> */}
      </Modal>
    );
}

export default TransactionQRViewModal;