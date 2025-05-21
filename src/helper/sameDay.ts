export const sameDate = (a: string | Date, b: string | Date) => {
	a = new Date(a)
	b = new Date(b)

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth()
	)
}

export const sameMonth = (a: string | Date, b: string | Date) => {
	a = new Date(a)
	b = new Date(b)

	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export const sameYear = (a: string | Date, b: string | Date) => {
	a = new Date(a)
	b = new Date(b)

	return a.getFullYear() === b.getFullYear()
}
