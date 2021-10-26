import React, { useState, useEffect, useCallback } from 'react';
import { gql, useQuery } from "@apollo/client";
import { CONTRACTS } from 'constants/constants';
import { getCurrentTimeMappings } from 'constants/functions';
import { GET_USER_UPVOTES_IDS, GET_DAILY_REWARDS_COUNT, GET_WEEKLY_REWARDS_COUNT, GET_MONTHLY_REWARDS_COUNT } from 'gql/queries';

//WEB3
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { useContractCall } from '@usedapp/core';

//CONTRACT ABIS
import MokaTokenABI from 'contracts/MokaToken.json';
import MokaTokenSaleABI from 'contracts/MokaTokenSale.json';

//COMPONENTS
import LeftNav from 'components/LeftNav';
import RightNav from 'components/RightNav';

import Notifications from 'components/Notifications';
import Errors from 'components/Errors';

import Feed from 'components/Feed';
import Rewards from 'components/Rewards';
import ProfileActivity from 'components/Profile/Activity';
import ProfilePosts from 'components/Profile/Posts';
import ProfileLikes from 'components/Profile/Likes';

//MODALS
import AddModal from 'components/Modals/AddModal';
import PaymentModal from 'components/Modals/PaymentModal';
import WrongNetworkModal from 'components/Modals/WrongNetworkModal';

//STYLES
import { Body } from './styles';

const mappings = getCurrentTimeMappings();

function Dashboard(props) {
  const paramId = props.match.params.id;
  const paramTime = props.match.params.time;
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [modal, setModal] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [txError, setTxError] = useState(null);
  const { activateBrowserWallet, account, error } = useEthers();
  const { data: voteData, refetch } = useQuery(gql(GET_USER_UPVOTES_IDS), { variables: { id: account && account.toString().toLowerCase() }, skip: !account });

  const { data: dailyRewards } = useQuery(gql(GET_DAILY_REWARDS_COUNT), { variables: { id: mappings.daily } });
  const { data: weeklyRewards } = useQuery(gql(GET_WEEKLY_REWARDS_COUNT), { variables: { id: mappings.weekly } });
  const { data: monthlyRewards } = useQuery(gql(GET_MONTHLY_REWARDS_COUNT), { variables: { id: mappings.monthly } });

  const [tokenBalance] = useContractCall(account && {
    abi: new utils.Interface(MokaTokenABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN,
    method: 'balanceOf',
    args: [account]
  }) ?? []

  const [addressExists] = useContractCall(account && {
    abi: new utils.Interface(MokaTokenSaleABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE,
    method: 'addressUserMapping',
    args: [account]
  }) ?? []

  const priceBand = useContractCall(account && {
    abi: new utils.Interface(MokaTokenSaleABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].MOKATOKENSALE,
    method: 'getCurrentPriceBand',
    args: null
  }) ?? null

  //REFETCH ACCOUNT UPVOTES
  useEffect(() => {
    if (voteData) {
      if (voteData && voteData.user && voteData.user.upvotes && voteData.user.upvotes.length > 0 && voteData.user.id === account.toString().toLowerCase()) {
        let upvotes = [];
        for (var i = 0; i < voteData.user.upvotes.length; i++) {
          upvotes.push(voteData.user.upvotes[i].postId);
        }
        setUserUpvotes(upvotes);
      } else {
        setUserUpvotes([]);
      }
    } else {
      setUserUpvotes([]);
    }

    if (account && voteData && voteData.user) {
      if (account.toString().toLowerCase() !== voteData.user.id) {
        refetch();
      }
    }
  },[voteData, account, refetch]);

  //WRONG NETWORK
  useEffect(() => {
    if (
      (error && error.message && error.message.toLowerCase().replace(/\s/g, '').includes('unsupportedchain')) ||
      (error && error.name === 'UnsupportedChainIdError')
    ) {
      setWrongNetwork(true);
    }
  },[error]);

  const onTxErrorCallback = useCallback(error => {
    setTxError(error);
    setTimeout(function(){ setTxError(null); }, 2000);
  }, []);

  return (
    <React.Fragment>
      <LeftNav parentProps={props} />
      <Body>
        {
          props.match.url.startsWith('/feed') &&
          <Feed account={account} userUpvotes={userUpvotes} txErrorCallback={onTxErrorCallback} />
        }
        {
          props.match.url.startsWith('/rewards') &&
          <Rewards account={account} userUpvotes={userUpvotes} parentProps={props} txErrorCallback={onTxErrorCallback} />
        }
        {
          props.match.url.startsWith('/profile/activity') &&
          <ProfileActivity account={account} userUpvotes={userUpvotes} parentProps={props} txErrorCallback={onTxErrorCallback} />
        }
        {
          props.match.url.startsWith('/profile/posts') &&
          <ProfilePosts account={account} userUpvotes={userUpvotes} parentProps={props} txErrorCallback={onTxErrorCallback} />
        }
        {
          props.match.url.startsWith('/profile/likes') &&
          <ProfileLikes account={account} userUpvotes={userUpvotes} parentProps={props} txErrorCallback={onTxErrorCallback} />
        }
      </Body>
      <RightNav
        wrongNetwork={wrongNetwork}
        account={account}
        tokenBalance={tokenBalance}
        addressExists={addressExists}
        priceBand={priceBand}
        rewards={[dailyRewards, weeklyRewards, monthlyRewards]}
        activateBrowserWallet={() => activateBrowserWallet()}
        setModal={(value) => setModal(value)}
      />
      {
        txError &&
        <Errors error={txError} />
      }
      {
        !txError &&
        <Notifications pageLoadTime={props.pageLoadTime} />
      }
      {
        modal === 'ADD' &&
        <AddModal
          paramId={paramId}
          paramTime={paramTime}
          account={account}
          closeModal={() => setModal(null)}
        />
      }
      {
        modal === 'PAYMENT' &&
        <PaymentModal
          priceBand={priceBand}
          account={account}
          closeModal={() => setModal(null)} 
        />
      }
      {
        modal === 'WRONG-NETWORK' &&
        <WrongNetworkModal closeModal={() => setModal(null)} />
      }
    </React.Fragment>
  );
}

export default Dashboard;