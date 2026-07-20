const { validateEmail } = require('../../src/utils/validators');

describe('validateEmail', () => {
  test('accepts a well-formed email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('accepts an email with dots and a plus tag in the local-part', () => {
    expect(validateEmail('john.doe+test@example.co.uk')).toBe(true);
  });

  test('trims surrounding whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
  });

  test('rejects non-string input', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(12345)).toBe(false);
  });

  test('rejects a missing @ or domain dot', () => {
    expect(validateEmail('userexample.com')).toBe(false);
    expect(validateEmail('user@examplecom')).toBe(false);
  });

  test('rejects an email whose total length exceeds 254 characters', () => {
    const longLocal = 'a'.repeat(64);
    const longDomain = `${'b'.repeat(190)}.com`;
    const tooLong = `${longLocal}@${longDomain}`;
    expect(tooLong.length).toBeGreaterThan(254);
    expect(validateEmail(tooLong)).toBe(false);
  });

  test('rejects a local-part longer than 64 characters', () => {
    const longLocal = 'a'.repeat(65);
    expect(validateEmail(`${longLocal}@example.com`)).toBe(false);
  });

  test('accepts a local-part exactly 64 characters long', () => {
    const maxLocal = 'a'.repeat(64);
    expect(validateEmail(`${maxLocal}@example.com`)).toBe(true);
  });

  test('rejects a local-part with a leading dot', () => {
    expect(validateEmail('.user@example.com')).toBe(false);
  });

  test('rejects a local-part with a trailing dot', () => {
    expect(validateEmail('user.@example.com')).toBe(false);
  });

  test('rejects consecutive dots in the local-part', () => {
    expect(validateEmail('us..er@example.com')).toBe(false);
  });

  test('rejects consecutive dots in the domain', () => {
    expect(validateEmail('user@example..com')).toBe(false);
  });
});
