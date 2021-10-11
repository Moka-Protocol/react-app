import React, { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { gql, useQuery } from "@apollo/client";
import { useContractFunction, useContractCall } from '@usedapp/core';
import MokaTokenABI from 'contracts/MokaToken.json';
import MokaTokenSaleABI from 'contracts/MokaTokenSale.json';
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts';
import { CONTRACTS } from 'constants/constants';
import { getCurrentTimeMappings } from 'constants/functions';

//COMPONENTS
import Moka from 'assets/svgs/moka';

import {
  Wrap, Wallet, WalletRow, WalletRowBalance, WalletRowIcon, ClaimTokens, PrizePool, PoolRow, PoolRowAward, PoolRowIcon, Link
} from './styles';

const GET_USER_TOKEN_STATS = `
  query GetUserTokenStats($id: String!) {
    user(id: $id) {
      id
      tokenRewards
      tokenSpent
    }
  }
`;

const GET_DAILY_REWARDS = `
  query GetDailyRewards($id: String!) {
    forumPostDayMapping(id: $id) {
      id
      rewards
    }
  }
`;

const GET_WEEKLY_REWARDS = `
  query GetWeeklyRewards($id: String!) {
    forumPostWeekMapping(id: $id) {
      id
      rewards
    }
  }
`;

const GET_MONTHLY_REWARDS = `
  query GetMonthlyRewards($id: String!) {
    forumPostMonthMapping(id: $id) {
      id
      rewards
    }
  }
`;

const tokenSaleContract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE, new utils.Interface(MokaTokenSaleABI))

function RightNav(props) {
  const account = props.account;
  const wrongNetwork = props.wrongNetwork;

  const { data: userData } = useQuery(gql(GET_USER_TOKEN_STATS), { variables: { id: account && account.toString().toLowerCase() } });

  const [tokenBalance] = useContractCall({
    abi: new utils.Interface(MokaTokenABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN,
    method: 'balanceOf',
    args: [account]
  }) ?? []

  const [addressExists] = useContractCall({
    abi: new utils.Interface(MokaTokenSaleABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE,
    method: 'addressUserMapping',
    args: [account]
  }) ?? []

  const priceBand = useContractCall({
    abi: new utils.Interface(MokaTokenSaleABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE,
    method: 'getCurrentPriceBand',
    args: null
  }) ?? null

  const { state, send } = useContractFunction(tokenSaleContract, 'buy', { transactionName: 'Buy' })

  let mappings = getCurrentTimeMappings();

  const { data: dailyRewards } = useQuery(gql(GET_DAILY_REWARDS), { variables: { id: props.paramId.split('_')[0] + '_' + mappings.daily } });
  const { data: weeklyRewards } = useQuery(gql(GET_WEEKLY_REWARDS), { variables: { id: props.paramId.split('_')[0] + '_' + mappings.weekly } });
  const { data: monthlyRewards } = useQuery(gql(GET_MONTHLY_REWARDS), { variables: { id: props.paramId.split('_')[0] + '_' + mappings.monthly } });

  return (
    <Wrap>
      {
        wrongNetwork === true &&
        <Wallet
          style={{  alignItems: 'center', fontWeight: 600, background: '#da2d2b', color: '#fff', border: '1px solid #da2d2b' }}
          onClick={() => props.setModal('WRONG-NETWORK')}
        >
          Wrong Network
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
            <Wallet
              onClick={() => { /* props.setModal('WALLET') */ }}
            >
              <WalletRow style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', fontWeight: 500 }}>
                <div>⛓️&nbsp;&nbsp;{account.substring(0, 8)}...</div>
              </WalletRow>
              <WalletRow>
                <div>Balance</div>
                <WalletRowBalance>
                  {
                    tokenBalance &&
                    <div>{parseInt(utils.formatEther(tokenBalance)).toLocaleString()}</div>
                  }
                  <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
                </WalletRowBalance>
              </WalletRow>
              <WalletRow>
                <div>Rewards</div>
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
                <div>Spent</div>
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
                (addressExists && addressExists._hex === '0x00') && priceBand.length > 0 &&
                <ClaimTokens onClick={() => {
                  send(priceBand[0], BigNumber.from(1),null);
                }}>
                  Claim my {priceBand[0].toLocaleString()} Tokens for ${priceBand[1].toLocaleString()}!
                </ClaimTokens>
              }
            </Wallet>
          }
        </React.Fragment>
      }
      <PrizePool onClick={() => { /* props.setModal('PRIZE') */ }}>
        <PoolRow style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', fontWeight: 500 }}>
          <div>🎉&nbsp;&nbsp;Prize Pool</div>
        </PoolRow>
        <PoolRow>
          <div>Daily</div>
          <PoolRowAward>
            {
              dailyRewards && dailyRewards.forumPostDayMapping &&
              <div>{dailyRewards.forumPostDayMapping.rewards.toLocaleString()}</div>
            }
            {
              dailyRewards && !dailyRewards.forumPostDayMapping &&
              <div>0</div>
            }
            <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
          </PoolRowAward>
        </PoolRow>
        <PoolRow>
          <div>Weekly</div>
          <PoolRowAward>
            {
              weeklyRewards && weeklyRewards.forumPostWeekMapping &&
              <div>{weeklyRewards.forumPostWeekMapping.rewards.toLocaleString()}</div>
            }
            {
              weeklyRewards && !weeklyRewards.forumPostWeekMapping &&
              <div>0</div>
            }
            <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
          </PoolRowAward>
        </PoolRow>
        <PoolRow>
          <div>Monthly</div>
          <PoolRowAward>
            {
              monthlyRewards && monthlyRewards.forumPostMonthMapping &&
              <div>{monthlyRewards.forumPostMonthMapping.rewards.toLocaleString()}</div>
            }
            {
              monthlyRewards && !monthlyRewards.forumPostMonthMapping &&
              <div>0</div>
            }
            <WalletRowIcon><Moka size="12px" /></WalletRowIcon>
          </PoolRowAward>
        </PoolRow>
      </PrizePool>
      <Link>Leaderboard</Link>
      <Link>About Moka</Link>
      <Link>Built on ♦</Link>
    </Wrap>
  );
}

export default RightNav;