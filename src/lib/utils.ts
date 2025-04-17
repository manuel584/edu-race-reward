
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a secure random password with specified length
 * @param length The length of the password (default: 12)
 * @returns A random password string
 */
export function generatePassword(length: number = 12): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  const getRandomChar = (charSet: string) => 
    charSet.charAt(Math.floor(Math.random() * charSet.length));
  
  // Ensure at least one character from each category
  const password = [
    getRandomChar(uppercaseChars),
    getRandomChar(lowercaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars)
  ];
  
  // Fill the rest of the password
  while (password.length < length) {
    password.push(getRandomChar(allChars));
  }
  
  // Shuffle the password
  return password
    .sort(() => 0.5 - Math.random())
    .join('');
}
