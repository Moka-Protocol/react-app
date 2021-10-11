export function getCurrentTimeMappings() {
  let date = new Date()
  let d = new Date(date);
  let day = date.getDay(),
      diff = date.getDate() - day + (day === 0 ? -6 : 1);
  let monday = new Date(d.setDate(diff));

  let todayReturn  = [date.getFullYear(), (date.getMonth() + 1), date.getDate()].join('-');
  let weekReturn = [monday.getFullYear(), (monday.getMonth() + 1), monday.getDate()].join('-');
  let monthReturn = [date.getFullYear(), (date.getMonth() + 1)].join('-') + '-00';

  return { daily: todayReturn, weekly: weekReturn, monthly: monthReturn };
}
