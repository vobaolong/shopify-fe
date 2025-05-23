export const calcTime = (from: string | Date) => {
	const timeDiff = new Date().getTime() - new Date(from).getTime()
	const hours = timeDiff / (1000 * 3600)
	return hours
}
export const timeAgo = (dateParam: string | Date) => {
	const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
	const today = new Date()
	const seconds = Math.round((today.getTime() - date.getTime()) / 1000)
	const minutes = Math.round(seconds / 60)
	const hours = Math.round(minutes / 60)
	const days = Math.round(hours / 24)
	const weeks = Math.round(days / 7)
	const months = Math.round(days / 30)
	const years = Math.round(months / 12)

	if (seconds < 60) {
		return `${seconds} giây trước`
	} else if (minutes < 60) {
		return `${minutes} phút trước`
	} else if (hours < 24) {
		return `${hours} giờ trước`
	} else if (days < 7) {
		return `${days} ngày trước`
	} else if (weeks < 4) {
		return `${weeks} tuần trước`
	} else if (months < 12) {
		return `${months} tháng trước`
	} else {
		return `${years} năm trước`
	}
}
