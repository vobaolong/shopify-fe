// Frontend-specific regex patterns for UI validation
// NOTE: Core validation (email, phone, name, password) is handled by backend

// Validate amount (positive integer, min 1000, max 1 billion)
export const AMOUNT_REGEX = /^(?:[1-9]\d{3,9}|1000000000)$/

// Basic client-side password validation (simplified - backend handles complexity)
export const PASSWORD_MIN_LENGTH_REGEX = /^.{6,}$/

// Validate positive numbers only
export const POSITIVE_NUMBER_REGEX = /^[1-9]\d*$/

// Validate Vietnamese currency (1,000 to 1,000,000,000)
export const CURRENCY_REGEX = /^(?:[1-9]\d{3,9}|1000000000)$/

// Bio validation (for user profiles)
export const BIO_REGEX = /^.{0,500}$/

// Basic client-side validation patterns (for immediate user feedback)
// Final validation is always done on backend
export const EMAIL_BASIC_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_BASIC_REGEX = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/

// Helper functions
export const validateAmount = (value: string | number): boolean => {
  const numValue = typeof value === 'string' ? parseInt(value) : value
  return AMOUNT_REGEX.test(numValue.toString())
}

export const validatePasswordMinLength = (password: string): boolean => {
  return PASSWORD_MIN_LENGTH_REGEX.test(password)
}

export const validatePositiveNumber = (value: string | number): boolean => {
  const strValue = value.toString()
  return POSITIVE_NUMBER_REGEX.test(strValue)
}

export const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5
}

export const validateBasicEmail = (email: string): boolean => {
  return EMAIL_BASIC_REGEX.test(email)
}

export const validateBasicPhone = (phone: string): boolean => {
  return PHONE_BASIC_REGEX.test(phone)
}
