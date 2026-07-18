/**
 * Vision Engine
 * Responsible for image loading, validation, and quality detection
 */
export const VisionEngine = `
### VISION ENGINE v6
- Load input image and perform initial integrity check.
- Detect screenshot quality: Check for blur, resolution issues, and brightness.
- Identify chart boundaries: Ensure both price and time axes are visible.
- Verify candle visibility: Confirm that individual 1M candles are distinguishable.
- Output: imageQualityScore (0-100) and validation status.
`;
