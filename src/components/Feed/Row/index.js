import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { CONTRACTS, MOKALINKS } from 'constants/constants';
import { getMDHMForTimestamp, getDisplayForTimestamp, extractHostname } from 'constants/functions';

//WEB3
import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts';

//CONTRACT ABIS
import MokaTokenABI from 'contracts/MokaToken.json';

//CACHE
import { updateUpvote } from 'cache/update';

//COMPONENTS
import UpArrow from 'assets/svgs/uparrow';

//STYLES
import { Wrap, Vote, Body } from './styles';

const contract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN, new utils.Interface(MokaTokenABI))

function Row(props) {
  const client = useApolloClient();
  const [updateCache, setUpdateCache] = useState(false);
  const { state, send } = useContractFunction(contract, 'upvotePost', { transactionName: 'UpVote' })

  useEffect(() => {
    if (state.status === 'Mining' && updateCache === false) {
      setUpdateCache(true);
      updateUpvote(client, props.account, props.item.id);
    }
  },[state, updateCache, setUpdateCache, client, props.account, props.item.id]);

  return (
    <Wrap href={props.item.url} target="_blank" rel="noreferrer">
      {
        props.index < 10 && props.paramTime !== 'latest' &&
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', marginLeft: '5px', fontSize: '1.3em' }}>{props.index + 1}.</div>
      }
      <Body>
        <div style={{ display: 'flex' }}>
          {
            props.item.title &&
            <div style={{ fontWeight: 500 }}>{props.item.title}</div>
          }
          {
            !props.item.title &&
            <div style={{ fontWeight: 500 }}>{props.item.url.substring(0, 45)}</div>
          }
          <div style={{ marginLeft: '5px', fontSize: '0.9em', color: '#794420' }}>({extractHostname(props.item.url)})</div>
        </div>
        {
          props.item.desc &&
          <div style={{ marginTop: '5px', color: 'gray', fontSize: '0.95em' }}>{props.item.desc}</div>
        }
        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ fontSize: '0.85em', background: '#f7f7f7', padding: '2px 6px', borderRadius: '5px', marginRight: '6px', textDecoration: 'none', color: 'inherit' }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.open(MOKALINKS[process.env.REACT_APP_ENV].USERS + props.item.user.id, "_blank");
            }}
            title={props.item.user.id}
          >
            {props.item.user.id.substring(0, 8)}...
          </div>
          <div style={{ fontSize: '0.85em', background: '#f7f7f7', padding: '2px 6px', borderRadius: '5px', marginRight: '6px' }} title={getMDHMForTimestamp(props.item.timestamp)}>{getDisplayForTimestamp(props.item.timestamp)}</div>
          {
            props.item.tags && props.item.tags.map((item, index) => (
              <div key={index} style={{ fontSize: '0.85em', background: '#f7f7f7', padding: '2px 6px', borderRadius: '5px', marginRight: '6px' }}>{item}</div>
            ))
          }
        </div>
      </Body>
      <Vote
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          
          send(props.paramId.split('_')[1], BigNumber.from(1), BigNumber.from(props.item.id.split('_')[1]));
        }}
      >
        <UpArrow size="22px" fill={props.userUpvotes.includes(props.item.id) ? '#c1560f' : '#656565'} />
        <div style={{ marginTop: '5px', marginLeft: '1px', fontSize: '1.1em', fontWeight: 500, color: props.userUpvotes.includes(props.item.id) ? '#c1560f' : '#656565' }}>{props.item.upvotes}</div>
      </Vote>
    </Wrap>
  );
}

export default Row;