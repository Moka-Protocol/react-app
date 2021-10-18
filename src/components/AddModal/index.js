import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Modal from 'react-modal';
import TagsInput from 'react-tagsinput';
import { CONTRACTS } from 'constants/constants';

//WEB3
import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts';

//CONTRACT ABIS
import MokaTokenABI from 'contracts/MokaToken.json';

//CACHE
import { updateAddPost } from 'cache/update';

//STYLES
import './tags.css';
import { InputWrap, Input, SubmitButton } from './styles';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '300px'
  },
};

Modal.setAppElement('#root');

const contract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN, new utils.Interface(MokaTokenABI))

function AddModal(props) {
  const client = useApolloClient();
  const [updateCache, setUpdateCache] = useState(false);
  const [tags, handleChange] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { state, send } = useContractFunction(contract, 'createPost', { transactionName: 'Add Post' })

  useEffect(() => {
    if (state.status === 'Mining' && updateCache === false) {
      setUpdateCache(true);
      updateAddPost(client, props.account, { title, desc, url, tags }, props.paramId, props.paramTime);
      props.closeModal();
    }
  },[state, updateCache, setUpdateCache, client, props, title, desc, url, tags]);

  const handleSubmit = (event) => {
    event.preventDefault();
    send(props.paramId.split('_')[1], BigNumber.from(6), title, desc, url, tags);
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
        <Input
          placeholder="URL"
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </InputWrap>
      <InputWrap>
        <Input
          placeholder="Title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </InputWrap>
      <InputWrap>
        <Input
          placeholder="Desc"
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)} 
        />
      </InputWrap>
      <TagsInput value={tags} onChange={handleChange} />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}><SubmitButton onClick={handleSubmit}>ADD</SubmitButton></div>
    </Modal>
  );
}

export default AddModal;