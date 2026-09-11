export interface ValidationRules {
  [key: string]: {
    required?: boolean | string
    minLength?: number | { value: number; message: string }
    maxLength?: number | { value: number; message: string }
    pattern?: { value: RegExp; message: string }
    custom?: (value: string) => string | undefined
  }
}

export interface ValidationErrors {
  [key: string]: string
}

export function validateForm(
  formData: Record<string, string>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field] || ''

    // Check required
    if (fieldRules.required) {
      if (!value.trim()) {
        errors[field] =
          typeof fieldRules.required === 'string'
            ? fieldRules.required
            : `${field} is required`
        continue
      }
    }

    // Check minLength
    if (fieldRules.minLength) {
      const config =
        typeof fieldRules.minLength === 'number'
          ? { value: fieldRules.minLength, message: `Minimum ${fieldRules.minLength} characters` }
          : fieldRules.minLength

      if (value.length < config.value) {
        errors[field] = config.message
      }
    }

    // Check maxLength
    if (fieldRules.maxLength) {
      const config =
        typeof fieldRules.maxLength === 'number'
          ? { value: fieldRules.maxLength, message: `Maximum ${fieldRules.maxLength} characters` }
          : fieldRules.maxLength

      if (value.length > config.value) {
        errors[field] = config.message
      }
    }

    // Check pattern
    if (fieldRules.pattern) {
      if (value && !fieldRules.pattern.value.test(value)) {
        errors[field] = fieldRules.pattern.message
      }
    }

    // Check custom validation
    if (fieldRules.custom) {
      const error = fieldRules.custom(value)
      if (error) {
        errors[field] = error
      }
    }
  }

  return errors
}

export const commonPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^(https?:\/\/)?.+\..+/,
}
