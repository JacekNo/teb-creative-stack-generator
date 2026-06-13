export type CreativeDensity = 'compact' | 'default' | 'comfortable';

export type ResponsiveScale = ReturnType<typeof createResponsiveScale>;

const densityFactors: Record<CreativeDensity, number> = {
  compact: 0.92,
  default: 1,
  comfortable: 1.08,
};

export function createResponsiveScale(
  width: number,
  height: number,
  density: CreativeDensity = 'default',
  creativeScale = 1,
) {
  const shortSide = Math.min(width, height);
  const densityFactor = densityFactors[density];
  const u = (shortSide / 108) * densityFactor * creativeScale;

  return {
    u,

    density,
    creativeScale,

    space: {
      xs: 1 * u,
      sm: 2 * u,
      md: 3 * u,
      lg: 5 * u,
      xl: 8 * u,
      xxl: 12 * u,
    },

    radius: {
      sm: 1.6 * u,
      md: 2.4 * u,
      lg: 3.2 * u,
      xl: 4.8 * u,
      pill: 999,
    },

    font: {
      eyebrow: 2.4 * u,
      badge: 3.2 * u,
      body: 3.8 * u,
      benefit: 4.4 * u,
      titleSm: 5.4 * u,
      titleMd: 6.8 * u,
      titleLg: 8.4 * u,
      titleXl: 10 * u,
    },

    lineHeight: {
      tight: 1.02,
      title: 1.08,
      body: 1.18,
    },

    stroke: {
      hairline: Math.max(1, 0.12 * u),
      regular: Math.max(1, 0.18 * u),
    },
  };
}