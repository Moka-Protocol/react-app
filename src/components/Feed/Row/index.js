import React from 'react';
import { utils } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import MokaTokenABI from 'contracts/MokaToken.json';
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts';
import { CONTRACTS, BLOCKEXPLORERS } from 'constants/constants';

import UpArrow from 'assets/svgs/uparrow';

import {
  Wrap, Vote, Body
} from './styles';

function extractHostname(url) {
  var hostname;

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
}

function getDisplayForTimestamp(timestamp, short = true) {
  try {
    let today = new Date();
    let date = new Date(timestamp * 1000);

    let diff = today - date;

    if (diff >= 24 * 60 * 60e3) {
      let days = Math.floor(diff / (24* 60 * 60e3)).toString();

      if (short === true) {
        return days + 'd';
      } else {
        return days + ' days ago';
      }
    } else if (diff >= 60 * 60e3) {
      let hours = Math.floor(diff / (60 * 60e3)).toString();

      if (short === true) {
        return hours + 'h';
      } else {
        return hours + ' hours ago';
      }
    } else {
      let minutes = Math.floor(diff / 60e3);
      if (minutes < 1) { minutes = 1; } 
      minutes = minutes.toString();

      if (short === true) {
        return minutes + 'm';
      } else {
        return minutes + ' minutes ago';
      }
    }
  } catch(e) {
    return '';
  }
}

const contract = new Contract(CONTRACTS[process.env.REACT_APP_ENV].MOKATOKEN, new utils.Interface(MokaTokenABI))

function Row(props) {
  const { send } = useContractFunction(contract, 'upvotePost', { transactionName: 'UpVote' })

  return (
    <Wrap href={props.item.url} target="_blank" rel="noreferrer">
      {
        props.index < 10 &&
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', marginLeft: '5px', fontSize: '1.1em' }}>{props.index + 1}.</div>
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
              window.open(BLOCKEXPLORERS[process.env.REACT_APP_ENV] + 'address/' + props.item.user.id, "_blank");
            }}
          >
            {props.item.user.id.substring(0, 8)}...
          </div>
          <div style={{ fontSize: '0.85em', background: '#f7f7f7', padding: '2px 6px', borderRadius: '5px', marginRight: '6px' }}>{getDisplayForTimestamp(props.item.timestamp)}</div>
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
        <UpArrow size="18px" fill={props.userUpvotes.includes(props.item.id) ? '#c1560f' : '#656565'} />
        <div style={{ marginTop: '3px', marginLeft: '1px', fontWeight: 500, color: props.userUpvotes.includes(props.item.id) ? '#c1560f' : '#656565' }}>{props.item.upvotes}</div>
      </Vote>
    </Wrap>
  );
}

export default Row;