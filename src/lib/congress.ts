/**
 * Utility functions for handling Congress-related formatting and display
 */

export const getCongressDisplayName = (congress: number): string => {
  const j = congress % 10;
  const k = congress % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${congress}${suffix}`;
};