export function publicAssetPath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  let normalizedPath = path.trim().replace(/\\/g, '/');

  if (
    normalizedPath.startsWith('http://') ||
    normalizedPath.startsWith('https://') ||
    normalizedPath.startsWith('data:')
  ) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith(normalizedBase)) {
    normalizedPath = normalizedPath.slice(normalizedBase.length);
  }

  normalizedPath = normalizedPath.startsWith('/')
    ? normalizedPath.slice(1)
    : normalizedPath;

  return `${normalizedBase}${normalizedPath}`;
}