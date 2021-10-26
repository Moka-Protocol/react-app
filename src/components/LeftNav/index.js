import React from 'react';
import { LINKS } from 'constants/constants';

//STYLES
import { Wrap, Item, SubItemWrap, SubItem, Link } from './styles';

function LeftNav(props) {
  return (
    <Wrap>
      <Item
        to="/feed"
        activeStyle={{ background: '#fbf6df', color: '#000', fontWeight: 600 }}
      >
        Live Feed
      </Item>
      <Item
        to="/rewards"
        activeStyle={{ background: '#fbf6df', color: '#000', fontWeight: 600 }}
      >
        Rewards
      </Item>
      {
        props.parentProps.match.path.startsWith('/rewards') &&
        <SubItemWrap>
          <SubItem to="/rewards/daily" activeStyle={{ color: '#000', textDecoration: 'underline' }}>Daily</SubItem>
          <SubItem to="/rewards/weekly" activeStyle={{ color: '#000', textDecoration: 'underline' }}>Weekly</SubItem>
          <SubItem to="/rewards/monthly" activeStyle={{ color: '#000', textDecoration: 'underline' }}>Monthly</SubItem>
        </SubItemWrap>
      }
      <Item
        to={'/profile'}
        activeStyle={{ background: '#fbf6df', color: '#000', fontWeight: 600 }}
      >
        My Profile
      </Item>
      {
        props.parentProps.match.path.startsWith('/profile') &&
        <SubItemWrap>
          <SubItem to="/profile/activity" activeStyle={{ color: '#000', textDecoration: 'underline' }}>Activity</SubItem>
          <SubItem to="/profile/posts" activeStyle={{ color: '#000', textDecoration: 'underline' }}>My Posts</SubItem>
          <SubItem to="/profile/likes" activeStyle={{ color: '#000', textDecoration: 'underline' }}>My Likes</SubItem>
        </SubItemWrap>
      }
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px', color: '#959494' }}>------------------------</div>
      <Link href={LINKS.ABOUT} target="_blank" rel="noreferrer">About Moka</Link>
      <Link href="https://www.ethereum.org" target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-evenly' }}>
        <div>Built on ♦</div>
        <div style={{ fontSize: '0.8em' }}>(Polygon Network)</div>
      </Link>
    </Wrap>
  );
}

export default LeftNav;