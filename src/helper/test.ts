export const regexTest = (name: string, value: string) => {
	const regex = {
		nullable: /./,
		anything: /.+/,
		name: /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\s]+$/,
		email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
		phone: /^\d{10,11}$/,
		password:
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
		id_card: /(^\d{9}$|^\d{12}$)/,
		address: /^[^]+$/,
		bio: /.+/,
		level: /^(?=.*[a-zA-Z])[A-Za-z\d\s_'\-]*$/
	}

	return regex[name as keyof typeof regex].test(value)
}

export const numberTest = (name: string, value: number | string) => {
	const num = typeof value === 'string' ? parseFloat(value) : value
	const numberValidator = {
		greaterThanOrEqualTo: num >= 0,
		positive: num > 0,
		negative: num < 0,
		zero: num === 0,
		zeroTo100: num >= 0 && num <= 100,
		oneTo5: num >= 1 && num <= 5
	}

	const names = name.split('|')
	return names.some((n) => numberValidator[n as keyof typeof numberValidator])
}
