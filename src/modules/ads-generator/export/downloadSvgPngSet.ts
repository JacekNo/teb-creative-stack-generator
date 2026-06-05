import JSZip from 'jszip';
import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from '../renderer/googleAdsFormats';
import { GOOGLE_ADS_FORMATS } from '../renderer/googleAdsFormats';
import { renderAdSvg } from '../renderer/renderAdSvg';
import {
  getCreativePngFileName,
  getCreativeZipFileName,
} from './fileNaming';
import {
  formatFileSize,
  getGoogleAdsAssetSizeStatus,
} from './googleAdsAssetLimits';

type SvgExportItem = {
  format: GoogleAdsFormat;
  svg: string;
  fileName: string;
};

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('Nie udało się odczytać pliku jako data URL.'));
    };

    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(assetUrl: string): Promise<string> {
  const response = await fetch(assetUrl);

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać assetu: ${assetUrl}`);
  }

  const blob = await response.blob();

  return blobToDataUrl(blob);
}

function resolveAssetUrl(rawHref: string): string {
  if (rawHref.startsWith('data:')) {
    return rawHref;
  }

  return new URL(rawHref, window.location.origin).toString();
}

async function inlineSvgImages(svgSource: string): Promise<string> {
  const parser = new DOMParser();
  const documentSvg = parser.parseFromString(svgSource, 'image/svg+xml');

  const parserError = documentSvg.querySelector('parsererror');

  if (parserError) {
    throw new Error('SVG ma niepoprawną strukturę i nie może zostać wyeksportowany.');
  }

  const imageNodes = Array.from(documentSvg.querySelectorAll('image'));

  await Promise.all(
    imageNodes.map(async (imageNode) => {
      const href =
        imageNode.getAttribute('href') ??
        imageNode.getAttribute('xlink:href') ??
        imageNode.getAttributeNS('http://www.w3.org/1999/xlink', 'href');

      if (!href || href.startsWith('data:')) {
        return;
      }

      const absoluteUrl = resolveAssetUrl(href);
      const dataUrl = await fetchAsDataUrl(absoluteUrl);

      imageNode.setAttribute('href', dataUrl);
      imageNode.removeAttribute('xlink:href');
    }),
  );

  return new XMLSerializer().serializeToString(documentSvg);
}

function loadImageFromSvg(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svg], {
      type: 'image/svg+xml;charset=utf-8',
    });

    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Nie udało się wyrenderować SVG jako obrazu.'));
    };

    image.src = url;
  });
}

async function svgToPngBlob(
  svgSource: string,
  format: GoogleAdsFormat,
): Promise<Blob> {
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const inlinedSvg = await inlineSvgImages(svgSource);
  const image = await loadImageFromSvg(inlinedSvg);

  const canvas = document.createElement('canvas');
  canvas.width = format.width;
  canvas.height = format.height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Nie udało się utworzyć kontekstu canvas.');
  }

  context.clearRect(0, 0, format.width, format.height);
  context.drawImage(image, 0, 0, format.width, format.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Nie udało się wygenerować pliku PNG.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

function getExportItems(creative: ResolvedCreativeInput): SvgExportItem[] {
  return GOOGLE_ADS_FORMATS.map((format) => ({
    format,
    svg: renderAdSvg(creative, format),
    fileName: getCreativePngFileName(creative, format),
  }));
}

export async function downloadCreativePngSet(
  creative: ResolvedCreativeInput,
): Promise<void> {
  const exportItems = getExportItems(creative);
  const zip = new JSZip();

  for (const item of exportItems) {
    const pngBlob = await svgToPngBlob(item.svg, item.format);
    const sizeStatus = getGoogleAdsAssetSizeStatus(pngBlob.size);

    if (sizeStatus === 'error') {
      throw new Error(
        `Plik ${item.fileName} przekracza limit Google Ads: ${formatFileSize(
          pngBlob.size,
        )} / 5 MB.`,
      );
    }

    if (sizeStatus === 'warning') {
      console.warn(
        `Plik ${item.fileName} jest blisko limitu Google Ads: ${formatFileSize(
          pngBlob.size,
        )} / 5 MB.`,
      );
    }

    zip.file(item.fileName, pngBlob);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });

  downloadBlob(zipBlob, getCreativeZipFileName(creative));
}