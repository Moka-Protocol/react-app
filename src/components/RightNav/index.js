import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { gql, useQuery } from "@apollo/client";
import { CONTRACTS, MOKA_LINKS } from 'constants/constants';
import { GET_USER_TOKEN_STATS } from 'gql/queries';

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
import { Wrap, Wallet, WalletRow, WalletLink, WalletRowBalance, WalletRowIcon, ClaimTokens, ClaimTokensIconWrap } from './styles';

const tokenSaleContract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE, new utils.Interface(MokaTokenSaleABI))

function RightNav(props) {
  const [buyState, setBuyState] = useState(0);

  const account = props.account;
  const wrongNetwork = props.wrongNetwork;
  const rewards = props.rewards;

  const { data: userData } = useQuery(gql(GET_USER_TOKEN_STATS), { variables: { id: account && account.toString().toLowerCase() }, skip: !account });
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
              ⛓️&nbsp;Connect Wallet
            </Wallet>
          }
          {
            account &&
            <Wallet>
              <WalletRow title={account} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', fontWeight: 600 }}>
                <WalletLink href={MOKA_LINKS[process.env.REACT_APP_ENV].user + account} target="_blank" rel="noreferrer">⛓️&nbsp;{account.substring(0, 8)}...</WalletLink>
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
                    <div>{(userData.user.tokenRewards / (10 ** 18)).toLocaleString()}</div>
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
                    <div>{(userData.user.tokenSpent / (10 ** 18)).toLocaleString()}</div>
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
      <Wallet>
        <WalletRow title={account} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', fontWeight: 600 }}>
        🎉&nbsp;Rewards
        </WalletRow>
        <WalletRow>
          <div>Today</div>
          <WalletRowBalance>
            {
              rewards[0] && rewards[0].postDayMapping &&
              <React.Fragment>{rewards[0].postDayMapping.rewards}</React.Fragment>
            }
            {
              rewards[0] && rewards[0].postDayMapping === null &&
              <React.Fragment>0</React.Fragment>
            }
            <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
          </WalletRowBalance>
        </WalletRow>
        <WalletRow>
          <div>This Week</div>
          <WalletRowBalance>
            {
              rewards[1] && rewards[1].postWeekMapping &&
              <React.Fragment>{rewards[1].postWeekMapping.rewards}</React.Fragment>
            }
            {
              rewards[1] && rewards[1].postWeekMapping === null &&
              <React.Fragment>0</React.Fragment>
            }
            <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
          </WalletRowBalance>
        </WalletRow>
        <WalletRow>
          <div>This Month</div>
          <WalletRowBalance>
            {
              rewards[2] && rewards[2].postMonthMapping &&
              <React.Fragment>{rewards[2].postMonthMapping.rewards}</React.Fragment>
            }
            {
              rewards[2] && rewards[2].postMonthMapping === null &&
              <React.Fragment>0</React.Fragment>
            }
            <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
          </WalletRowBalance>
        </WalletRow>
      </Wallet>
      <Wallet style={{ textAlign: 'center', fontWeight: 700, marginBottom: '15px' }} onClick={() => { props.setModal('ADD'); }}>ADD POST</Wallet>
    </Wrap>
  );
}

export default RightNav;