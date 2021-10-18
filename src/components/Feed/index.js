import React, { useEffect, useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import { getCurrentTimeMappings, getGQLQuery, getGQLVariableId } from 'constants/functions';

//GQL
import { GET_DAILY_REWARDS, GET_WEEKLY_REWARDS, GET_MONTHLY_REWARDS } from 'gql/queries';

//COMPONENTS
import Row from './Row';
import Moka from 'assets/svgs/moka';

//STYLES
import { Wrap, Header, HeaderLeft, HeaderItem, HeaderIconWrap, HeaderMiddot, Body, Footer } from './styles';

const mappings = getCurrentTimeMappings();

function Feed(props) {
  const [posts, setPosts] = useState(null);
  const { data, refetch } = useQuery(gql(getGQLQuery(props.paramTime)), { variables: { id: getGQLVariableId(props.paramTime, props.paramId) } });

  const { data: dailyRewards } = useQuery(gql(GET_DAILY_REWARDS), { variables: { id: props.paramId.split('_')[0] + '_' + mappings.daily } });
  const { data: weeklyRewards } = useQuery(gql(GET_WEEKLY_REWARDS), { variables: { id: props.paramId.split('_')[0] + '_' + mappings.weekly } });
  const { data: monthlyRewards } = useQuery(gql(GET_MONTHLY_REWARDS), { variables: { id: props.paramId.split('_')[0] + '_' + mappings.monthly } });

  useEffect(() => {
    if (props.paramTime === 'daily') {
      if (data && data.forumPostDayMapping !== undefined) {
        if (data.forumPostDayMapping && data.forumPostDayMapping.posts) {
          setPosts(data.forumPostDayMapping.posts);
        } else {
          setPosts([]);
        }
      }
    } else if (props.paramTime === 'weekly') {
      if (data && data.forumPostWeekMapping !== undefined) {
        if (data.forumPostWeekMapping && data.forumPostWeekMapping.posts) {
          setPosts(data.forumPostWeekMapping.posts);
        } else {
          setPosts([]);
        }
      }
    } else if (props.paramTime === 'monthly') {
      if (data && data.forumPostMonthMapping !== undefined) {
        if (data.forumPostMonthMapping && data.forumPostMonthMapping.posts) {
          setPosts(data.forumPostMonthMapping.posts);
        } else {
          setPosts([]);
        }
      }
    } else {
      if (data && data.forum !== undefined) {
        if (data.forum && data.forum.posts) {
          setPosts(data.forum.posts);
        } else {
          setPosts([]);
        }
      }
    }
  },[props.paramTime, data]);

  useEffect(() => {
    refetch();
  },[props.paramTime, props.paramId, refetch]);

  return (
    <Wrap>
      <Header>
        <HeaderLeft>
          <HeaderItem
            to={'/d/' +  props.paramId + '/latest'}
            activeStyle={{ color: '#000', textDecoration: 'underline' }}
          >
            Latest
          </HeaderItem>
          <HeaderMiddot>&#8729;</HeaderMiddot>
          <HeaderItem
            to={'/d/' + props.paramId + '/daily'}
            activeStyle={{ color: '#000', textDecoration: 'underline' }}
          >
            <div>Today&nbsp;</div>
            {
              dailyRewards && dailyRewards.forumPostDayMapping &&
              <HeaderIconWrap>({dailyRewards.forumPostDayMapping.rewards.toLocaleString()} <Moka size="11px" />)</HeaderIconWrap>
            }
            {
              dailyRewards && !dailyRewards.forumPostDayMapping &&
              <HeaderIconWrap>(0 <Moka size="11px" />)</HeaderIconWrap>
            }
          </HeaderItem>
          <HeaderMiddot>&#8729;</HeaderMiddot>
          <HeaderItem
            to={'/d/' + props.paramId + '/weekly'}
            activeStyle={{ color: '#000', textDecoration: 'underline' }}
          >
            <div>This Week&nbsp;</div>
            {
              weeklyRewards && weeklyRewards.forumPostWeekMapping &&
              <HeaderIconWrap>({weeklyRewards.forumPostWeekMapping.rewards.toLocaleString()} <Moka size="11px" />)</HeaderIconWrap>
            }
            {
              weeklyRewards && !weeklyRewards.forumPostWeekMapping &&
              <HeaderIconWrap>(0 <Moka size="11px" />)</HeaderIconWrap>
            }
          </HeaderItem>
          <HeaderMiddot>&#8729;</HeaderMiddot>
          <HeaderItem
            to={'/d/' + props.paramId + '/monthly'}
            activeStyle={{ color: '#000', textDecoration: 'underline' }}
          >
            <div>This Month&nbsp;</div>
            {
              monthlyRewards && monthlyRewards.forumPostMonthMapping &&
              <HeaderIconWrap>({monthlyRewards.forumPostMonthMapping.rewards.toLocaleString()} <Moka size="11px" />)</HeaderIconWrap>
            }
            {
              monthlyRewards && !monthlyRewards.forumPostMonthMapping &&
              <HeaderIconWrap>(0 <Moka size="11px" />)</HeaderIconWrap>
            }
          </HeaderItem>
        </HeaderLeft>
      </Header>
      <Body>
        {
          posts && posts.map((item, index) => <Row key={index} index={index} account={props.account} paramId={props.paramId} paramTime={props.paramTime} userUpvotes={props.userUpvotes} item={item} />)
        }
      </Body>
      <Footer style={{ display: 'none' }}>
        <div>About Moka</div>
        <div style={{ margin: '0 8px' }}>&#8729;</div>
        <div>Built on Polygon</div>
      </Footer>
    </Wrap>
  );
}

export default Feed;