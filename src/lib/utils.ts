
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculateAverageScore(scores: number[]) {
  if (!scores.length) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return parseFloat((sum / scores.length).toFixed(1));
}

export function getMonthName(month: number, short: boolean = false) {
  const monthNames = {
    long: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    short: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
  };
  
  return short ? monthNames.short[month] : monthNames.long[month];
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generatePassword(length: number = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  // Ensure at least one character from each class
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // Uppercase
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz'); // Lowercase
  password += getRandomChar('0123456789'); // Number
  password += getRandomChar('!@#$%^&*()-_=+'); // Special char
  
  // Fill the rest of the password
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password to avoid patterns
  return shuffleString(password);
}

function getRandomChar(charset: string) {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset[randomIndex];
}

function shuffleString(str: string) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export function getGradientClass(value: number, max: number = 100) {
  const percentage = (value / max) * 100;
  if (percentage >= 90) return 'from-green-500 to-emerald-500';
  if (percentage >= 75) return 'from-emerald-500 to-teal-500';
  if (percentage >= 60) return 'from-teal-500 to-cyan-500';
  if (percentage >= 45) return 'from-cyan-500 to-blue-500';
  if (percentage >= 30) return 'from-blue-500 to-indigo-500';
  if (percentage >= 15) return 'from-indigo-500 to-purple-500';
  return 'from-purple-500 to-pink-500';
}
