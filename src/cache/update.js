import { gql } from '@apollo/client';
import { getCurrentTimeMappings, getGQLQuery, getGQLVariableId } from 'constants/functions';
import {  GET_USER_UPVOTES } from 'gql/queries';

const POST_FRAGMENT = gql`
  fragment post on Post {
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
`;

const DAILY_REWARDS_FRAGMENT = gql`
  fragment dailyRewards on ForumPostDayMapping {
    id
    rewards
  }
`;

const WEEKLY_REWARDS_FRAGMENT = gql`
  fragment weeklyRewards on ForumPostWeekMapping {
    id
    rewards
  }
`;

const MONTHLY_REWARDS_FRAGMENT = gql`
  fragment monthlyRewards on ForumPostMonthMapping {
    id
    rewards
  }
`;

export function updateAddPost(client, account, postParams, paramId, paramTime) {
  try {
    //UPDATE REWARDS
    const mappings = getCurrentTimeMappings();

    //DAILY REWARDS
    let dailyData = client.readFragment({ id: paramId.split('_')[0] + '_' + mappings.daily, fragment: DAILY_REWARDS_FRAGMENT });
    let dailyRewardsData = Object.assign({}, dailyData);
    dailyRewardsData.rewards = parseInt(dailyRewardsData.rewards) + 2;

    client.writeFragment({ id: paramId.split('_')[0] + '_' + mappings.daily, fragment: DAILY_REWARDS_FRAGMENT, data: dailyRewardsData });

    //WEEKLY REWARDS
    let weeklyData = client.readFragment({ id: paramId.split('_')[0] + '_' + mappings.weekly, fragment: WEEKLY_REWARDS_FRAGMENT });
    let weeklyRewardsData = Object.assign({}, weeklyData);
    weeklyRewardsData.rewards = parseInt(weeklyRewardsData.rewards) + 2;

    client.writeFragment({ id: paramId.split('_')[0] + '_' + mappings.weekly, fragment: WEEKLY_REWARDS_FRAGMENT, data: weeklyRewardsData });

    //MONTHLY REWARDS
    let monthlyData = client.readFragment({ id: paramId.split('_')[0] + '_' + mappings.monthly, fragment: MONTHLY_REWARDS_FRAGMENT });
    let monthlyRewardsData = Object.assign({}, monthlyData);
    monthlyRewardsData.rewards = parseInt(monthlyRewardsData.rewards) + 2;

    client.writeFragment({ id: paramId.split('_')[0] + '_' + mappings.monthly, fragment: MONTHLY_REWARDS_FRAGMENT, data: monthlyRewardsData });

    //UPDATE POST ARRAY
    let postsTimelineData = client.readQuery({
      query: gql(getGQLQuery(paramTime)),
      variables: { id: getGQLVariableId(paramTime, paramId) }
    });

    let postsData;

    if (paramTime === 'latest') {
      postsData = Object.assign([], postsTimelineData.forum.posts);
    } else {
      if (paramTime === 'daily') {
        postsData = Object.assign([], postsTimelineData.forumPostDayMapping.posts);
      } else if (paramTime === 'weekly') {
        postsData = Object.assign([], postsTimelineData.forumPostWeekMapping.posts);
      } else if (paramTime === 'monthly') {
        postsData = Object.assign([], postsTimelineData.forumPostMonthMapping.posts);
      }
    }

    let newPostItem = {
      id: paramId.split('_')[0] + '_' + new Date().toISOString(),
      upvotes: 0,
      timestamp: parseInt(new Date().getTime() / 1000),
      user: {
        id: account.toString().toLowerCase(),
        __typename: 'User'
      },
      title: postParams.title,
      desc: postParams.desc,
      url: postParams.url,
      tags: postParams.tags,
      __typename: 'Post'
    };

    if (paramTime === 'latest') {
      postsData.unshift(newPostItem);

      client.writeQuery({
        query: gql(getGQLQuery(paramTime)),
        variables: { id: getGQLVariableId(paramTime, paramId) },
        data: {
          forum: {
            id: postsTimelineData.forum.id,
            posts: postsData,
            __typename: postsTimelineData.forum.__typename
          }
        }
      });
    } else {
      postsData.push(newPostItem);

      if (paramTime === 'daily') {
        client.writeQuery({
          query: gql(getGQLQuery(paramTime)),
          variables: { id: getGQLVariableId(paramTime, paramId) },
          data: {
            forumPostDayMapping: {
              id: postsTimelineData.forumPostDayMapping.id,
              posts: postsData,
              __typename: postsTimelineData.forumPostDayMapping.__typename
            }
          }
        });
      } else if (paramTime === 'weekly') {
        client.writeQuery({
          query: gql(getGQLQuery(paramTime)),
          variables: { id: getGQLVariableId(paramTime, paramId) },
          data: {
            forumPostWeekMapping: {
              id: postsTimelineData.forumPostWeekMapping.id,
              posts: postsData,
              __typename: postsTimelineData.forumPostWeekMapping.__typename
            }
          }
        });
      } else if (paramTime === 'monthly') {
        client.writeQuery({
          query: gql(getGQLQuery(paramTime)),
          variables: { id: getGQLVariableId(paramTime, paramId) },
          data: {
            forumPostMonthMapping: {
              id: postsTimelineData.forumPostMonthMapping.id,
              posts: postsData,
              __typename: postsTimelineData.forumPostMonthMapping.__typename
            }
          }
        });
      }
    }

  } catch(e) { }
}

export function updateUpvote(client, account, postItem) {
  try {
    //UPDATE POST UPVOTE COUNT
    let readData = client.readFragment({ id: postItem, fragment: POST_FRAGMENT });

    let postData = Object.assign({}, readData);
    postData.upvotes = parseInt(postData.upvotes) + 1;

    client.writeFragment({ id: postItem, fragment: POST_FRAGMENT, data: postData });

    //UPDATE USER VOTES
    let userData = client.readQuery({
      query: gql(GET_USER_UPVOTES),
      variables: { id: account && account.toString().toLowerCase() }
    });

    let upvotes = Object.assign([], userData.user.upvotes);

    upvotes.push({
      id: account.toString().toLowerCase() + '_' + postItem,
      postId: postItem,
      __typename: 'Upvote'
    });

    client.writeQuery({
      query: gql(GET_USER_UPVOTES),
      variables: { id: account && account.toString().toLowerCase() },
      data: {
        user: {
          id: account.toString().toLowerCase(),
          __typename: userData.user.__typename,
          upvotes
        }
      }
    });
  
  } catch(e) { }
}
