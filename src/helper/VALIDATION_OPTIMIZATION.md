# Frontend Validation Optimization

## Overview

This document outlines the optimization strategy for validation logic between the frontend (FE) and backend (BE) to eliminate duplication and ensure consistency.

## Backend Validation Patterns (Primary Source)

### Core Validation Patterns in Backend

Located in: `shopify-be/src/constants/regex.constant.ts`

1. **NAME_REGEX**:

   - Pattern: `/^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/`
   - Supports Vietnamese characters, numbers, spaces, underscores, apostrophes, hyphens

2. **EMAIL_REGEX**:

   - Pattern: `/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
   - Comprehensive email validation

3. **PHONE_REGEX**:

   - Pattern: `/^(0|\+?84)([35789])[0-9]{8}$/`
   - Vietnamese phone number format validation

4. **Strong Password Validation**:
   - Pattern: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/`
   - Requires: lowercase, uppercase, digit, special character, min 6 chars

## Frontend Optimization Strategy

### ✅ Removed from Frontend (Backend Handles)

- Complex password validation patterns
- Detailed email validation
- Vietnamese phone number validation
- Name validation with full character support

### 🔄 Kept in Frontend (UI-Specific)

- **AMOUNT_REGEX**: For price/amount input validation
- **CURRENCY_REGEX**: For Vietnamese currency formatting
- **POSITIVE_NUMBER_REGEX**: For UI number inputs
- **BIO_REGEX**: For profile bio validation
- **Basic validation patterns**: For immediate user feedback

### 📋 New Frontend Approach

#### Basic Client-Side Validation

```typescript
// For immediate user feedback only
export const EMAIL_BASIC_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_BASIC_REGEX = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
export const PASSWORD_MIN_LENGTH_REGEX = /^.{6,}$/
```

#### Frontend-Specific Validations

```typescript
// Amount validation (Vietnamese currency context)
export const AMOUNT_REGEX = /^(?:[1-9]\d{3,9}|1000000000)$/

// UI-specific validations
export const BIO_REGEX = /^.{0,500}$/
export const POSITIVE_NUMBER_REGEX = /^[1-9]\d*$/
```

## Implementation Guidelines

### 1. **Two-Layer Validation**

- **Frontend**: Basic format checking for immediate user feedback
- **Backend**: Comprehensive validation for security and data integrity

### 2. **Frontend Form Validation**

```typescript
// Example: Email input
const validateEmailBasic = (email: string) => {
  // Quick format check for UI feedback
  return EMAIL_BASIC_REGEX.test(email)
}

// Backend will perform final validation with EMAIL_REGEX
```

### 3. **Error Handling Strategy**

- Frontend shows basic format errors immediately
- Backend returns detailed validation errors
- Frontend displays backend validation errors after form submission

## Benefits

1. **Reduced Code Duplication**: Eliminated duplicate regex patterns
2. **Single Source of Truth**: Backend patterns are authoritative
3. **Better Performance**: Frontend only does basic checks
4. **Consistency**: All comprehensive validation happens in one place
5. **Maintainability**: Changes to validation rules only need backend updates

## Migration Notes

### Files Updated

- `src/helper/test.ts`: Simplified to basic patterns with comments
- `src/helper/regex.ts`: Focused on frontend-specific validations

### Breaking Changes

- Removed `STRONG_PASSWORD_REGEX` from frontend
- Simplified password validation to minimum length only
- Removed duplicate email/phone patterns

### Recommended Next Steps

1. Update form validation components to use new basic patterns
2. Ensure proper backend error handling and display
3. Test that all validation still works end-to-end
4. Update any imports that reference removed patterns

## Usage Examples

### Before Optimization

```typescript
// Frontend was doing complex validation
const isValidPassword = STRONG_PASSWORD_REGEX.test(password)
const isValidEmail = EMAIL_REGEX.test(email)
```

### After Optimization

```typescript
// Frontend does basic validation for UX
const hasMinLength = PASSWORD_MIN_LENGTH_REGEX.test(password)
const hasBasicEmailFormat = EMAIL_BASIC_REGEX.test(email)

// Backend does comprehensive validation
// Frontend displays backend validation errors from API response
```
