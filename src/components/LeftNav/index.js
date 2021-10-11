import React, { useEffect } from 'react';
import { utils } from 'ethers';
import { useContractCall } from '@usedapp/core';
import MokaFactoryABI from 'contracts/MokaFactory.json';
import { CONTRACTS } from 'constants/constants';

import {
  Wrap, Item
} from './styles';

function LeftNav(props) {
  const [forums] = useContractCall({
    abi: new utils.Interface(MokaFactoryABI),
    address: CONTRACTS[process.env.REACT_APP_ENV].FORUMFACTORY,
    method: 'getForums',
    args: null,
  }) ?? []

  useEffect(() => {
    if (forums && forums.length > 0 && !props.paramId) {
      props.parentProps.history.push('/d/' + forums[0][0] + '_' + forums[0][2] + '/latest');
    }
  },[forums, props.paramId, props.parentProps.history]);

  return (
    <Wrap>
      {
        forums && forums.map(item => {
          return (
            <Item
              key={item[0]}
              to={'/d/' + item[0] + '_' + item[2]}
              activeStyle={{ background: '#fdf2ed', color: '#000', fontWeight: 600 }}
            >
              {item[1]}
            </Item>
          );
        })
      }
    </Wrap>
  );
}

export default LeftNav;