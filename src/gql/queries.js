//POSTS
export const GET_DAILY_POSTS = `
  query GetDailyPosts($id: String!) {
    postDayMapping(id: $id) {
      id
      rewards
      posts(orderBy: upvotes, orderDirection: desc) {
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
    }
  }
`;

export const GET_WEEKLY_POSTS = `
  query GetWeeklyPosts($id: String!) {
    postWeekMapping(id: $id) {
      id
      rewards
      posts(orderBy: upvotes, orderDirection: desc) {
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
    }
  }
`;

export const GET_MONTHLY_POSTS = `
  query GetMonthlyPosts($id: String!) {
    postMonthMapping(id: $id) {
      id
      rewards
      posts(orderBy: upvotes, orderDirection: desc) {
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
    }
  }
`;

export const GET_ALL_POSTS = `
  query GetAllPosts {
    posts(orderBy: timestamp, orderDirection: desc) {
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
  }
`;

//LEADERBOARD
export const GET_LEADERBOARD = `
  query GetLeaderboard($id: String!) {
    leaderboard(id: $id) {
      id
      reward
      payouts(orderBy: rank, orderDirection: asc) {
        id
        type
        rank
        user {
          id
        }
        post {
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
        reward
      }
    }
  }
`;

//REWARDS COUNT
export const GET_DAILY_REWARDS_COUNT = `
  query GetDailyRewards($id: String!) {
    postDayMapping(id: $id) {
      id
      rewards
    }
  }
`;

export const GET_WEEKLY_REWARDS_COUNT = `
  query GetWeeklyRewards($id: String!) {
    postWeekMapping(id: $id) {
      id
      rewards
    }
  }
`;

export const GET_MONTHLY_REWARDS_COUNT = `
  query GetMonthlyRewards($id: String!) {
    postMonthMapping(id: $id) {
      id
      rewards
    }
  }
`;

//USER
export const GET_USER_ACTIVITY = `
  query GetUserActivity($id: String!) {
    user(id: $id) {
      id
      activity(orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        type
        user {
          id
        }
        post {
          id
          post
          tags
        }
        upvote {
          id
          post {
            id
            post
            tags
          }
        }
        reward {
          id
          type
          rank
          post {
            id
            post
            tags
          }
          reward
        }
      }
    }
  }
`;

export const GET_USER_POSTS = `
  query GetUserPosts($id: String!) {
    user(id: $id) {
      id
      posts(orderBy: timestamp, orderDirection: desc) {
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
    }
  }
`;

export const GET_USER_UPVOTES = `
  query GetUserUpvotes($id: String!) {
    user(id: $id) {
      id
      upvotes(orderBy: timestamp, orderDirection: desc) {
        id
        postId
        timestamp
        post {
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
      }
    }
  }
`;

export const GET_USER_UPVOTES_IDS = `
  query GetUserUpvotesIds($id: String!) {
    user(id: $id) {
      id
      upvotes {
        id
        postId
      }
    }
  }
`;

export const GET_USER_TOKEN_STATS = `
  query GetUserTokenStats($id: String!) {
    user(id: $id) {
      id
      tokenRewards
      tokenSpent
    }
  }
`;