import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function feetToFraction(decimalFeet) {
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
