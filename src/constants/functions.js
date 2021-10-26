import { GET_DAILY_POSTS, GET_WEEKLY_POSTS, GET_MONTHLY_POSTS, GET_ALL_POSTS } from 'gql/queries';

export function getCurrentTimeMappings() {
  let date = new Date()
  let d = new Date(date);
  let day = date.getUTCDay(),
      diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
  let monday = new Date(d.setUTCDate(diff));

  let todayReturn  = [date.getUTCFullYear(), (date.getUTCMonth() + 1), date.getUTCDate()].join('-');
  let weekReturn = [monday.getUTCFullYear(), (monday.getUTCMonth() + 1), monday.getUTCDate()].join('-');
  let monthReturn = [date.getUTCFullYear(), (date.getUTCMonth() + 1)].join('-');

  return { daily: todayReturn, weekly: weekReturn, monthly: monthReturn };
}

export function getLast31Days() {
  var returnArr = [];
  var date = new Date();

  for (var i = 0; i <= 31; i++) {
    returnArr.push([date.getUTCFullYear(), (date.getUTCMonth() + 1), date.getUTCDate()].join('-'));
    date.setUTCDate(date.getUTCDate() - 1);
  }

  return returnArr;
}

export function getLast12Weeks() {
  var returnArr = [];

  for (var i = 0; i <= 12; i++) {
    let date = new Date();
    date.setUTCDate(date.getUTCDate() - (7 * i));
  
    let d = new Date(date);
    let day = date.getUTCDay(),
        diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
    let monday = new Date(d.setUTCDate(diff));

    returnArr.push([monday.getUTCFullYear(), (monday.getUTCMonth() + 1), monday.getUTCDate()].join('-'));
  }

  return returnArr;
}

export function getLast12Months() {
  var returnArr = [];
  var date = new Date();
  date.setUTCDate(1);

  for (var i = 0; i <= 12; i++) {
    returnArr.push([date.getUTCFullYear(), (date.getUTCMonth() + 1)].join('-'));
    date.setUTCMonth(date.getUTCMonth() - 1);
  }

  return returnArr;
}

export function getRewardDateOptions(timeframe) {
  if (timeframe === 'daily') {
    return getLast31Days();
  } else if (timeframe === 'weekly') {
    return getLast12Weeks();
  } else if (timeframe === 'monthly') {
    return getLast12Months();
  }
}

export function getMDHMForTimestamp(timestamp) {
  try {
    let date = new Date(timestamp * 1000);
    let month = ['Jan' , 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;

    return month[date.getUTCMonth()] + " " +  date.getUTCDate() + " " + hours + ':' + minutes + ampm + ' UTC';
  } catch(e) {
    return '-';
  }
}

export function getDisplayForTimestamp(timestamp, short = true) {
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

export function getPostsQuery(paramTime) {
  if (paramTime === 'daily') {
    return GET_DAILY_POSTS;
  } else if (paramTime === 'weekly') {
    return GET_WEEKLY_POSTS;
  } else if (paramTime === 'monthly') {
    return GET_MONTHLY_POSTS;
  }

  return GET_ALL_POSTS;
}

export function returnRewardCount(type, posts) {
  if (type === 'daily') {
    if (posts && posts.postDayMapping && posts.postDayMapping.rewards) {
      return posts.postDayMapping.rewards;
    }
  } else if (type === 'weekly') {
    if (posts && posts.postWeekMapping && posts.postWeekMapping.rewards) {
      return posts.postWeekMapping.rewards;
    }
  } else if (type === 'monthly') {
    if (posts && posts.postMonthMapping && posts.postMonthMapping.rewards) {
      return posts.postMonthMapping.rewards;
    }
  }

  return '-';
}

export function parsePostsData(type, posts) {
  if (type === 'daily') {
    if (posts && posts.postDayMapping) {
      return posts.postDayMapping;
    }
  } else if (type === 'weekly') {
    if (posts && posts.postWeekMapping) {
      return posts.postWeekMapping;
    }
  } else if (type === 'monthly') {
    if (posts && posts.postMonthMapping) {
      return posts.postMonthMapping;
    }
  }

  return null;
}

export function getLeaderboardQueryVariableId(timeframe, date) {
  if (timeframe === 'daily') {
    return date + '_day';
  } else if (timeframe === 'weekly') {
    return date + '_week';
  } else if (timeframe === 'monthly') {
    return date + '_month';
  }
}

export function getGQLVariableId(paramTime, paramId) {
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