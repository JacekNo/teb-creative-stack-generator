export const GOOGLE_ADS_IMAGE_ASSET_MAX_BYTES = 5120 * 1024;
export const GOOGLE_ADS_IMAGE_ASSET_WARNING_BYTES = 4500 * 1024;

export function formatFileSize(bytes: number): string {
  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }

  return `${(kb / 1024).toFixed(2)} MB`;
}

export function getGoogleAdsAssetSizeStatus(bytes: number): 'ok' | 'warning' | 'error' {
  if (bytes > GOOGLE_ADS_IMAGE_ASSET_MAX_BYTES) {
    return 'error';
  }

  if (bytes > GOOGLE_ADS_IMAGE_ASSET_WARNING_BYTES) {
    return 'warning';
  }

  return 'ok';
}