// utils/validation.js - Input validation utilities
class ValidationUtils {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    // Basic phone validation - adjust regex based on your requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  static isValidName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  }

  static sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }

  static validateOrderItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, message: "Order must contain at least one item" };
    }

    for (const item of items) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        return { valid: false, message: "Invalid item data" };
      }

      if (item.quantity <= 0 || item.quantity > 99) {
        return {
          valid: false,
          message: "Invalid quantity for item: " + item.name,
        };
      }

      if (item.price <= 0) {
        return {
          valid: false,
          message: "Invalid price for item: " + item.name,
        };
      }
    }

    return { valid: true };
  }

  static validateUserInfo(userInfo) {
    const errors = [];

    if (!this.isValidName(userInfo.name)) {
      errors.push("Name must be between 2-50 characters");
    }

    if (!this.isValidPhone(userInfo.phone)) {
      errors.push("Please provide a valid phone number");
    }

    if (!this.isValidEmail(userInfo.email)) {
      errors.push("Please provide a valid email address");
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }
}

module.exports = ValidationUtils;
