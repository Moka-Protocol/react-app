import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { gql, useQuery } from "@apollo/client";
import { CONTRACTS, LINKS, MOKALINKS } from 'constants/constants';

//WEB3
import { utils } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts';

//CONTRACT ABIS
import MokaTokenSaleABI from 'contracts/MokaTokenSale.json';

//COMPONENTS
import Moka from 'assets/svgs/moka';
import Loading from 'assets/svgs/loading';
import Info from 'assets/svgs/info';

//STYLES
import { Wrap, Wallet, WalletRow, WalletRowBalance, WalletRowIcon, ClaimTokens, ClaimTokensIconWrap, Link } from './styles';

const GET_USER_TOKEN_STATS = `
  query GetUserTokenStats($id: String!) {
    user(id: $id) {
      id
      tokenRewards
      tokenSpent
    }
  }
`;

const tokenSaleContract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE, new utils.Interface(MokaTokenSaleABI))

function RightNav(props) {
  const [buyState, setBuyState] = useState(0);

  const account = props.account;
  const wrongNetwork = props.wrongNetwork;

  const { data: userData } = useQuery(gql(GET_USER_TOKEN_STATS), { variables: { id: account && account.toString().toLowerCase() } });
  const { send, state } = useContractFunction(tokenSaleContract, 'buy', { transactionName: 'Buy' })

  useEffect(() => {
    if (state.status === 'Mining') {
      setBuyState(1);
    } else if (state.status === 'Fail' || state.status === 'Exception') {
      setBuyState(0);
    }
  },[state]);

  return (
    <Wrap>
      {
        wrongNetwork === true &&
        <Wallet
          style={{  alignItems: 'center', fontWeight: 600, background: '#da2d2b', color: '#fff', border: '1px solid #da2d2b' }}
          onClick={() => props.setModal('WRONG-NETWORK')}
        >
          NETWORK
        </Wallet>
      }
      {
        wrongNetwork === false &&
        <React.Fragment>
          {
            !account &&
            <Wallet
              style={{ alignItems: 'center', fontWeight: 600 }}
              onClick={() => props.activateBrowserWallet()}
            >
              ⛓️&nbsp;&nbsp;Connect Wallet
            </Wallet>
          }
          {
            account &&
            <Wallet>
              <WalletRow title={account} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', fontWeight: 500 }}>
                <a href={MOKALINKS[process.env.REACT_APP_ENV].USERS + account} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>⛓️&nbsp;&nbsp;{account.substring(0, 8)}...</a>
              </WalletRow>
              <WalletRow>
                <div>Balance</div>
                <WalletRowBalance>
                  {
                    props.tokenBalance &&
                    <div>{parseInt(utils.formatEther(props.tokenBalance)).toLocaleString()}</div>
                  }
                  <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
                </WalletRowBalance>
              </WalletRow>
              <WalletRow>
                <div>Won</div>
                <WalletRowBalance>
                  {
                    userData && userData.user && userData.user.tokenRewards &&
                    <div>{userData.user.tokenRewards.toLocaleString()}</div>
                  }
                  {
                    userData && !userData.user &&
                    <div>0</div>
                  }
                  <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
                </WalletRowBalance>
              </WalletRow>
              <WalletRow>
                <div>Used</div>
                <WalletRowBalance>
                  {
                    userData && userData.user && userData.user.tokenSpent &&
                    <div>{userData.user.tokenSpent.toLocaleString()}</div>
                  }
                  {
                    userData && !userData.user &&
                    <div>0</div>
                  }
                  <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
                </WalletRowBalance>
              </WalletRow>
              {
                (props.addressExists && props.addressExists._hex === '0x00') && props.priceBand.length > 0 &&
                <ClaimTokens onClick={() => {
                  if (buyState !== 1) {
                    if (props.priceBand[1] === 0) {
                      send(props.priceBand[0], BigNumber.from(1),null);
                    } else {
                      props.setModal('PAYMENT');
                    }
                  }
                }}>
                  {
                    buyState === 0 &&
                    <React.Fragment>Claim my {props.priceBand[0].toLocaleString()} Tokens for ${props.priceBand[1].toLocaleString()}!</React.Fragment>
                  }
                  {
                    buyState === 1 &&
                    <React.Fragment>
                      <ClaimTokensIconWrap>
                        <Loading size="30px" />
                      </ClaimTokensIconWrap>
                      <div>Waiting...</div>
                      <ReactTooltip id="waiting" place="top" type="dark" effect='solid'>
                        <div>Confirming transaction with the blockchain.<br />This make take a few seconds...</div>
                      </ReactTooltip>
                      <ClaimTokensIconWrap data-tip data-for="waiting" style={{ marginLeft: 'auto', marginRight: '5px' }}>
                        <Info size="18px" />
                      </ClaimTokensIconWrap>
                    </React.Fragment>
                  }
                </ClaimTokens>
              }
            </Wallet>
          }
        </React.Fragment>
      }
      <Wallet style={{ textAlign: 'center', fontWeight: 700, marginBottom: '15px' }} onClick={() => { props.setModal('ADD'); }}>ADD POST</Wallet>
      <Link href={MOKALINKS[process.env.REACT_APP_ENV].LEADERBOARD} target="_blank" rel="noreferrer">Leaderboard</Link>
      <Link href={LINKS.ABOUT} target="_blank" rel="noreferrer">About Moka</Link>
      <Link href="https://www.ethereum.org" target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '5px' }}>
        <div>Built on ♦</div>
        <div style={{ fontSize: '0.8em' }}>(Polygon Network)</div>
      </Link>
    </Wrap>
  );
}

export default RightNav;