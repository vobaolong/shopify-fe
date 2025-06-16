import { Role } from '../enums/OrderStatus.enum'
import {
  formatDate,
  formatMonth,
  formatYear,
  formatTime
} from './humanReadable'

export const groupByDate = (items: any[], by: string, role: string) => {
  let formatFunc = formatTime
  if (by === 'date') formatFunc = formatDate
  if (by === 'month') formatFunc = formatMonth
  if (by === 'year') formatFunc = formatYear

  return items
    ?.map((item) => {
      if (role === Role.ADMIN) {
        return {
          amount: parseFloat(item?.amountToPlatform?.$numberDecimal ?? 0),
          createdAt: formatFunc(item.createdAt)
        }
      } else {
        return {
          amountToStore: parseFloat(item?.amountToStore?.$numberDecimal ?? 0),
          amountToPlatform: parseFloat(
            item?.amountToPlatform?.$numberDecimal ?? 0
          ),
          createdAt: formatFunc(item.createdAt)
        }
      }
    })
    ?.reduce((acc: any[], value: any) => {
      let i = 0
      let flag = false

      while (i < acc.length) {
        if (acc[i][0] === value.createdAt) {
          if (role === Role.ADMIN) {
            acc[i][1] += value.amount
          } else {
            acc[i][1] += value.amountToStore
            acc[i][2] += value.amountToPlatform
          }
          flag = true
          i = acc.length
        } else i++
      }

      if (!flag) {
        if (role === Role.ADMIN) {
          acc.push([value.createdAt, value.amount])
        } else {
          acc.push([
            value.createdAt,
            value.amountToStore,
            value.amountToPlatform
          ])
        }
      }
      return acc
    }, [])
}

export const groupByJoined = (items: any[], by: string) => {
  let formatFunc = formatTime
  if (by === 'date') formatFunc = formatDate
  if (by === 'month') formatFunc = formatMonth
  if (by === 'year') formatFunc = formatYear

  return items
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((item) => {
      return {
        createdAt: formatFunc(item.createdAt)
      }
    })
    .reduce((acc: any[], value: any) => {
      let i = 0
      let flag = false

      while (i < acc.length) {
        if (acc[i][0] === value.createdAt) {
          acc[i][1] += 1
          flag = true
          i = acc.length
        } else i++
      }

      if (!flag) acc.push([value.createdAt, 1])
      return acc
    }, [])
}

export const groupBySold = (
  items: any[],
  by: string,
  role: string,
  sliceEnd: number
) => {
  return items
    .slice(0, sliceEnd)
    .map((item) => {
      return {
        name: item.name,
        sold: item.sold
      }
    })
    .reduce((acc: any[], value: any) => {
      let i = 0
      let flag = false

      while (i < acc.length) {
        if (acc[i][0] === value.name) {
          acc[i][1] = parseFloat(acc[i][1]) + parseFloat(value.sold)
          flag = true
          i = acc.length
        } else i++
      }

      if (!flag) acc.push([value.name, value.sold])
      return acc
    }, [])
}
