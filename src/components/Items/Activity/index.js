import React from 'react';
import anchorme from "anchorme";
import { getMDHMForTimestamp, getDisplayForTimestamp } from 'constants/functions';
import { MOKA_LINKS } from 'constants/constants';

//COMPONENTS
import Moka from 'assets/svgs/moka';

//STYLES
import { Wrap, Left, User, Right } from './styles';

const ACTIVITY_EMOJI = {
  'reward-daily': '🎉',
  'reward-weekly': '🎉',
  'reward-monthly': '🎉',
  'upvote-receive': '❤️',
  'upvote': '❤️',
  'post': '📝'
};

function Activity(props) {
  const item = props.item;

  return (
    <Wrap>
      <Left>
        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
          <span>{ACTIVITY_EMOJI[item.type]}</span>
          <span>
            {
              item.type === 'post' &&
              <React.Fragment>&nbsp;New post</React.Fragment>
            }
            {
              item.type === 'upvote' &&
              <React.Fragment>&nbsp;You liked <User href={MOKA_LINKS[process.env.REACT_APP_ENV].user + item.user.id} target="_blank" title={item.user.id}>{item.user.id.substring(0, 8)}...</User>&nbsp;'s post</React.Fragment>
            }
            {
              item.type === 'upvote-receive' &&
              <React.Fragment>&nbsp;<User href={MOKA_LINKS[process.env.REACT_APP_ENV].user + item.user.id} target="_blank" title={item.user.id}>{item.user.id.substring(0, 8)}...</User> liked your post</React.Fragment>
            }
            {
              item.type === 'reward-daily' &&
              <React.Fragment>&nbsp;Won {(item.reward.reward / (10 ** 18)).toFixed(1)}<Moka size="12px" /> for #{item.reward.rank} post on {item.reward.id.split('_')[0]}</React.Fragment>
            }
            {
              item.type === 'reward-weekly' &&
              <React.Fragment>&nbsp;Won {(item.reward.reward / (10 ** 18)).toFixed(1)}<Moka size="12px" /> for #{item.reward.rank} post of week of {item.reward.id.split('_')[0]}</React.Fragment>
            }
            {
              item.type === 'reward-monthly' &&
              <React.Fragment>&nbsp;Won {(item.reward.reward / (10 ** 18)).toFixed(1)}<Moka size="12px" /> for #{item.reward.rank} post of month of {item.reward.id.split('_')[0]}</React.Fragment>
            }
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', color: '#686868', opacity: 0.75 }}>
          <div style={{ marginBottom: '6px' }}>
            {
              item.type === 'post' &&
              <div style={{ fontSize: '0.9em', margin: '0 2px' }} dangerouslySetInnerHTML={{__html: anchorme({ input: item.post.post, options: { attributes: { class: "post-link", target: "_blank" }, truncate: 30 } })}}></div>
            }
            {
              (item.type === 'upvote' || item.type === 'upvote-receive') &&
              <div style={{ fontSize: '0.9em', margin: '0 2px' }} dangerouslySetInnerHTML={{__html: anchorme({ input: item.upvote.post.post, options: { attributes: { class: "post-link", target: "_blank" }, truncate: 30 } })}}></div>
            }
            {
              (item.type === 'reward-daily' || item.type === 'reward-weekly' || item.type === 'reward-monthly') &&
              <div style={{ fontSize: '0.9em', margin: '0 2px' }} dangerouslySetInnerHTML={{__html: anchorme({ input: item.reward.post.post, options: { attributes: { class: "post-link", target: "_blank" }, truncate: 30 } })}}></div>
            }
          </div>
          <React.Fragment>
            {
              item.type === 'post' && item.post.tags.length > 0 &&
              <div style={{ display: 'flex', marginTop: '6px' }}>
                {
                  item.post.tags && item.post.tags.map((item, index) => (
                    <div key={index} style={{ fontSize: '0.8em', background: '#fbf4d2', padding: '2px 4px', borderRadius: '5px', marginRight: '6px' }}>{item}</div>
                  ))
                }
              </div>
            }
            {
              (item.type === 'upvote' || item.type === 'upvote-receive') && item.upvote.post.tags.length > 0 &&
              <div style={{ display: 'flex', marginTop: '6px' }}>
                {
                  item.upvote.post.tags && item.upvote.post.tags.map((item, index) => (
                    <div key={index} style={{ fontSize: '0.8em', background: '#fbf4d2', padding: '2px 4px', borderRadius: '5px', marginRight: '6px' }}>{item}</div>
                  ))
                }
              </div>
            }
            {
              (item.type === 'reward-daily' || item.type === 'reward-weekly' || item.type === 'reward-monthly') && item.reward.post.tags.length > 0 &&
              <div style={{ display: 'flex', marginTop: '6px' }}>
                {
                  item.reward.post.tags && item.reward.post.tags.map((item, index) => (
                    <div key={index} style={{ fontSize: '0.8em', background: '#fbf4d2', padding: '2px 4px', borderRadius: '5px', marginRight: '6px' }}>{item}</div>
                  ))
                }
              </div>
            }
          </React.Fragment>
        </div>
      </Left>
      <Right>
        <div style={{ fontSize: '0.9em' }} title={getMDHMForTimestamp(props.item.timestamp)}>{getDisplayForTimestamp(props.item.timestamp)}</div>
      </Right>
    </Wrap>
  );
}

export default Activity;