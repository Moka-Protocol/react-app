export const GET_DAILY_POSTS = `
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

export const GET_WEEKLY_POSTS = `
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

export const GET_MONTHLY_POSTS = `
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

export const GET_ALL_POSTS = `
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

export const GET_DAILY_REWARDS = `
  query GetDailyRewards($id: String!) {
    forumPostDayMapping(id: $id) {
      id
      rewards
    }
  }
`;

export const GET_WEEKLY_REWARDS = `
  query GetWeeklyRewards($id: String!) {
    forumPostWeekMapping(id: $id) {
      id
      rewards
    }
  }
`;

export const GET_MONTHLY_REWARDS = `
  query GetMonthlyRewards($id: String!) {
    forumPostMonthMapping(id: $id) {
      id
      rewards
    }
  }
`;

export const GET_USER_UPVOTES = `
query GetUserUpvotes($id: String!) {
  user(id: $id) {
    id
    upvotes {
      id
      postId
    }
  }
}
`;