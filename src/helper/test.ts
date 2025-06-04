// NOTE: Phone, Email, Name, and Password validation are handled by backend
// These patterns are kept for basic client-side feedback only

// Username regex pattern (alphanumeric and underscore, 3-20 characters)
// Frontend-specific for UI validation
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

// Basic client-side patterns (backend handles comprehensive validation)
export const PHONE_REGEX = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/ // Basic format check
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic format check
export const NAME_REGEX =
  /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\s'-]{2,}$/ // Basic format check
export const PASSWORD_REGEX = /^.{6,}$/ // Basic length check only

// Bio regex pattern (more permissive for bio text)
export const BIO_REGEX = /^.{1,3000}$/

// Anything regex (non-empty)
export const ANYTHING_REGEX = /^.+$/

// Nullable regex (allows empty or any content)
export const NULLABLE_REGEX = /^.*$/

/**
 * Comprehensive regex test function used throughout the application
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
    default:
      console.warn(`Unknown validator: ${validator}`)
      return true
  }
}

// Function to get all regex patterns
export const getRegexPatterns = () => {
  return {
    phone: PHONE_REGEX,
    email: EMAIL_REGEX,
    password: PASSWORD_REGEX,
    username: USERNAME_REGEX,
    name: NAME_REGEX,
    bio: BIO_REGEX,
    anything: ANYTHING_REGEX,
    nullable: NULLABLE_REGEX
  }
}

// Validation helper functions
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
