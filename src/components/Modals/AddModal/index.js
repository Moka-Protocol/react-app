import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Modal from 'react-modal';
import TagsInput from 'react-tagsinput';
import { CONTRACTS } from 'constants/constants';

//WEB3
import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';

//CONTRACT ABIS
import MokaTokenABI from 'contracts/MokaToken.json';

//CACHE
import { updateAddPost } from 'cache/update';

//STYLES
import './tags.css';
import { InputWrap, TextArea, SubmitButton, TXError } from './styles';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px'
  },
};

Modal.setAppElement('#root');

const contract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN, new utils.Interface(MokaTokenABI));

function AddModal(props) {
  const client = useApolloClient();
  const [updateCache, setUpdateCache] = useState(false);
  const [tags, handleChange] = useState([]);
  const [text, setText] = useState('');
  const [txError, setTxError] = useState(null);
  const { state, send } = useContractFunction(contract, 'createPost', { transactionName: 'Add Post' })

  useEffect(() => {
    if (state.status === 'Mining' && updateCache === false) {
      setUpdateCache(true);
      updateAddPost(client, props.account, { text, tags });
      props.closeModal();
    } else if (state.status === 'Fail' || state.status === 'Exception') {
      if (state.errorMessage === 'execution reverted: ERC20: transfer amount exceeds balance') {
        setTxError('Not enough tokens');
      } else {
        setTxError(state.errorMessage);
      }

      setTimeout(function(){ setTxError(null); }, 2000);
    }
  },[state, updateCache, setUpdateCache, client, props, text, tags]);

  const handleSubmit = (event) => {
    event.preventDefault();
    send(text, tags);
  }

  return (
    <Modal
      style={customStyles}
      isOpen={true}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      overlayClassName="ModalOverlay"
      onRequestClose={props.closeModal}
    >
      <InputWrap>
        <TextArea
          placeholder="What's up"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </InputWrap>
      <TagsInput value={tags} onChange={handleChange} />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}><SubmitButton onClick={handleSubmit}>ADD</SubmitButton></div>
      {
        txError &&
        <TXError>TX Error: {txError}</TXError>
      }
    </Modal>
  );
}

export default AddModal;