import React, { useState, useEffect }  from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import { CONTRACTS, STABLECOINDECIMALS, LINKS } from 'constants/constants';

//WEB3
import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber'

//CONTRACT ABIS
import ERC20ABI from 'contracts/ERC20.json';
import MokaTokenSaleABI from 'contracts/MokaTokenSale.json';

//COMPONENTS
import USDC from 'assets/svgs/usdc';
import TERRA from 'assets/svgs/terra';
import FRAX from 'assets/svgs/frax';
import DAI from 'assets/svgs/dai';
import Loading from 'assets/svgs/loading';
import Info from 'assets/svgs/info';
import Checkmark from 'assets/svgs/checkmark';

//STYLES
import { Title, CoinOptions, CoinButton, CoinSVG, CoinName, SubmitButton, SubmitIconWrap, TXError } from './styles';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '375px'
  },
};

Modal.setAppElement('#root');

function SignupModal(props) {
  const [stable, setStable] = useState(null);
  const [txError, setTxError] = useState(null);
  const [txState, setTxProcess] = useState(0);

  const erc20Contract = stable ? new Contract(CONTRACTS[process.env.REACT_APP_ENV].ERC20[stable], new utils.Interface(ERC20ABI)) : null;
  const { send: sendApproval, state: stateApproval } = useContractFunction(erc20Contract, 'approve', { transactionName: 'Approve Stablecoin' });  

  const mokaTokenSaleContract = stable ? new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE, new utils.Interface(MokaTokenSaleABI)) : null;
  const { send: sendBuyMoka, state: stateBuyMoka } = useContractFunction(mokaTokenSaleContract, 'buy', { transactionName: 'Buy Moka Tokens' });  

  useEffect(() => {
    if (stateApproval.status === 'Mining') {
      setTxProcess(1);
    } else if (stateApproval.status === 'Success') {
      setTxProcess(2);
    } else if (stateApproval.status === 'Fail' || stateApproval.status === 'Exception') {
      setTxError('Blockchain Tx Error');
      setTimeout(function(){ setTxError(null); }, 2000);
      setTxProcess(0);
    }
  },[stateApproval]);

  useEffect(() => {
    if (stateBuyMoka.status === 'Mining') {
      setTxProcess(3);
    } else if (stateBuyMoka.status === 'Success') {
      props.closeModal();
    } else if (stateBuyMoka.status === 'Fail' || stateBuyMoka.status === 'Exception') {
      setTxError('Blockchain Tx Error');
      setTimeout(function(){ setTxError(null); }, 2000);
    }
  },[stateBuyMoka, props]);

  const approveERC20 = async() => {
    sendApproval(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE, (parseInt(props.priceBand[1]) * (10 ** STABLECOINDECIMALS[stable])).toString());
  }

  const transferERC20 = async() => {
    sendBuyMoka(BigNumber.from(props.priceBand[1]), stable);
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
      <div style={{ textAlign: 'center' }}>
        <div>
          <Title>Get {props.priceBand[0].toLocaleString()} Moka Tokens for ${props.priceBand[1].toLocaleString()}.<br />Select the Stablecoin for your transfer.</Title>
          <CoinOptions>
            <CoinButton isSelected={stable === 'usdc'} onClick={txState === 0 ? () => setStable('usdc') : null}>
              <CoinSVG><USDC size="24px" /></CoinSVG>
              <CoinName>USDC</CoinName>
            </CoinButton>
            <CoinButton isSelected={stable === 'frax'} onClick={txState === 0 ? () => setStable('frax') : null}>
              <CoinSVG><FRAX size="24px" /></CoinSVG>
              <CoinName>FRAX</CoinName>
            </CoinButton>
            <CoinButton isSelected={stable === 'dai'} onClick={txState === 0 ? () => setStable('dai') : null}>
              <CoinSVG><DAI size="24px" /></CoinSVG>
              <CoinName>DAI&nbsp;</CoinName>
            </CoinButton>
            <CoinButton isSelected={stable === 'ust'} onClick={txState === 0 ? () => setStable('ust') : null}>
              <CoinSVG><TERRA size="24px" /></CoinSVG>
              <CoinName>UST&nbsp;</CoinName>
            </CoinButton>
          </CoinOptions>
        </div>
        <SubmitButton
          hasSelection={stable !== null}
          onClick={(txState !== 2 && stable !== null) ? approveERC20 : null}
        >
          {
            txState === 0 &&
            <React.Fragment>1 - Approve ${props.priceBand[1].toLocaleString()} Transfer</React.Fragment>
          }
          {
            txState === 1 &&
            <React.Fragment>
              <SubmitIconWrap><Loading size="34px" /></SubmitIconWrap>
              <div>Waiting for Confirmation...</div>
              <ReactTooltip id="waiting" place="left" type="dark" effect='solid'>
                <div>Confirming transaction with the blockchain.<br />This make take a few seconds...</div>
              </ReactTooltip>
              <SubmitIconWrap data-tip data-for="waiting" style={{ marginLeft: '100px', marginRight: '5px' }}>
                <Info size="18px" />
              </SubmitIconWrap>
            </React.Fragment>
          }
          {
            (txState === 2 || txState === 3) &&
            <React.Fragment><SubmitIconWrap style={{ marginRight: '8px' }}><Checkmark /></SubmitIconWrap><div>Approved</div></React.Fragment>
          }
        </SubmitButton>
        <SubmitButton
          hasSelection={(txState === 2 || txState === 3)}
          onClick={txState === 2 ? transferERC20 : null}
        >
          {
            txState !== 3 &&
            <React.Fragment>2 - Get {props.priceBand[0].toLocaleString()} Moka Tokens</React.Fragment>
          }
          {
            txState === 3 &&
            <React.Fragment>
              <SubmitIconWrap><Loading size="34px" /></SubmitIconWrap>
              <div>Transfering Moka Tokens...</div>
              <ReactTooltip id="waiting2" place="left" type="dark" effect='solid'>
                <div>Confirming transaction with the blockchain.<br />This make take a few seconds...</div>
              </ReactTooltip>
              <SubmitIconWrap data-tip data-for="waiting2" style={{ marginLeft: '100px', marginRight: '5px' }}>
                <Info size="18px" />
              </SubmitIconWrap>
            </React.Fragment>
          }
        </SubmitButton>
        <a href={LINKS.TOKENDISTRIBUTION} target="_blank" style={{ fontSize: '0.85em', textDecoration: 'underline', color: '#707070' }} rel="noreferrer">Learn more about Moka Token distribution</a>
        {
          txError &&
          <TXError>{txError}</TXError>
        }
      </div>
    </Modal>
  );
}

export default SignupModal;