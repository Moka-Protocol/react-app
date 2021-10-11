import React from 'react';
import Modal from 'react-modal';

//STYLES
import { } from './styles';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

function WalletModal(props) {
  return (
    <Modal
      style={customStyles}
      isOpen={true}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      overlayClassName="ModalOverlay"
      onRequestClose={props.closeModal}
    >
      <div>(i) Metamask</div>
    </Modal>
  );
}

export default WalletModal;