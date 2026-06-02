export type GoogleAdsFormatId = 'square_1200x1200' | 'landscape_1200x628' | 'portrait_960x1200';

export interface GoogleAdsFormat {
  id: GoogleAdsFormatId;
  label: string;
  width: number;
  height: number;
}

export const GOOGLE_ADS_FORMATS: GoogleAdsFormat[] = [
  {
    id: 'square_1200x1200',
    label: 'Square 1200×1200',
    width: 1200,
    height: 1200,
  },
  {
    id: 'landscape_1200x628',
    label: 'Landscape 1200×628',
    width: 1200,
    height: 628,
  },
  {
    id: 'portrait_960x1200',
    label: 'Portrait 960×1200',
    width: 960,
    height: 1200,
  },
];