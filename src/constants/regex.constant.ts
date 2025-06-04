// ===================================================================
// FRONTEND REGEX PATTERNS - CLIENT-SIDE VALIDATION ONLY
// ===================================================================
// NOTE: These patterns are for immediate UI feedback and user experience
// All critical validation is handled by backend for security
// Frontend validation can be bypassed - never trust client input

// ===================================================================
// BASIC FIELD VALIDATION PATTERNS
// ===================================================================

// Username regex pattern (alphanumeric and underscore, 3-20 characters)
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

// Basic email format check (backend has comprehensive validation)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Basic phone format check for Vietnamese numbers
export const PHONE_REGEX = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/

// Basic name validation (supports Vietnamese characters)
export const NAME_REGEX =
  /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\s'-]{2,}$/

// Basic password validation (length check only)
export const PASSWORD_REGEX = /^.{6,}$/

// ===================================================================
// CONTENT VALIDATION PATTERNS
// ===================================================================

// Bio validation (permissive for user profiles)
export const BIO_REGEX = /^.{0,3000}$/

// Generic validation patterns
export const ANYTHING_REGEX = /^.+$/
export const NULLABLE_REGEX = /^.*$/

// ===================================================================
// NUMERIC VALIDATION PATTERNS
// ===================================================================

// Amount validation (positive integer, min 1000, max 1 billion)
export const AMOUNT_REGEX = /^(?:[1-9]\d{3,9}|1000000000)$/

// Positive numbers only
export const POSITIVE_NUMBER_REGEX = /^[1-9]\d*$/

// Vietnamese currency validation (1,000 to 1,000,000,000)
export const CURRENCY_REGEX = /^(?:[1-9]\d{3,9}|1000000000)$/

// ===================================================================
// VALIDATION HELPER FUNCTIONS
// ===================================================================

/**
 * Main regex test function used throughout the application
 * @param validator - The validation type
 * @param value - The value to validate
 * @returns boolean indicating if the value passes validation
 */
export const regexTest = (validator: string, value: string): boolean => {
  if (!value && validator === 'nullable') return true
  if (!value) return false

  const validatorLower = validator.toLowerCase()

  switch (validatorLower) {
    case 'phone':
      return PHONE_REGEX.test(value)
    case 'email':
      return EMAIL_REGEX.test(value)
    case 'password':
      return PASSWORD_REGEX.test(value)
    case 'username':
      return USERNAME_REGEX.test(value)
    case 'name':
      return NAME_REGEX.test(value.trim())
    case 'bio':
      return BIO_REGEX.test(value)
    case 'anything':
      return ANYTHING_REGEX.test(value)
    case 'nullable':
      return NULLABLE_REGEX.test(value)
    case 'amount':
      return AMOUNT_REGEX.test(value)
    case 'positive':
      return POSITIVE_NUMBER_REGEX.test(value)
    case 'currency':
      return CURRENCY_REGEX.test(value)
    default:
      console.warn(`Unknown validator: ${validator}`)
      return true
  }
}

// ===================================================================
// SPECIFIC VALIDATION FUNCTIONS
// ===================================================================

export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone)
}

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password)
}

export const validateUsername = (username: string): boolean => {
  return USERNAME_REGEX.test(username)
}

export const validateAmount = (value: string | number): boolean => {
  const numValue = typeof value === 'string' ? parseInt(value) : value
  return AMOUNT_REGEX.test(numValue.toString())
}

export const validatePositiveNumber = (value: string | number): boolean => {
  const strValue = value.toString()
  return POSITIVE_NUMBER_REGEX.test(strValue)
}

export const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('84')) {
    return `+${digits}`
  } else if (digits.startsWith('0')) {
    return `+84${digits.substring(1)}`
  } else if (digits.length === 9) {
    return `+84${digits}`
  }

  return phone
}

/**
 * Get all regex patterns as an object
 * @returns Object containing all regex patterns
 */
export const getRegexPatterns = () => {
  return {
    phone: PHONE_REGEX,
    email: EMAIL_REGEX,
    password: PASSWORD_REGEX,
    username: USERNAME_REGEX,
    name: NAME_REGEX,
    bio: BIO_REGEX,
    anything: ANYTHING_REGEX,
    nullable: NULLABLE_REGEX,
    amount: AMOUNT_REGEX,
    positive: POSITIVE_NUMBER_REGEX,
    currency: CURRENCY_REGEX
  }
}
