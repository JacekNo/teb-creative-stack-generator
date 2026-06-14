const KNOWN_PUBLIC_ASSET_PATHS = new Set([
  'creative-stack/logos/teb-edukacja.svg',
]);

function normalizePublicAssetPath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  let normalizedPath = path.trim().replace(/\\/g, '/');

  if (normalizedPath.startsWith(normalizedBase)) {
    normalizedPath = normalizedPath.slice(normalizedBase.length);
  }

  return normalizedPath.startsWith('/')
    ? normalizedPath.slice(1)
    : normalizedPath;
}

export function publicAssetExists(path: string | undefined): boolean {
  if (!path) {
    return false;
  }

  const normalizedPath = path.trim();

  if (
    normalizedPath.startsWith('http://') ||
    normalizedPath.startsWith('https://') ||
    normalizedPath.startsWith('data:')
  ) {
    return true;
  }

  return KNOWN_PUBLIC_ASSET_PATHS.has(normalizePublicAssetPath(normalizedPath));
}
