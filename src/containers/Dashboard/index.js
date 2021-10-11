import React, { useState, useEffect } from 'react';
import { gql, useQuery } from "@apollo/client";
import { useEthers } from '@usedapp/core';

//COMPONENTS
import LeftNav from 'components/LeftNav';
import Feed from 'components/Feed';
import RightNav from 'components/RightNav';
import Notifications from 'components/Notifications';

//MODALS
import AddModal from 'components/AddModal';
import WalletModal from 'components/WalletModal';
import PrizeModal from 'components/PrizeModal';
import WrongNetworkModal from 'components/WrongNetworkModal';

//STYLES
import {
  Wrap, Body
} from './styles';

const GET_USER_UPVOTES = `
  query GetUserUpvotes($id: String!) {
    user(id: $id) {
      id
      upvotes {
        id
        postId
      }
    }
  }
`;

function Dashboard(props) {
  const paramId = props.match.params.id;
  const paramTime = props.match.params.time;
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [modal, setModal] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const { activateBrowserWallet, account, error } = useEthers();
  const { data: voteData } = useQuery(gql(GET_USER_UPVOTES), { variables: { id: account && account.toString().toLowerCase() } });

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
  },[voteData, account]);

  useEffect(() => {
    if (error && error.name === 'UnsupportedChainIdError') {
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
              userUpvotes={userUpvotes}
              setModal={(value) => {setModal(value)}}
            />
            <RightNav
              paramId={paramId}
              paramTime={paramTime}
              wrongNetwork={wrongNetwork}
              account={account}
              activateBrowserWallet={() => activateBrowserWallet()}
              setModal={(value) => setModal(value)}
            />
          </React.Fragment>
        }
      </Body>
      <Notifications pageLoadTime={props.pageLoadTime} />
      {
        modal === 'ADD' &&
        <AddModal paramId={paramId} closeModal={() => setModal(null)} />
      }
      {
        modal === 'WALLET' &&
        <WalletModal closeModal={() => setModal(null)} />
      }
      {
        modal === 'PRIZE' &&
        <PrizeModal closeModal={() => setModal(null)} />
      }
      {
        modal === 'WRONG-NETWORK' &&
        <WrongNetworkModal closeModal={() => setModal(null)} />
      }
    </Wrap>
  );
}

export default Dashboard;