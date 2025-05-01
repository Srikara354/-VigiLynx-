import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

/**
 * Combines multiple class names and optimizes them for Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes user-generated content to prevent XSS
 */
export function sanitizeContent(content) {
  return DOMPurify.sanitize(content);
}

/**
 * Formats a date string to locale format
 */
export function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  try {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Validates URL, domain, hash, or IP address
 */
export function validateInput(value, type) {
  if (type === 'scan') {
    const isUrl = value.includes('://') || value.startsWith('www.');
    const isHash = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(value);
    const isDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(value);
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
    return isUrl || isHash || isDomain || isIp || value === '';
  } else if (type === 'file') {
    return !!value;
  }
  return false;
}

/**
 * Gets severity color based on score
 */
export function getSeverityColor(score) {
  if (score >= 7) return 'danger';
  if (score >= 4) return 'warning';
  return 'success';
}

/**
 * Determines security risk level from score
 */
export function getRiskLevel(score) {
  if (score >= 7) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

/**
 * Truncates text with ellipsis
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
