import QRCode from "react-qr-code";
import { Modal, ModalHeader, ModalBody} from 'reactstrap';

/**
 * 
 * @param string  qrMessage : Message to be encoded 
 * @param bool isOpen : Open and close the modal
 * @param callback onClose : A function to be called when closed manually
 * @returns 
 */
const TransactionQRModal = ({ qrMessage, isOpen, onClose }) => {

    return (
      <Modal zIndex={9999}
        isOpen={isOpen}
        toggle={onClose}
        centered={true}
        backdrop={"static"}
        keyboard={false}
      >
        <ModalHeader toggle={onClose}>
          Scan using Xaman wallet to pay
        </ModalHeader>
        <ModalBody>
          <div style={{ height: "auto", maxWidth: "512px", width: "auto"}}>
            <QRCode
              size={512}
              style={{ height: "256px", maxWidth: "100%", width: "100%", marginTop: "50" , marginBottom: "50"}}
              value={qrMessage}
              viewBox={`0 0 256 256`}
            />
          </div>
        </ModalBody>
            {/* <ModalFooter>
                    <Button color="primary" onClick={onClose}>
                        Do Something
                    </Button>{' '}
                    <Button color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter> */}
      </Modal>
    );
}

export default TransactionQRModal;