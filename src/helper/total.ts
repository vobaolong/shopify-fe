interface PriceDecimal { $numberDecimal?: string }
interface UserLevel { discount?: PriceDecimal }
interface ProductId { price?: PriceDecimal; salePrice?: PriceDecimal }
interface Item { productId: ProductId; count: string }

export const totalProducts = (items: Item[] = [], userLevel: UserLevel = {}) => {
	let totalPrice = 0
	let totalSalePrice = 0
	let amountFromUser1 = 0

	totalPrice = items.reduce(
		(prev, item) =>
			prev +
			parseFloat(item.productId?.price?.$numberDecimal || '0') *
			parseFloat(item.count),
		0
	)

	totalSalePrice = items.reduce(
		(prev, item) =>
			prev +
			parseFloat(item.productId?.salePrice?.$numberDecimal || '0') *
			parseFloat(item.count),
		0
	)

	amountFromUser1 =
		(totalSalePrice *
			(100 - parseFloat(userLevel.discount?.$numberDecimal || '0'))) /
		100 || totalSalePrice

	return { totalPrice, totalSalePrice, amountFromUser1 }
}

export const totalShippingFee = (delivery: number = 0, userLevel: UserLevel = {}) => {
	const shippingFee =
		(delivery * (100 - parseFloat(userLevel.discount?.$numberDecimal || '0'))) /
		100 || delivery

	return { delivery, shippingFee }
}

interface StoreLevel { discount?: PriceDecimal }
interface Commission { fee?: PriceDecimal }

export const totalCommission = (
	items: Item[] = [],
	storeLevel: StoreLevel = {},
	commission: Commission = {}
) => {
	let totalPrice = 0
	let totalSalePrice = 0
	let amountFromStore = 0
	let amountToStore = 0

	totalPrice = items.reduce(
		(prev, item) =>
			prev +
			parseFloat(item.productId.price?.$numberDecimal || '0') *
			parseFloat(item.count),
		0
	)

	totalSalePrice = items.reduce(
		(prev, item) =>
			prev +
			parseFloat(item.productId.salePrice?.$numberDecimal || '0') *
			parseFloat(item.count),
		0
	)

	amountFromStore =
		(totalSalePrice *
			(parseFloat(commission.fee?.$numberDecimal || '0') -
				parseFloat(storeLevel.discount?.$numberDecimal || '0'))) /
		100 || 0

	amountToStore = totalSalePrice - amountFromStore

	return { totalPrice, totalSalePrice, amountFromStore, amountToStore }
}
