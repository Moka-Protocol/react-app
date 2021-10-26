import { gql } from '@apollo/client';
import { getCurrentTimeMappings } from 'constants/functions';
import { GET_ALL_POSTS, GET_USER_POSTS, GET_USER_UPVOTES, GET_USER_UPVOTES_IDS } from 'gql/queries';

const POST_FRAGMENT = gql`
  fragment post on Post {
    id
    upvotes
    timestamp
    user {
      id
    }
    post
    tags
    payouts {
      id
      type
      rank
      reward
    }
  }
`;

const DAILY_REWARDS_FRAGMENT = gql`
  fragment dailyRewards on PostDayMapping {
    id
    rewards
  }
`;

const WEEKLY_REWARDS_FRAGMENT = gql`
  fragment weeklyRewards on PostWeekMapping {
    id
    rewards
  }
`;

const MONTHLY_REWARDS_FRAGMENT = gql`
  fragment monthlyRewards on PostMonthMapping {
    id
    rewards
  }
`;

export function updateAddPost(client, account, postParams) {
  let newPostItem = {
    id: 'temp_' + new Date().toISOString(),
    upvotes: 0,
    timestamp: parseInt(new Date().getTime() / 1000),
    user: {
      id: account.toString().toLowerCase(),
      __typename: 'User'
    },
    post: postParams.text,
    tags: postParams.tags,
    payouts: null,
    __typename: 'Post'
  };

  //UPDATE REWARDS
  try {
    const mappings = getCurrentTimeMappings();

    //DAILY REWARDS
    let dailyData = client.readFragment({ id: mappings.daily, fragment: DAILY_REWARDS_FRAGMENT });
    let dailyRewardsData = dailyData ? Object.assign({}, dailyData) : { id: mappings.daily };

    dailyRewardsData.rewards = parseInt(dailyRewardsData.rewards) + 2;

    client.writeFragment({ id: mappings.daily, fragment: DAILY_REWARDS_FRAGMENT, data: dailyRewardsData });

    //WEEKLY REWARDS
    let weeklyData = client.readFragment({ id: mappings.weekly, fragment: WEEKLY_REWARDS_FRAGMENT });
    let weeklyRewardsData = weeklyData ? Object.assign({}, weeklyData) : { id: mappings.weekly };

    weeklyRewardsData.rewards = parseInt(weeklyRewardsData.rewards) + 2;

    client.writeFragment({ id: mappings.weekly, fragment: WEEKLY_REWARDS_FRAGMENT, data: weeklyRewardsData });

    //MONTHLY REWARDS
    let monthlyData = client.readFragment({ id: mappings.monthly, fragment: MONTHLY_REWARDS_FRAGMENT });
    let monthlyRewardsData = monthlyData ? Object.assign({}, monthlyData) : { id: mappings.monthly };

    monthlyRewardsData.rewards = parseInt(monthlyRewardsData.rewards) + 2;

    client.writeFragment({ id: mappings.monthly, fragment: MONTHLY_REWARDS_FRAGMENT, data: monthlyRewardsData });
  } catch(e) { }

  //UPDATE LIVE FEED
  try {
    let liveFeedData = client.readQuery({ query: gql(GET_ALL_POSTS) });
    let livePostsArray = liveFeedData.posts ? Object.assign([], liveFeedData.posts) : [];
    livePostsArray.unshift(newPostItem);

    client.writeQuery({
      query: gql(GET_ALL_POSTS),
      data: { posts: livePostsArray }
    });
  } catch(e) { }

  //UPDATE PROFILE POSTS
  try {
    let userPostsData = client.readQuery({ query: gql(GET_USER_POSTS), variables: { id: account.toString().toLowerCase() } });  
    let userPostsArray = (userPostsData.user && userPostsData.user.posts) ? Object.assign([], userPostsData.user.posts) : [];
    userPostsArray.unshift(newPostItem);
  
    client.writeQuery({
      query: gql(GET_USER_POSTS),
      data: {
        user: {
          id: account.toString().toLowerCase(),
          posts: userPostsArray,
          __typename: 'User'
        }
      }
    });
  } catch(e) { }
}

export function updateUpvote(client, account, post) {
  //UPDATE POST UPVOTE COUNT
  try {
    let readData = client.readFragment({ id: post.id, fragment: POST_FRAGMENT });
    let postData = Object.assign({}, readData);
    postData.upvotes = parseInt(postData.upvotes) + 1;

    client.writeFragment({ id: post.id, fragment: POST_FRAGMENT, data: postData });
  } catch(e) { }

  //UPDATE USER VOTES
  try {
    let userData = client.readQuery({
      query: gql(GET_USER_UPVOTES),
      variables: { id: account.toString().toLowerCase() }
    });

    let upvotes = (userData.user && userData.user.upvotes) ? Object.assign([], userData.user.upvotes) : [];

    upvotes.unshift({
      id: account.toString().toLowerCase() + '_' + post.id,
      postId: post.id,
      timestamp: post.timestamp,
      post,
      __typename: 'Upvote'
    });

  
    client.writeQuery({
      query: gql(GET_USER_UPVOTES),
      variables: { id: account.toString().toLowerCase() },
      data: {
        user: {
          id: account.toString().toLowerCase(),
          upvotes,
          __typename: 'User',
        }
      }
    });
  } catch(e) { }

  //UPDATE USER VOTES IDS
  try {
    let userData = client.readQuery({
      query: gql(GET_USER_UPVOTES_IDS),
      variables: { id: account.toString().toLowerCase() }
    });
  
    let upvotes = (userData.user && userData.user.upvotes) ? Object.assign([], userData.user.upvotes) : [];
  
    upvotes.push({
      id: account.toString().toLowerCase() + '_' + post.id,
      postId: post.id,
      __typename: 'Upvote'
    });
  
    client.writeQuery({
      query: gql(GET_USER_UPVOTES_IDS),
      variables: { id: account.toString().toLowerCase() },
      data: {
        user: {
          id: account.toString().toLowerCase(),
          upvotes,
          __typename: 'User',
        }
      }
    });
  } catch(e) { }
}
