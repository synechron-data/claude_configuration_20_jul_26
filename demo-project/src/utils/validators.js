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

const MAX_PASSWORD_BYTES = 72; // bcrypt silently truncates input beyond this length

// Small illustrative blocklist of common/breached passwords. A production
// system should back this with a much larger list (e.g. a breach corpus).
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwertyui', 'qwerty123', 'letmein1', 'iloveyou', 'admin123', 'welcome1',
  'monkey123', 'football', 'baseball', 'dragon123', 'master12', 'sunshine1',
  'princess1', 'trustno1'
]);

/**
 * Validates a password meets minimum requirements.
 * Requirements: 8–72 bytes (bcrypt truncates beyond 72 bytes) and not a
 * commonly breached/guessable password.
 *
 * @param {string} password
 * @returns {boolean}
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) return false;
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return false;
  return true;
}

/**
 * Validates a password meets minimum strength requirements: at least 10
 * characters, with at least one uppercase letter, one lowercase letter,
 * one digit, and one special (non-alphanumeric) character.
 *
 * @param {string} password
 * @returns {boolean}
 */
function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 10) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
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
  validatePasswordStrength,
  validateUUID,
  sanitizeString
};
