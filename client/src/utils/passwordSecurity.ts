import { SHA1 } from 'crypto-js';

/**
 * Checks if a password has been found in known data breaches using the "Have I Been Pwned" API
 * Uses the k-anonymity model, where only the first 5 characters of the password hash are sent to the API
 * 
 * @param password - The password to check
 * @returns A promise that resolves to a boolean indicating if the password was found in a breach
 */
export async function checkBreachedPassword(password: string): Promise<boolean> {
  try {
    // Create SHA-1 hash of the password
    const passwordHash = SHA1(password).toString().toUpperCase();
    
    // Split the hash into prefix (first 5 chars) and suffix (remaining chars)
    const prefix = passwordHash.substring(0, 5);
    const suffix = passwordHash.substring(5);
    
    // Call the API with the prefix
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) {
      console.error('Failed to check password breach status:', response.statusText);
      return false;
    }
    
    // Get the text response which contains suffixes and counts
    const data = await response.text();
    
    // Split the response into lines and check if our suffix is in there
    const breachData = data.split('\r\n');
    
    // Look for our suffix in the response data
    for (const breach of breachData) {
      const [hashSuffix] = breach.split(':');
      if (hashSuffix === suffix) {
        return true; // Password has been found in a breach
      }
    }
    
    return false; // Password wasn't found in any breaches
  } catch (error) {
    console.error('Error checking breached password:', error);
    return false;
  }
}

/**
 * Provides a human-readable message about password breach status
 * 
 * @param isBreached - Whether the password was found in a breach
 * @returns A string message about the password security
 */
export function getBreachMessage(isBreached: boolean): string {
  return isBreached 
    ? 'This password has been found in data breaches. We strongly recommend changing it to a secure, unique password.'
    : 'Good news! This password hasn\'t been found in known data breaches.';
}