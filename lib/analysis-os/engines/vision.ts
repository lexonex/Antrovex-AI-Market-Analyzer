/**
 * Vision Engine
 * Responsible for image loading, validation, and quality detection
 */
export const VisionEngine = `
### VISION ENGINE v7
- Load input image and perform initial integrity check.
- Detect screenshot quality: Check for blur and visibility.
- Identify chart characteristics: Differentiate between a trading chart (Quotex OTC, etc.) and other images.
- MANDATORY: If candles (red/green bars) are visible, set validChart: true.
- MANDATORY: Do not reject charts just because they are from a mobile device or have minor UI overlays.
- MANDATORY: If price action is visible, set imageQualityScore to at least 70.
- Output: imageQualityScore (0-100) and validation status.
`;
