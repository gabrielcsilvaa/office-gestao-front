export interface RawNameBarDataItem {
  name: string;
  value: string;
}

export interface ProcessedNameBarDataItem extends RawNameBarDataItem {
  barPixelWidth: number;
  barColor: string;
}

export interface ColorParams {
  hue: number;
  minSaturation: number;
  maxSaturation: number;
  minLightness: number;
  maxLightness: number;
}

// Helper to parse currency string to number
export const parseCurrencyValue = (currencyString: string): number => {
  if (!currencyString) return 0;
  return parseFloat(
    currencyString
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
};

export const processNameBarDataUtil = (
  rawData: RawNameBarDataItem[],
  maxBarPixelWidth: number,
  colorParams: ColorParams
): ProcessedNameBarDataItem[] => {
  const numericValues = rawData.map(item => parseCurrencyValue(item.value));
  const maxValue = Math.max(...numericValues, 0);
  const minValue = Math.min(...numericValues, maxValue);

  const { hue, minSaturation, maxSaturation, minLightness, maxLightness } = colorParams;

  return rawData.map((item, index) => {
    const numericValue = numericValues[index];
    // Ensure ratio is 1 if maxValue equals minValue to avoid division by zero and use max color settings
    const ratio = maxValue > minValue ? (numericValue - minValue) / (maxValue - minValue) : 1; 
    
    const barPixelWidth = maxValue > 0 ? (numericValue / maxValue) * maxBarPixelWidth : 0;

    const saturation = maxValue === minValue ? maxSaturation : minSaturation + ratio * (maxSaturation - minSaturation);
    const lightness = maxValue === minValue ? maxLightness : minLightness - ratio * (minLightness - maxLightness);

    const barColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    return {
      ...item,
      barPixelWidth: Math.max(barPixelWidth, 2), // Ensure a minimum visible width
      barColor,
    };
  });
};
