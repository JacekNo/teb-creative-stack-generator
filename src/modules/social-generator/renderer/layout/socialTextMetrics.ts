export function estimateSocialTextWidth(
  text: string,
  fontSize: number,
): number {
  return [...text].reduce((width, char) => {
    if (char === ' ') {
      return width + fontSize * 0.32;
    }

    if (/[-–—_.,:;!?/\\|]/.test(char)) {
      return width + fontSize * 0.3;
    }

    if (/[0-9]/.test(char)) {
      return width + fontSize * 0.58;
    }

    if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(char)) {
      return width + fontSize * 0.68;
    }

    if (/[mwMW]/.test(char)) {
      return width + fontSize * 0.76;
    }

    if (/[ijlI]/.test(char)) {
      return width + fontSize * 0.38;
    }

    return width + fontSize * 0.62;
  }, 0);
}
