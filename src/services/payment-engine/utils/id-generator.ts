/**
 * ID Generator
 *
 * Generates unique identifiers for payment sessions.
 * We need two types of IDs:
 *
 * 1. `id` (Machine ID)
 *    - Format: 'pay_' + 26 random characters
 *    - Example: 'pay_abc123def456ghi789jkl012'
 *    - Used in: Databases, APIs, logs
 *    - Properties: URL-safe, case-sensitive, very low collision risk
 *
 * 2. `reference` (Human Reference)
 *    - Format: '2S-' + 6 alphanumeric characters (uppercase)
 *    - Example: '2S-A1B2C3'
 *    - Used in: Support tickets, user communication, receipts
 *    - Properties: Easy to read, easy to say over phone, short
 *
 * Why two IDs?
 * ------------
 * - Machine IDs need to be globally unique across all time (no collisions ever)
 * - Human refs need to be short and readable (collisions possible but rare, can be resolved)
 *
 * Collision probability:
 * ----------------------
 * Machine ID (26 chars, 62 possible chars): 62^26 = 2.3 × 10^46 combinations
 * Human ref (6 chars, 36 possible chars):   36^6  = 2.2 × 10^9 combinations
 *
 * At 1 million payments/day, human ref collision expected every ~6 years.
 * We handle this by checking for existing refs before assigning.
 */

/**
 * Characters used for machine IDs.
 * Includes lowercase, uppercase, and digits.
 * All URL-safe, no ambiguous characters.
 */
const MACHINE_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Characters used for human-readable references.
 * Uppercase letters and digits only.
 * Excludes ambiguous characters: 0/O, 1/I/L
 */
const HUMAN_REF_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // No I, L, O (look like 1, 1, 0)

/**
 * Generate a random string of specified length from a character set.
 *
 * Uses Math.random() which is sufficient for our use case.
 * For cryptographic purposes, use crypto.getRandomValues() instead.
 *
 * @param length - Number of characters to generate
 * @param chars - Character set to choose from
 * @returns Random string
 */
function generateRandomString(length: number, chars: string): string {
  let result = '';

  // Loop `length` times, picking a random character each time
  for (let i = 0; i < length; i++) {
    // Math.random() gives us a number between 0 and 1
    // Multiply by chars.length to get an index
    // Math.floor() rounds down to get a valid array index
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

/**
 * Generate a unique payment session ID.
 *
 * Format: 'pay_' + 26 random characters
 * Example: 'pay_abc123def456ghi789jkl012'
 *
 * This ID is used:
 * - As the primary key in the database
 * - In API endpoints: GET /api/v1/payments/pay_abc123...
 * - In logs and monitoring
 *
 * @returns A new unique payment ID
 */
export function generatePaymentId(): string {
  // Prefix makes it easy to identify what kind of ID this is
  // (useful when you have multiple ID types: pay_, usr_, txn_, etc.)
  const prefix = 'pay_';

  // 26 characters gives us 62^26 ≈ 10^46 combinations
  // Even at 1 billion IDs/second, collision expected after 10^29 years
  const randomPart = generateRandomString(26, MACHINE_ID_CHARS);

  return prefix + randomPart;
}

/**
 * Generate a human-readable payment reference.
 *
 * Format: '2S-' + 6 uppercase alphanumeric characters
 * Example: '2S-A1B2C3'
 *
 * This reference is used:
 * - In receipts shown to users
 * - In support conversations
 * - In SMS/email notifications
 *
 * Design choices:
 * - '2S-' prefix identifies it as a 2Settle reference
 * - 6 chars is short enough to read/say, long enough for reasonable uniqueness
 * - Uppercase only (no confusion between 'a' and 'A')
 * - No ambiguous characters (0/O, 1/I/L removed)
 *
 * @returns A new human-readable reference
 */
export function generatePaymentReference(): string {
  const prefix = '2S-';

  // 6 characters from our restricted set (30 chars)
  // 30^6 ≈ 729 million combinations
  const randomPart = generateRandomString(6, HUMAN_REF_CHARS);

  return prefix + randomPart;
}

/**
 * Generate both IDs at once.
 *
 * Convenience function when creating a new payment session.
 *
 * @returns Object with both id and reference
 */
export function generatePaymentIds(): { id: string; reference: string } {
  return {
    id: generatePaymentId(),
    reference: generatePaymentReference(),
  };
}

/**
 * Validate that a string is a valid payment ID format.
 *
 * @param id - String to validate
 * @returns True if valid payment ID format
 */
export function isValidPaymentId(id: string): boolean {
  // Must start with 'pay_'
  if (!id.startsWith('pay_')) {
    return false;
  }

  // Must be exactly 30 characters (4 prefix + 26 random)
  if (id.length !== 30) {
    return false;
  }

  // Random part must only contain valid characters
  const randomPart = id.slice(4);
  for (const char of randomPart) {
    if (!MACHINE_ID_CHARS.includes(char)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate that a string is a valid payment reference format.
 *
 * @param reference - String to validate
 * @returns True if valid payment reference format
 */
export function isValidPaymentReference(reference: string): boolean {
  // Must start with '2S-'
  if (!reference.startsWith('2S-')) {
    return false;
  }

  // Must be exactly 9 characters (3 prefix + 6 random)
  if (reference.length !== 9) {
    return false;
  }

  // Random part must only contain valid characters
  const randomPart = reference.slice(3);
  for (const char of randomPart) {
    if (!HUMAN_REF_CHARS.includes(char)) {
      return false;
    }
  }

  return true;
}
