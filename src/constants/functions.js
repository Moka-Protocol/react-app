import { GET_DAILY_POSTS, GET_WEEKLY_POSTS, GET_MONTHLY_POSTS, GET_ALL_POSTS } from 'gql/queries';

export function getCurrentTimeMappings() {
  let date = new Date()
  let d = new Date(date);
  let day = date.getDay(),
      diff = date.getDate() - day + (day === 0 ? -6 : 1);
  let monday = new Date(d.setDate(diff));

  let todayReturn  = [date.getFullYear(), (date.getMonth() + 1), date.getDate()].join('-');
  let weekReturn = [monday.getFullYear(), (monday.getMonth() + 1), monday.getDate()].join('-');
  let monthReturn = [date.getFullYear(), (date.getMonth() + 1)].join('-');

  return { daily: todayReturn, weekly: weekReturn, monthly: monthReturn };
}

export function getMDHMForTimestamp(timestamp) {
  try {
    let date = new Date(timestamp * 1000);
    let month = ['Jan' , 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;

    return month[date.getMonth()] + " " +  date.getDate() + " " + hours + ':' + minutes + ampm + ' UTC';
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

export function extractHostname(url) {
  var hostname;

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
}

export function getGQLQuery(paramTime) {
  if (paramTime === 'daily') {
    return GET_DAILY_POSTS;
  } else if (paramTime === 'weekly') {
    return GET_WEEKLY_POSTS;
  } else if (paramTime === 'monthly') {
    return GET_MONTHLY_POSTS;
  }

  return GET_ALL_POSTS;
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