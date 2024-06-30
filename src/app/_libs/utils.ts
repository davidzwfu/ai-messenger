import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
dayjs.extend(calendar)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: 'Just now',
    m: "1min ago",
    mm: "%dmin ago",
    h: "1hr ago",
    hh: "%dhr ago",
    d: "1day ago",
    dd: "%dday ago",
    M: "1 month ago",
    MM: "%d months ago",
    y: "1 year ago",
    yy: "%d years ago"
  }
})

export function formatDate(time: number) {
  return dayjs(time).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd, MMM D',
    sameElse: 'dddd, MMM D',
  })
}

export function formatTime(time: number) {
  return dayjs(time).format('h:mma')
}

export function isSameDay(time1: number, time2: number) {
  return dayjs(time1).isSame(time2, 'day')
}

export function fromNow(time: number) {
  return dayjs(time).fromNow()
}
