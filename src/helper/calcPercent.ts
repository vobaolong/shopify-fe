interface PriceDecimal {
  $numberDecimal: number
}

export const calcPercent = (
  price: PriceDecimal = { $numberDecimal: 0 },
  salePrice: PriceDecimal = { $numberDecimal: 0 }
) => {
  let salePercent = Math.round(
    ((price.$numberDecimal - salePrice.$numberDecimal) / price.$numberDecimal) *
      100
  )
  return salePercent
}
