/**
 * Input Validation Utilities
 * Pure functions for validating user-supplied data before processing.
 */

/**
 * Checks a local-part or domain segment for a leading dot, trailing dot,
 * or consecutive dots — all invalid per RFC 5321/5322.
 *
 * @param {string} part
 * @returns {boolean}
 */
function hasInvalidDotPlacement(part) {
  return part.startsWith('.') || part.endsWith('.') || part.includes('..');
}

/**
 * Validates an email address format.
 * Enforces RFC 5321 length limits (254 total, 64 local-part) and rejects
 * leading/trailing/consecutive dots in the local-part or domain.
 *
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;

  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return false;
  if (trimmed.length > 254) return false;

  const [localPart, domain] = trimmed.split('@');
  if (localPart.length > 64) return false;
  if (hasInvalidDotPlacement(localPart) || hasInvalidDotPlacement(domain)) return false;

  return true;
}

/**
 * Validates a password meets minimum requirements.
 * Requirements: at least 8 characters.
 *
 * @param {string} password
 * @returns {boolean}
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
}

/**
 * Validates a UUID v4 string.
 *
 * @param {string} id
 * @returns {boolean}
 */
function validateUUID(id) {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Sanitizes a string by trimming whitespace and removing control characters.
 *
 * @param {string} input
 * @returns {string}
 */
function sanitizeString(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUUID,
  sanitizeString
};
