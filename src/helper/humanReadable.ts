export const humanReadableDate = (date: string | Date) => {
  date = new Date(date)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return (
    hours + ':' + minutes + ' ' + day + '/' + month + '/' + date.getFullYear()
  )
}
export const calculateDaysDifference = (date: string | Date) => {
  const today = new Date()
  const createdDate = new Date(date)

  const differenceInMilliseconds = today.getTime() - createdDate.getTime()

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  )

  return differenceInDays
}

export const formatDate = (date: string | Date) => {
  date = new Date(date)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return day + '/' + month + '/' + new Date(date).getFullYear()
}

export const formatDateMonth = (date: string | Date) => {
  date = new Date(date)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return day + '/' + month
}

export const formatOnlyDate = (date: string | Date) => {
  date = new Date(date)
  const day = ('0' + date.getDate()).slice(-2)
  return day
}
export const formatMonth = (date: string | Date) => {
  date = new Date(date)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return month + '/' + new Date(date).getFullYear()
}

export const formatYear = (date: string | Date) => {
  return new Date(date).getFullYear().toString()
}

export const formatTime = (date: string | Date) => {
  date = new Date(date)
  return (
    date.getHours() +
    'h ' +
    date.getDate() +
    '/' +
    date.getMonth() +
    '/' +
    date.getFullYear()
  )
}
