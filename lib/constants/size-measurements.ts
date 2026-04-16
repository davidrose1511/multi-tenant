export interface SizeMeasurement {
  bust: string;
  waist: string;
  hips: string;
  length?: string;
}

export const SIZE_MEASUREMENTS: Record<string, SizeMeasurement> = {
  XS: { bust: '32"', waist: '26"', hips: '36"' },
  S: { bust: '34"', waist: '28"', hips: '38"' },
  M: { bust: '36"', waist: '30"', hips: '40"' },
  L: { bust: '38"', waist: '32"', hips: '42"' },
  XL: { bust: '40"', waist: '34"', hips: '44"' },
  XXL: { bust: '42"', waist: '36"', hips: '46"' },
  "Free Size": { bust: '36-40"', waist: '30-34"', hips: '40-44"' },
  Unstitched: { bust: "—", waist: "—", hips: "—" },
  Custom: { bust: "Custom", waist: "Custom", hips: "Custom" },
};

// Shown below the size selector when a size is active
// Fixed version using backticks
export const SIZE_FIT_LABEL: Record<string, string> = {
  XS: `To fit: Bust 32" · Waist 26" · Hips 36"`,
  S: `To fit: Bust 34" · Waist 28" · Hips 38"`,
  M: `To fit: Bust 36" · Waist 30" · Hips 40"`,
  L: `To fit: Bust 38" · Waist 32" · Hips 42"`,
  XL: `To fit: Bust 40" · Waist 34" · Hips 44"`,
  XXL: `To fit: Bust 42" · Waist 36" · Hips 46"`,
  "Free Size": `To fit: Bust 36–40" · Waist 30–34" · Hips 40–44"`,
  Unstitched: "Unstitched fabric — tailored to your measurements",
  Custom: "Custom sizing — we'll reach out for your measurements",
};
