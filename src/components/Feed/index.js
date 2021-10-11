import React, { useEffect, useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import { getCurrentTimeMappings } from 'constants/functions';

//COMPONENTS
import Row from './Row';

//STYLES
import {
  Wrap, Header, HeaderLeft, HeaderItem, HeaderMiddot, PostButton,
  Body, Footer
} from './styles';

const GET_DAILY_POSTS = `
  query GetDailyPosts($id: String!) {
    forumPostDayMapping(id: $id) {
      id
      posts(orderBy: upvotes, orderDirection:desc) {
        id
        upvotes
        timestamp
        user {
          id
        }
        title
        desc
        url
        tags
      }
    }
  }
`;

const GET_WEEKLY_POSTS = `
  query GetWeeklyPosts($id: String!) {
    forumPostWeekMapping(id: $id) {
      id
      posts(orderBy: upvotes, orderDirection:desc) {
        id
        upvotes
        timestamp
        user {
          id
        }
        title
        desc
        url
        tags
      }
    }
  }
`;

const GET_MONTHLY_POSTS = `
  query GetMonthlyPosts($id: String!) {
    forumPostMonthMapping(id: $id) {
      id
      posts(orderBy: upvotes, orderDirection:desc) {
        id
        upvotes
        timestamp
        user {
          id
        }
        title
        desc
        url
        tags
      }
    }
  }
`;

const GET_ALL_POSTS = `
  query GetAllPosts($id: String!) {
    forum(id: $id) {
      id
      posts(orderBy: timestamp, orderDirection:desc) {
        id
        upvotes
        timestamp
        user {
          id
        }
        title
        desc
        url
        tags
      }
    }
  }
`;

function getGQLQuery(paramTime) {
  if (paramTime === 'daily') {
    return GET_DAILY_POSTS;
  } else if (paramTime === 'weekly') {
    return GET_WEEKLY_POSTS;
  } else if (paramTime === 'monthly') {
    return GET_MONTHLY_POSTS;
  }

  return GET_ALL_POSTS;
}

function getGQLVariableId(paramTime, paramId) {
  if (paramId) {
    let forumId = paramId.split('_')[0];
    let mappings = getCurrentTimeMappings();

    if (paramTime === 'daily') {
      return forumId + '_' + mappings.daily;
    } else if (paramTime === 'weekly') {
      return forumId + '_' + mappings.weekly;
    } else if (paramTime === 'monthly') {
      return forumId + '_' + mappings.monthly;
    }
  
    return forumId;
  }

  return null;
}

function Feed(props) {
  const [posts, setPosts] = useState(null);

  let GQL_QUERY = gql(getGQLQuery(props.paramTime));
  const { data, refetch } = useQuery(GQL_QUERY, { variables: { id: getGQLVariableId(props.paramTime, props.paramId) } });

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
            Daily
          </HeaderItem>
          <HeaderMiddot>&#8729;</HeaderMiddot>
          <HeaderItem
            to={'/d/' + props.paramId + '/weekly'}
            activeStyle={{ color: '#000', textDecoration: 'underline' }}
          >
            Weekly
          </HeaderItem>
          <HeaderMiddot>&#8729;</HeaderMiddot>
          <HeaderItem
            to={'/d/' + props.paramId + '/monthly'}
            activeStyle={{ color: '#000', textDecoration: 'underline' }}
          >
            Monthly
          </HeaderItem>
        </HeaderLeft>
        <PostButton onClick={() => props.setModal('ADD')}>Add</PostButton>
      </Header>
      <Body>
        {
          posts && posts.map((item, index) => <Row key={index} index={index} paramId={props.paramId} paramTime={props.paramTime} userUpvotes={props.userUpvotes} item={item} />)
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