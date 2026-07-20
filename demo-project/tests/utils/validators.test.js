const { validateEmail, validatePassword } = require('../../src/utils/validators');

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

describe('validatePassword', () => {
  test('rejects non-string input', () => {
    expect(validatePassword(null)).toBe(false);
    expect(validatePassword(undefined)).toBe(false);
    expect(validatePassword('')).toBe(false);
    expect(validatePassword(12345678)).toBe(false);
  });

  test('rejects passwords shorter than 8 characters', () => {
    expect(validatePassword('short1')).toBe(false);
  });

  test('accepts a password of 8 or more characters', () => {
    expect(validatePassword('correcthorse')).toBe(true);
  });

  test('accepts a password of exactly 72 bytes', () => {
    const maxPassword = 'a'.repeat(72);
    expect(validatePassword(maxPassword)).toBe(true);
  });

  test('rejects a password longer than 72 bytes', () => {
    const tooLong = 'a'.repeat(73);
    expect(validatePassword(tooLong)).toBe(false);
  });

  test('rejects a password whose byte length exceeds 72 even though its character length does not', () => {
    // Each 😀 is 2 UTF-16 code units / 4 UTF-8 bytes: 20 chars in JS length, 40 code units, 80 bytes.
    const multiByte = '😀'.repeat(20);
    expect(multiByte.length).toBeLessThan(72);
    expect(Buffer.byteLength(multiByte, 'utf8')).toBeGreaterThan(72);
    expect(validatePassword(multiByte)).toBe(false);
  });

  test('rejects common/breached passwords regardless of case', () => {
    expect(validatePassword('password123')).toBe(false);
    expect(validatePassword('PASSWORD123')).toBe(false);
    expect(validatePassword('welcome1')).toBe(false);
  });

  test('accepts a non-common password that meets length requirements', () => {
    expect(validatePassword('xK9#mQ2vLp')).toBe(true);
  });
});
