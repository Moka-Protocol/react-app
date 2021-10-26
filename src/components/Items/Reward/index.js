import React, { useEffect, useState } from 'react';
import anchorme from "anchorme";
import { useApolloClient } from '@apollo/client';
import { CONTRACTS, MOKA_LINKS } from 'constants/constants';
import { getDisplayForTimestamp } from 'constants/functions';

//WEB3
import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';

//CONTRACT ABIS
import MokaTokenABI from 'contracts/MokaToken.json';

//CACHE
import { updateUpvote } from 'cache/update';

//COMPONENTS
import Moka from 'assets/svgs/moka';
import Love from 'assets/svgs/love';

//STYLES
import { Wrap, Rank, Body, Vote, BodyTop, UserLink, PostLink, BodyMedium, BodyBottom } from './styles';

const contract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN, new utils.Interface(MokaTokenABI))

function Reward(props) {
  const post = (props.type === 'settled') ? props.item.post : props.item;
  const client = useApolloClient();
  const [updateCache, setUpdateCache] = useState(false);
  const { state, send } = useContractFunction(contract, 'upvotePost', { transactionName: 'UpVote' })
  const propsCallback = props.txErrorCallback;

  useEffect(() => {
    if (state.status === 'Mining' && updateCache === false) {
      setUpdateCache(true);
      updateUpvote(client, props.account, post);
    }

    if (state.status === 'Exception') {
      if (state.errorMessage === 'execution reverted: User Already Upvoted') {
        propsCallback('already_upvoted');
      } else if (state.errorMessage === 'execution reverted: ERC20: transfer amount exceeds balance') {
        propsCallback('insufficient_funds');
      } else if (state.errorMessage === 'execution reverted: Cannot Upvote Own Post') {
        propsCallback('cant_upvote_own_post');
      } else if (state.errorMessage === 'unknown account #0') {
        propsCallback('not_connected');
      } else {
        propsCallback('error');
      }
    }
  },[state, updateCache, setUpdateCache, client, props.account, post, propsCallback]);

  return (
    <Wrap>
      {
        (props.type === 'settled' || props.index < 10) &&
        <Rank>{props.index + 1}.</Rank>
      }
      <Body>
        <BodyTop>
          <UserLink href={MOKA_LINKS[process.env.REACT_APP_ENV].user + post.user.id} target="_blank">
            {post.user.id.substring(0, 8)}...
          </UserLink>
          <div style={{ margin: '0 5px' }}>·</div>
          <PostLink href={MOKA_LINKS[process.env.REACT_APP_ENV].post + props.item.id} target="_blank">{getDisplayForTimestamp(post.timestamp)}</PostLink>
          {
            props.type === 'settled' &&
            <React.Fragment>
              <div style={{ margin: '0 5px' }}>·</div>
              <div style={{ display: 'flex', fontSize: '0.9em' }}>
                <div>{(props.item.reward / (10 ** 18)).toFixed(1)}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1px' }}><Moka size="11px" /></div>
              </div>
            </React.Fragment>
          }
        </BodyTop>
        <BodyMedium>
          {
            post.post &&
            <div style={{ fontSize: '0.95em' }} dangerouslySetInnerHTML={{__html: anchorme({ input: post.post, options: { attributes: { class: "post-link", target: "_blank" }, truncate: 30 } })}}></div>
          }
        </BodyMedium>
        <BodyBottom>
          {
            post.tags && post.tags.map((item, index) => (
              <div key={index} style={{ fontSize: '0.85em', background: '#fbf4d2', padding: '2px 6px', borderRadius: '5px', marginRight: '6px' }}>{item}</div>
            ))
          }
        </BodyBottom>
      </Body>
      <Vote
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          send(post.user.id, post.id);
        }}
      >
        <Love size="22px" fill={props.userUpvotes.includes(post.id) ? true : false} />
        <div style={{ marginTop: '5px', fontSize: '1.1em', color: props.userUpvotes.includes(post.id) ? '#bf3a2b' : '#333' }}>{post.upvotes}</div>
      </Vote>
    </Wrap>
  );
}

export default Reward;