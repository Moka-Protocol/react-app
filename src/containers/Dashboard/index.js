import React, { useState, useEffect } from 'react';
import { gql, useQuery } from "@apollo/client";
import { CONTRACTS } from 'constants/constants';
import { GET_USER_UPVOTES } from 'gql/queries';

//WEB3
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { useContractCall } from '@usedapp/core';

//CONTRACT ABIS
import MokaTokenABI from 'contracts/MokaToken.json';
import MokaTokenSaleABI from 'contracts/MokaTokenSale.json';

//COMPONENTS
import LeftNav from 'components/LeftNav';
import Feed from 'components/Feed';
import RightNav from 'components/RightNav';
import Notifications from 'components/Notifications';

//MODALS
import AddModal from 'components/AddModal';
import PaymentModal from 'components/PaymentModal';
import WrongNetworkModal from 'components/WrongNetworkModal';

//STYLES
import { Wrap, Body } from './styles';

function Dashboard(props) {
  const paramId = props.match.params.id;
  const paramTime = props.match.params.time;
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [modal, setModal] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const { activateBrowserWallet, account, error } = useEthers();
  const { data: voteData, refetch } = useQuery(gql(GET_USER_UPVOTES), { variables: { id: account && account.toString().toLowerCase() } });

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

  useEffect(() => {
    if (
      (error && error.message && error.message.toLowerCase().replace(/\s/g, '').includes('unsupportedchain')) ||
      (error && error.name === 'UnsupportedChainIdError')
    ) {
      setWrongNetwork(true);
    }
  },[error]);

  return (
    <Wrap>
      <Body>
        <LeftNav
          paramId={paramId}
          paramTime={paramTime}
          parentProps={props}
        />
        {
          paramId &&
          <React.Fragment>
            <Feed
              paramId={paramId}
              paramTime={paramTime}
              account={account}
              userUpvotes={userUpvotes}
              setModal={(value) => {setModal(value)}}
            />
            <RightNav
              paramId={paramId}
              paramTime={paramTime}
              wrongNetwork={wrongNetwork}
              account={account}
              tokenBalance={tokenBalance}
              addressExists={addressExists}
              priceBand={priceBand}
              activateBrowserWallet={() => activateBrowserWallet()}
              setModal={(value) => setModal(value)}
            />
          </React.Fragment>
        }
      </Body>
      <Notifications pageLoadTime={props.pageLoadTime} />
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
    </Wrap>
  );
}

export default Dashboard;