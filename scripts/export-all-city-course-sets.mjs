import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import { Resvg } from '@resvg/resvg-js';
import { createServer } from 'vite';

const DEFAULT_OUT_DIR = 'exports/google-ads-all';
const GOOGLE_ADS_MAX_IMAGE_BYTES = 5120 * 1024;

function parseArgs(argv) {
  const args = {
    all: false,
    dryRun: false,
    city: '',
    brand: '',
    out: DEFAULT_OUT_DIR,
    limitCourses: 0,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--all') {
      args.all = true;
      continue;
    }

    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (arg === '--city') {
      args.city = argv[index + 1] ?? '';
      index += 1;
      continue;
    }

    if (arg === '--brand') {
      args.brand = argv[index + 1] ?? '';
      index += 1;
      continue;
    }

    if (arg === '--out') {
      args.out = argv[index + 1] ?? DEFAULT_OUT_DIR;
      index += 1;
      continue;
    }

    if (arg === '--limit-courses') {
      args.limitCourses = Number(argv[index + 1] ?? 0);
      index += 1;
      continue;
    }
  }

  return args;
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function formatFileSize(bytes) {
  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }

  return `${(kb / 1024).toFixed(2)} MB`;
}

function getCityCode(city) {
  return city?.city_code || city?.city_id || city?.city || city?.city_raw || 'miasto';
}

function getBatchZipFileName(city, brand, count) {
  const cityCode = slugify(getCityCode(city));
  const brandPart = slugify(brand || 'all-brands');

  return `google-ads_${cityCode}_${brandPart}_${count}-setow.zip`;
}

function getAssetFilePath(repoRoot, rawHref) {
  if (!rawHref || rawHref.startsWith('data:')) {
    return null;
  }

  const cleanHref = rawHref.split('#')[0].split('?')[0];

  if (cleanHref.startsWith('/')) {
    return path.join(repoRoot, 'public', cleanHref);
  }

  return path.join(repoRoot, 'public', cleanHref);
}

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.png') return 'image/png';
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.svg') return 'image/svg+xml';
  if (extension === '.woff') return 'font/woff';
  if (extension === '.woff2') return 'font/woff2';

  return 'application/octet-stream';
}

async function fileToDataUrl(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  const mimeType = getMimeType(filePath);

  return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
}

async function inlineSvgImages(svgSource, repoRoot) {
  const imageHrefRegex = /<image\b[^>]*?(?:href|xlink:href)=["']([^"']+)["'][^>]*?>/gi;
  const matches = Array.from(svgSource.matchAll(imageHrefRegex));

  let inlinedSvg = svgSource;

  for (const match of matches) {
    const href = match[1];

    if (!href || href.startsWith('data:')) {
      continue;
    }

    const filePath = getAssetFilePath(repoRoot, href);

    if (!filePath) {
      continue;
    }

    const dataUrl = await fileToDataUrl(filePath);

    inlinedSvg = inlinedSvg.split(href).join(dataUrl);
  }

  return inlinedSvg;
}

async function getFontFiles(repoRoot) {
  const fontsRoot = path.join(repoRoot, 'public', 'creative-stack', 'fonts', 'roc-grotesk');

  try {
    const fontDirs = await fs.readdir(fontsRoot, { withFileTypes: true });
    const fontFiles = [];

    for (const fontDir of fontDirs) {
      if (!fontDir.isDirectory()) continue;

      const familyDir = path.join(fontsRoot, fontDir.name);
      const files = await fs.readdir(familyDir);
      const preferred = files.find((file) => file.endsWith('.woff2')) ?? files.find((file) => file.endsWith('.woff'));

      if (preferred) {
        fontFiles.push(path.join(familyDir, preferred));
      }
    }

    return fontFiles;
  } catch {
    return [];
  }
}

async function renderSvgToPngBuffer(svgSource, format, repoRoot, fontFiles) {
  const inlinedSvg = await inlineSvgImages(svgSource, repoRoot);

  const resvg = new Resvg(inlinedSvg, {
    fitTo: {
      mode: 'width',
      value: format.width,
    },
    font: {
      fontFiles,
      loadSystemFonts: true,
      defaultFontFamily: 'Arial',
    },
  });

  return resvg.render().asPng();
}

function resolveCities(cities, args) {
  if (args.all) {
    return cities;
  }

  if (!args.city) {
    throw new Error('Podaj --city PIO albo --all. Dla testu użyj np. --city PIO.');
  }

  const requested = slugify(args.city);
  const selected = cities.filter((city) => {
    return [city.city_code, city.city_id, city.city, city.city_raw]
      .filter(Boolean)
      .map((value) => slugify(value))
      .includes(requested);
  });

  if (!selected.length) {
    throw new Error(`Nie znaleziono miasta dla argumentu --city ${args.city}.`);
  }

  return selected;
}

function resolveCourses(courses, args) {
  let selected = courses;

  if (args.brand) {
    const requestedBrand = slugify(args.brand);

    selected = selected.filter((course) => slugify(course.brand_key) === requestedBrand);
  }

  if (args.limitCourses > 0) {
    selected = selected.slice(0, args.limitCourses);
  }

  return selected;
}

async function loadGeneratorModules(repoRoot) {
  const vite = await createServer({
    root: repoRoot,
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
    logLevel: 'error',
  });

  try {
    const resolverModule = await vite.ssrLoadModule('/src/modules/ads-generator/utils/creativeResolver.ts');
    const formatsModule = await vite.ssrLoadModule('/src/modules/ads-generator/renderer/googleAdsFormats.ts');
    const renderModule = await vite.ssrLoadModule('/src/modules/ads-generator/renderer/renderAdSvg.ts');
    const namingModule = await vite.ssrLoadModule('/src/modules/ads-generator/export/fileNaming.ts');

    return {
      vite,
      getCities: resolverModule.getCities,
      getCourses: resolverModule.getCourses,
      resolveCreativeInput: resolverModule.resolveCreativeInput,
      GOOGLE_ADS_FORMATS: formatsModule.GOOGLE_ADS_FORMATS,
      renderAdSvg: renderModule.renderAdSvg,
      getCreativeFolderName: namingModule.getCreativeFolderName,
      getCreativePngFileName: namingModule.getCreativePngFileName,
    };
  } catch (error) {
    await vite.close();
    throw error;
  }
}

async function exportCityZip(options) {
  const {
    city,
    courses,
    repoRoot,
    outputRoot,
    fontFiles,
    resolveCreativeInput,
    renderAdSvg,
    formats,
    getCreativeFolderName,
    getCreativePngFileName,
  } = options;

  const zip = new JSZip();
  const failures = [];
  let generatedSets = 0;
  let generatedFiles = 0;

  const cityLabel = city.city_code || city.city_id || city.city || 'miasto';
  console.log(`\n[${cityLabel}] Start: ${courses.length} kierunków`);

  for (const [courseIndex, course] of courses.entries()) {
    try {
      const creative = resolveCreativeInput(course.record_id, city.city_id);
      const folderName = getCreativeFolderName(creative);
      const folder = zip.folder(folderName);

      for (const format of formats) {
        const svg = renderAdSvg(creative, format);
        const pngBuffer = await renderSvgToPngBuffer(svg, format, repoRoot, fontFiles);

        if (pngBuffer.length > GOOGLE_ADS_MAX_IMAGE_BYTES) {
          throw new Error(
            `Plik przekracza limit Google Ads 5 MB: ${getCreativePngFileName(
              creative,
              format,
            )} (${formatFileSize(pngBuffer.length)})`,
          );
        }

        folder.file(getCreativePngFileName(creative, format), pngBuffer);
        generatedFiles += 1;
      }

      generatedSets += 1;

      const progress = `${courseIndex + 1}/${courses.length}`;
      process.stdout.write(`\r[${cityLabel}] ${progress} setów`);
    } catch (error) {
      failures.push({
        cityId: city.city_id,
        cityCode: city.city_code,
        courseId: course.record_id,
        courseName: course.course_name_raw,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  process.stdout.write('\n');

  if (failures.length) {
    zip.file('_failures.json', JSON.stringify(failures, null, 2));
  }

  const zipFileName = getBatchZipFileName(city, options.brandLabel, generatedSets);
  const zipPath = path.join(outputRoot, zipFileName);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });

  await fs.writeFile(zipPath, zipBuffer);

  console.log(
    `[${cityLabel}] Gotowe: ${zipFileName} | ${generatedSets} setów | ${generatedFiles} plików | ${formatFileSize(
      zipBuffer.length,
    )}`,
  );

  if (failures.length) {
    console.warn(`[${cityLabel}] Błędy: ${failures.length}. Szczegóły w _failures.json w ZIP-ie.`);
  }
}

async function main() {
  const repoRoot = process.cwd();
  const args = parseArgs(process.argv.slice(2));
  const outputRoot = path.resolve(repoRoot, args.out);

  const modules = await loadGeneratorModules(repoRoot);

  try {
    const cities = modules.getCities();
    const courses = modules.getCourses();
    const selectedCities = resolveCities(cities, args);
    const selectedCourses = resolveCourses(courses, args);
    const totalSets = selectedCities.length * selectedCourses.length;
    const totalFiles = totalSets * modules.GOOGLE_ADS_FORMATS.length;

    console.log('TEB Creative Stack — full export');
    console.log(`Miasta: ${selectedCities.length}`);
    console.log(`Kierunki: ${selectedCourses.length}`);
    console.log(`Sety: ${totalSets}`);
    console.log(`Pliki PNG: ${totalFiles}`);
    console.log(`Output: ${outputRoot}`);

    if (args.dryRun) {
      console.log('Dry run: bez generowania plików.');
      return;
    }

    await fs.mkdir(outputRoot, { recursive: true });

    const fontFiles = await getFontFiles(repoRoot);

    if (!fontFiles.length) {
      console.warn('Nie znaleziono fontów Roc Grotesk w public/creative-stack/fonts. Zostanie użyty fallback.');
    }

    const brandLabel = args.brand ? slugify(args.brand) : 'all-brands';

    for (const city of selectedCities) {
      await exportCityZip({
        city,
        courses: selectedCourses,
        repoRoot,
        outputRoot,
        fontFiles,
        resolveCreativeInput: modules.resolveCreativeInput,
        renderAdSvg: modules.renderAdSvg,
        formats: modules.GOOGLE_ADS_FORMATS,
        getCreativeFolderName: modules.getCreativeFolderName,
        getCreativePngFileName: modules.getCreativePngFileName,
        brandLabel,
      });
    }

    console.log('\nEksport zakończony.');
  } finally {
    await modules.vite.close();
  }
}

main().catch((error) => {
  console.error('\nBłąd eksportu:');
  console.error(error);
  process.exitCode = 1;
});
