import { SHA1 } from 'crypto-js';
import { supabase } from '../lib/supabase';

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

/**
 * Saves a generated password to the user's account
 * 
 * @param userId - The user's ID
 * @param password - The password to save
 * @param label - A user-friendly label for the password (e.g., "GitHub Account")
 * @param username - The username associated with this password (optional)
 * @returns A promise that resolves when the password is saved
 */
export async function savePassword(
  userId: string, 
  password: string, 
  label: string,
  username?: string
): Promise<{data: any, error: any}> {
  try {
    // Don't save passwords for guest users
    if (!userId) {
      throw new Error('You must be logged in to save passwords');
    }
    
    // Store the password in the saved_passwords table
    const { data, error } = await supabase
      .from('saved_passwords')
      .insert([
        { 
          user_id: userId, 
          password_label: label,
          password_value: password,
          username: username || null,
          created_at: new Date().toISOString() 
        }
      ]);
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error saving password:', error);
    return { data: null, error };
  }
}

/**
 * Retrieves all saved passwords for a user
 * 
 * @param userId - The user's ID
 * @returns A promise that resolves to an array of saved passwords
 */
export async function getSavedPasswords(userId: string): Promise<{data: any[], error: any}> {
  try {
    if (!userId) {
      throw new Error('You must be logged in to retrieve saved passwords');
    }
    
    const { data, error } = await supabase
      .from('saved_passwords')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error retrieving saved passwords:', error);
    return { data: [], error };
  }
}

/**
 * Deletes a saved password
 * 
 * @param passwordId - The ID of the password to delete
 * @param userId - The user's ID (for verification)
 * @returns A promise that resolves when the password is deleted
 */
export async function deleteSavedPassword(passwordId: string, userId: string): Promise<{success: boolean, error: any}> {
  try {
    if (!userId) {
      throw new Error('You must be logged in to delete saved passwords');
    }
    
    const { error } = await supabase
      .from('saved_passwords')
      .delete()
      .eq('id', passwordId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting saved password:', error);
    return { success: false, error };
  }
}