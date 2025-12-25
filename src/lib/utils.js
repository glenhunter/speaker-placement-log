import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Validates and parses a numeric input value.
 * Returns the parsed number or null if invalid.
 */
export function parseNumericInput(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

export function feetToFraction(decimalFeet) {
  if (decimalFeet === null || decimalFeet === undefined || Number.isNaN(decimalFeet)) {
    return "—";
  }
  const totalInches = decimalFeet * 12;
  const roundedInches = Math.round(totalInches * 4) / 4; // Round to nearest quarter inch

  const feet = Math.floor(roundedInches / 12);
  const remainingInches = roundedInches - (feet * 12);

  const wholeInches = Math.floor(remainingInches);
  const fraction = remainingInches - wholeInches;

  let fractionString = "";
  if (fraction === 0.25) {
    fractionString = " 1/4";
  } else if (fraction === 0.5) {
    fractionString = " 1/2";
  } else if (fraction === 0.75) {
    fractionString = " 3/4";
  }

  // No feet, only fraction (e.g., "1/4"")
  if (feet === 0 && wholeInches === 0 && fractionString) {
    return `${fractionString.trim()}"`;
  }

  // No feet (e.g., "5"", "5 1/2"")
  if (feet === 0) {
    return `${wholeInches}${fractionString}"`;
  }

  // Only feet, no inches (e.g., "8'")
  if (wholeInches === 0 && !fractionString) {
    return `${feet}'`;
  }

  // Feet + fraction, no whole inches (e.g., "8' 1/2"")
  if (wholeInches === 0 && fractionString) {
    return `${feet}'${fractionString}"`;
  }

  // Feet + inches (e.g., "8' 5"", "8' 5 1/2"")
  return `${feet}' ${wholeInches}${fractionString}"`;
}

/**
 * Converts centimetres to metres and centimetres format
 * @param {number} cm - Value in centimetres
 * @returns {string} - Formatted string like "2m 15.9cm"
 */
export function cmToMetres(cm) {
  if (cm === null || cm === undefined || Number.isNaN(cm)) {
    return "—";
  }

  const metres = Math.floor(cm / 100);
  const remainingCm = cm % 100;

  // Only centimetres (e.g., "45.5cm")
  if (metres === 0) {
    return `${remainingCm.toFixed(1)}cm`;
  }

  // Only metres (e.g., "2m")
  if (remainingCm === 0) {
    return `${metres}m`;
  }

  // Metres + centimetres (e.g., "2m 15.9cm")
  return `${metres}m ${remainingCm.toFixed(1)}cm`;
}

/**
 * Parses imperial format string (e.g., "8' 10"", "10"", "8'", "10") to feet
 * @param {string} input - The input string
 * @returns {number|null} - Value in feet, or null if invalid
 */
export function parseImperial(input) {
  if (!input || input.trim() === "") return null;

  const str = input.trim();

  // Match patterns like "8' 10"" or "8'10"" or "8'" or "10"" or just "10"
  const imperialPattern = /^(\d+(?:\.\d+)?)'?\s*(\d+(?:\.\d+)?)?"?$|^(\d+(?:\.\d+)?)'$|^(\d+(?:\.\d+)?)"\s*$/;

  // Try to match feet and inches: "8' 10"" or "8'10""
  const feetInchesMatch = str.match(/^(\d+(?:\.\d+)?)'?\s*(\d+(?:\.\d+)?)"$/);
  if (feetInchesMatch) {
    const feet = parseFloat(feetInchesMatch[1]);
    const inches = parseFloat(feetInchesMatch[2]);
    return feet + (inches / 12);
  }

  // Try to match just feet: "8'"
  const feetOnlyMatch = str.match(/^(\d+(?:\.\d+)?)'$/);
  if (feetOnlyMatch) {
    return parseFloat(feetOnlyMatch[1]);
  }

  // Try to match just inches: "10""
  const inchesOnlyMatch = str.match(/^(\d+(?:\.\d+)?)"$/);
  if (inchesOnlyMatch) {
    return parseFloat(inchesOnlyMatch[1]) / 12;
  }

  // Try plain number (assume inches)
  const numberMatch = str.match(/^(\d+(?:\.\d+)?)$/);
  if (numberMatch) {
    return parseFloat(numberMatch[1]) / 12;
  }

  return null;
}

/**
 * Parses metric format string (e.g., "1m 30cm", "1m30cm", "30cm", "1m", "30") to feet
 * @param {string} input - The input string
 * @returns {number|null} - Value in feet, or null if invalid
 */
export function parseMetric(input) {
  if (!input || input.trim() === "") return null;

  const str = input.trim();

  // Try to match metres and centimetres: "1m 30cm" or "1m30cm"
  const metresCmMatch = str.match(/^(\d+(?:\.\d+)?)\s*m\s*(\d+(?:\.\d+)?)\s*cm$/i);
  if (metresCmMatch) {
    const metres = parseFloat(metresCmMatch[1]);
    const cm = parseFloat(metresCmMatch[2]);
    const totalCm = (metres * 100) + cm;
    return totalCm / 30.48; // Convert cm to feet
  }

  // Try to match just metres: "1m"
  const metresOnlyMatch = str.match(/^(\d+(?:\.\d+)?)\s*m$/i);
  if (metresOnlyMatch) {
    const metres = parseFloat(metresOnlyMatch[1]);
    return (metres * 100) / 30.48; // Convert to cm then to feet
  }

  // Try to match just centimetres: "30cm"
  const cmOnlyMatch = str.match(/^(\d+(?:\.\d+)?)\s*cm$/i);
  if (cmOnlyMatch) {
    const cm = parseFloat(cmOnlyMatch[1]);
    return cm / 30.48; // Convert cm to feet
  }

  // Try plain number (assume cm)
  const numberMatch = str.match(/^(\d+(?:\.\d+)?)$/);
  if (numberMatch) {
    const cm = parseFloat(numberMatch[1]);
    return cm / 30.48;
  }

  return null;
}

/**
 * Formats a distance value based on the selected unit
 * @param {number} value - The numeric value in feet
 * @param {string} unit - Either "imperial" or "metric"
 * @returns {string} - Formatted string
 */
export function formatDistance(value, unit) {
  if (value === null || value === undefined || value === "" || Number.isNaN(parseFloat(value))) {
    return "—";
  }

  const numValue = parseFloat(value);

  if (unit === "imperial") {
    // Value is in feet, format as feet and inches
    return feetToFraction(numValue);
  } else {
    // metric - convert feet to cm, then format as metres and cm
    const cm = numValue * 30.48;
    return cmToMetres(cm);
  }
}
