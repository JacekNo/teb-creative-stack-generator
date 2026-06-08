<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AdsFormatPreview from "./AdsFormatPreview.vue";
import {
  getBrands,
  getCities,
  getCourses,
  resolveCreativeInput,
} from "../utils/creativeResolver";
import { validateGoogleAdsCreative } from "../validators/validateGoogleAdsCreative";
import type {
  BrandKey,
  CourseRecord,
  ResolvedCreativeInput,
} from "../types/ads.types";
import type {
  CreativeValidationLevel,
  CreativeValidationResult,
} from "../validators/validateGoogleAdsCreative";
import { downloadCreativeBatchPngSet } from "../export/downloadSvgPngSet";
import { getBatchZipFileName } from "../export/fileNaming";

type StatusFilter = "all" | CreativeValidationLevel;
type ValidationFieldFilter =
  | "all"
  | "title"
  | "subtitle"
  | "city"
  | "cta"
  | "layout"
  | "image"
  | "course"
  | "city-data"
  | "brand";

type FormatFilter =
  | "all"
  | "square_1200x1200"
  | "landscape_1200x628"
  | "portrait_960x1200";
interface QualityRow {
  course: CourseRecord;
  creative: ResolvedCreativeInput | null;
  validation: CreativeValidationResult | null;
  status: CreativeValidationLevel;
  messagesCount: number;
  error: string;
}

const courses = getCourses();
const cities = getCities();
const brands = getBrands();

const selectedCityId = ref(
  cities.find((city) => city.city_id === "piotrkow-trybunalski")?.city_id ??
    cities[0]?.city_id ??
    "",
);
const selectedValidationField = ref<ValidationFieldFilter>("all");
const selectedFormat = ref<FormatFilter>("all");
const selectedBrand = ref<"all" | BrandKey>("all");
const selectedStatus = ref<StatusFilter>("all");
const searchQuery = ref("");

const selectedCourseId = ref(courses[0]?.record_id ?? "");
const isBatchExporting = ref(false);
const batchExportError = ref("");

const selectedCity = computed(() => {
  return cities.find((city) => city.city_id === selectedCityId.value);
});

const statusOptions: Array<{
  label: string;
  value: StatusFilter;
  hint: string;
}> = [
  {
    label: "Wszystkie",
    value: "all",
    hint: "pełna baza",
  },
  {
    label: "OK",
    value: "ok",
    hint: "bez uwag",
  },
  {
    label: "Warning",
    value: "warning",
    hint: "do kontroli",
  },
  {
    label: "Error",
    value: "error",
    hint: "do poprawy",
  },
];
const stressCases = [
  {
    label: "Krótki tytuł",
    query: "barber",
    city: "pila",
  },
  {
    label: "Długie miasto",
    query: "",
    city: "piotrkow-trybunalski",
  },
  {
    label: "Długi kierunek",
    query: "asystent",
    city: "poznan",
  },
  {
    label: "Długi kierunek + miasto",
    query: "asystent",
    city: "piotrkow-trybunalski",
  },
] as const;
const allRows = computed<QualityRow[]>(() => {
  return courses.map((course) => {
    try {
      const creative = resolveCreativeInput(
        course.record_id,
        selectedCityId.value,
      );
      const validation = validateGoogleAdsCreative(creative);

      return {
        course,
        creative,
        validation,
        status: validation.status,
        messagesCount: validation.messages.length,
        error: "",
      };
    } catch (error) {
      return {
        course,
        creative: null,
        validation: null,
        status: "error",
        messagesCount: 1,
        error:
          error instanceof Error ? error.message : "Unknown resolver error",
      };
    }
  });
});
const validationFieldOptions: Array<{
  label: string;
  value: ValidationFieldFilter;
}> = [
  { label: "Wszystkie pola", value: "all" },
  { label: "Tytuł", value: "title" },
  { label: "Dopisek", value: "subtitle" },
  { label: "Miasto", value: "city" },
  { label: "CTA", value: "cta" },
  { label: "Layout", value: "layout" },
  { label: "Zdjęcie", value: "image" },
  { label: "Kierunek", value: "course" },
  { label: "Dane miasta", value: "city-data" },
  { label: "Brand", value: "brand" },
];

const formatFilterOptions: Array<{
  label: string;
  value: FormatFilter;
}> = [
  { label: "Wszystkie formaty", value: "all" },
  { label: "Square 1200×1200", value: "square_1200x1200" },
  { label: "Landscape 1200×628", value: "landscape_1200x628" },
  { label: "Portrait 960×1200", value: "portrait_960x1200" },
];
const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return allRows.value.filter((row) => {
    const matchesStatus =
      selectedStatus.value === "all" || row.status === selectedStatus.value;

    const matchesBrand =
      selectedBrand.value === "all" ||
      row.course.brand_key === selectedBrand.value;

    const searchable = [
      row.course.record_id,
      row.course.offer_type,
      row.course.brand_key,
      row.course.course_name_raw,
      row.course.course_title,
      row.course.course_subtitle,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchable.includes(query);
    const matchesValidationField =
      selectedValidationField.value === "all" ||
      row.validation?.messages.some(
        (message) => message.field === selectedValidationField.value,
      );

    const matchesFormat =
      selectedFormat.value === "all" ||
      row.validation?.messages.some(
        (message) => message.formatId === selectedFormat.value,
      );
    return (
      matchesStatus &&
      matchesBrand &&
      matchesSearch &&
      matchesValidationField &&
      matchesFormat
    );
  });
});

watch(
  filteredRows,
  (rows) => {
    if (!rows.length) return;

    const selectedStillExists = rows.some(
      (row) => row.course.record_id === selectedCourseId.value,
    );

    if (!selectedStillExists) {
      selectedCourseId.value = rows[0].course.record_id;
    }
  },
  { immediate: true },
);

const selectedRow = computed(() => {
  return (
    allRows.value.find(
      (row) => row.course.record_id === selectedCourseId.value,
    ) ?? null
  );
});
const batchExportCreatives = computed(() => {
  return filteredRows.value
    .filter((row): row is QualityRow & { creative: ResolvedCreativeInput } => {
      return Boolean(row.creative) && row.status !== "error";
    })
    .map((row) => row.creative);
});

const stats = computed(() => {
  return {
    total: allRows.value.length,
    filtered: filteredRows.value.length,
    ok: allRows.value.filter((row) => row.status === "ok").length,
    warning: allRows.value.filter((row) => row.status === "warning").length,
    error: allRows.value.filter((row) => row.status === "error").length,
  };
});

const validationDiagnostics = computed(() => {
  const fieldCounts = new Map<string, number>();
  const formatCounts = new Map<string, number>();

  for (const row of allRows.value) {
    const messages = row.validation?.messages ?? [];

    for (const message of messages) {
      fieldCounts.set(message.field, (fieldCounts.get(message.field) ?? 0) + 1);

      if (message.formatId) {
        formatCounts.set(
          message.formatId,
          (formatCounts.get(message.formatId) ?? 0) + 1,
        );
      }
    }
  }

  return {
    byField: Array.from(fieldCounts.entries())
      .map(([field, count]) => ({ field, count }))
      .sort((a, b) => b.count - a.count),

    byFormat: Array.from(formatCounts.entries())
      .map(([formatId, count]) => ({ formatId, count }))
      .sort((a, b) => b.count - a.count),
  };
});

const selectedValidationGroups = computed(() => {
  const messages = selectedRow.value?.validation?.messages ?? [];

  return messages.reduce<Record<string, typeof messages>>((groups, message) => {
    const key = message.field;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(message);

    return groups;
  }, {});
});

const selectedValidationSummary = computed(() => {
  const messages = selectedRow.value?.validation?.messages ?? [];

  return {
    total: messages.length,
    errors: messages.filter((message) => message.level === "error").length,
    warnings: messages.filter((message) => message.level === "warning").length,
    ok: messages.filter((message) => message.level === "ok").length,
  };
});
function selectCourse(courseId: string) {
  selectedCourseId.value = courseId;
}
async function handleBatchExport() {
  if (isBatchExporting.value) return;

  isBatchExporting.value = true;
  batchExportError.value = "";

  try {
    const brand =
      selectedBrand.value === "all" ? "all-brands" : selectedBrand.value;

    await downloadCreativeBatchPngSet(batchExportCreatives.value, {
      zipFileName: getBatchZipFileName({
        city: selectedCity.value,
        brand,
        count: batchExportCreatives.value.length,
      }),
    });
  } catch (error) {
    batchExportError.value =
      error instanceof Error
        ? error.message
        : "Nie udało się wyeksportować widocznych kreacji.";
  } finally {
    isBatchExporting.value = false;
  }
}
function resetFilters() {
  selectedBrand.value = "all";
  selectedStatus.value = "all";
  selectedValidationField.value = "all";
  selectedFormat.value = "all";
  searchQuery.value = "";
}

function applyStressCase(testCase: (typeof stressCases)[number]) {
  selectedCityId.value = testCase.city;
  selectedBrand.value = "all";
  selectedStatus.value = "all";
  searchQuery.value = testCase.query;

  const matchingRow = allRows.value.find((row) => {
    const searchable = [
      row.course.course_name_raw,
      row.course.course_title,
      row.course.course_subtitle,
      row.course.record_id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !testCase.query || searchable.includes(testCase.query.toLowerCase());
  });

  if (matchingRow) {
    selectedCourseId.value = matchingRow.course.record_id;
  }
}
</script>

<template>
  <main class="qualityWorkspace">
    <aside class="controlRail" aria-label="Filtry generatora">
      <header class="workspaceBrand">
        <p class="eyebrow">TEB Creative Stack</p>
        <h1>Quality overview</h1>
        <p>
          Roboczy widok kontroli kreacji Google Ads: miasto, brand, lista
          kierunków i szeroki podgląd wybranej kreacji.
        </p>
      </header>

      <section class="railSection">
        <h2>Ustawienia eksportu</h2>

        <div class="controlGroup">
          <label for="city">Miasto</label>
          <select id="city" v-model="selectedCityId">
            <option
              v-for="city in cities"
              :key="city.city_id"
              :value="city.city_id"
            >
              {{ city.city_display }}
            </option>
          </select>
        </div>

        <div class="controlGroup">
          <label for="brand">Brand</label>
          <select id="brand" v-model="selectedBrand">
            <option value="all">Wszystkie brandy</option>
            <option
              v-for="brand in brands"
              :key="brand.brand_key"
              :value="brand.brand_key"
            >
              {{ brand.brand_label }}
            </option>
          </select>
        </div>
      </section>

      <details class="diagnosticDrawer">
        <summary>
          <span>
            <strong>Narzędzia diagnostyczne</strong>
            <small>Statusy, szybkie testy, filtry i statystyki</small>
          </span>
        </summary>

        <div class="diagnosticDrawerContent">
          <section class="railSection compact">
            <h2>Szybkie testy</h2>

            <div class="stressCases">
              <button
                v-for="testCase in stressCases"
                :key="testCase.label"
                type="button"
                class="stressButton"
                @click="applyStressCase(testCase)"
              >
                {{ testCase.label }}
              </button>
            </div>
          </section>

          <section class="railSection compact">
            <div class="sectionHeader">
              <h2>Status</h2>
              <button type="button" class="ghostButton" @click="resetFilters">
                Reset
              </button>
            </div>

            <div class="statusFilters">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                type="button"
                :class="[
                  'statusFilter',
                  option.value,
                  { active: selectedStatus === option.value },
                ]"
                @click="selectedStatus = option.value"
              >
                <span>{{ option.label }}</span>
                <small>{{ option.hint }}</small>
              </button>
            </div>
          </section>

          <section class="railSection compact">
            <h2>Filtr diagnostyczny</h2>

            <div class="controlGroup">
              <label for="validationField">Pole walidacji</label>
              <select id="validationField" v-model="selectedValidationField">
                <option
                  v-for="option in validationFieldOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="controlGroup">
              <label for="formatFilter">Format</label>
              <select id="formatFilter" v-model="selectedFormat">
                <option
                  v-for="option in formatFilterOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </section>

          <section class="railSection compact">
            <h2>Statystyki</h2>

            <div class="statsGrid">
              <div class="statCard">
                <strong>{{ stats.total }}</strong>
                <span>wszystkie</span>
              </div>

              <div class="statCard ok">
                <strong>{{ stats.ok }}</strong>
                <span>OK</span>
              </div>

              <div class="statCard warning">
                <strong>{{ stats.warning }}</strong>
                <span>warning</span>
              </div>

              <div class="statCard error">
                <strong>{{ stats.error }}</strong>
                <span>error</span>
              </div>
            </div>
          </section>

          <section class="railSection compact">
            <h2>Diagnostyka</h2>

            <div class="diagnosticsBlock">
              <div>
                <h3>Według pola</h3>

                <p v-if="!validationDiagnostics.byField.length" class="emptyHint">
                  Brak komunikatów walidacji.
                </p>

                <div
                  v-for="item in validationDiagnostics.byField"
                  :key="item.field"
                  class="diagnosticRow"
                >
                  <span>{{ item.field }}</span>
                  <strong>{{ item.count }}</strong>
                </div>
              </div>

              <div>
                <h3>Według formatu</h3>

                <p v-if="!validationDiagnostics.byFormat.length" class="emptyHint">
                  Brak komunikatów formatowych.
                </p>

                <div
                  v-for="item in validationDiagnostics.byFormat"
                  :key="item.formatId"
                  class="diagnosticRow"
                >
                  <span>{{ item.formatId }}</span>
                  <strong>{{ item.count }}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>
      </details>
    </aside>

    <aside class="courseRail" aria-label="Lista kierunków">
      <header class="courseRailHeader">
        <div>
          <p class="eyebrow">Kierunki</p>
          <h2>{{ stats.filtered }} w filtrze</h2>
        </div>

        <button
          type="button"
          class="batchExportButton"
          :disabled="isBatchExporting || !batchExportCreatives.length"
          @click="handleBatchExport"
        >
          {{ isBatchExporting ? "Eksportuję…" : "Eksportuj widoczne" }}
        </button>
      </header>

      <p v-if="batchExportError" class="batchExportError">
        {{ batchExportError }}
      </p>

      <div class="searchBox">
        <label for="search">Szukaj kierunku</label>
        <input
          id="search"
          v-model="searchQuery"
          type="search"
          placeholder="np. barber, CAD/CAM, kosmetycznych..."
        />
      </div>

      <div class="courseList">
        <button
          v-for="row in filteredRows"
          :key="row.course.record_id"
          type="button"
          :class="[
            'courseRow',
            row.status,
            { active: row.course.record_id === selectedCourseId },
          ]"
          @click="selectCourse(row.course.record_id)"
        >
          <span class="statusDot" />

          <span class="courseRowContent">
            <strong>{{ row.course.course_name_raw }}</strong>
            <small>
              {{ row.course.offer_type }} · {{ row.course.brand_key }} ·
              {{ row.messagesCount }} uwag
            </small>
          </span>
        </button>
      </div>
    </aside>

    <section class="detailCanvas" aria-label="Wybrany kierunek">
      <template v-if="selectedRow">
        <header class="detailHeader">
          <div>
            <p class="eyebrow">Wybrany kierunek</p>
            <h2>{{ selectedRow.course.course_name_raw }}</h2>
            <p class="detailMeta">
              Miasto testowe:
              <strong>{{ selectedCity?.city_display }}</strong>
            </p>
          </div>

          <strong :class="['statusBadge', selectedRow.status]">
            {{ selectedRow.status.toUpperCase() }}
          </strong>
        </header>

        <div v-if="selectedRow.error" class="errorBox">
          <strong>Błąd resolvera</strong>
          <p>{{ selectedRow.error }}</p>
        </div>

        <template v-else-if="selectedRow.creative">
          <section class="summaryStrip">
            <div>
              <span>Brand</span>
              <strong :style="{ color: selectedRow.creative.colors.primary }">
                {{ selectedRow.creative.brand.brand_label }}
              </strong>
            </div>

            <div>
              <span>Miasto</span>
              <strong>{{ selectedRow.creative.cityDisplay }}</strong>
            </div>

            <div>
              <span>Layout</span>
              <strong>{{ selectedRow.creative.meta.layoutVariant }}</strong>
            </div>

            <div>
              <span>Zdjęcie</span>
              <strong>{{ selectedRow.creative.imagePath }}</strong>
            </div>
          </section>

          <section class="previewCanvas">
            <AdsFormatPreview :creative="selectedRow.creative" />
          </section>
          <section
            v-if="selectedRow.validation?.messages.length"
            class="validationPanel"
          >
            <header>
              <div>
                <h3>Walidacja</h3>
                <p>
                  {{ selectedValidationSummary.total }} komunikatów dla wybranej
                  kreacji
                </p>
              </div>

              <div class="validationCounters">
                <span
                  v-if="selectedValidationSummary.errors"
                  class="counter error"
                >
                  {{ selectedValidationSummary.errors }} error
                </span>

                <span
                  v-if="selectedValidationSummary.warnings"
                  class="counter warning"
                >
                  {{ selectedValidationSummary.warnings }} warning
                </span>
              </div>
            </header>

            <div class="validationGroups">
              <details
                v-for="(messages, field) in selectedValidationGroups"
                :key="field"
                class="validationGroup"
                open
              >
                <summary>
                  <span>{{ field }}</span>
                  <strong>{{ messages.length }}</strong>
                </summary>

                <ul>
                  <li
                    v-for="message in messages"
                    :key="`${message.field}-${message.formatId}-${message.message}`"
                    :class="message.level"
                  >
                    <strong>{{ message.level.toUpperCase() }}</strong>

                    <span>
                      <template v-if="message.formatId">
                        {{ message.formatId }}:
                      </template>
                      {{ message.message }}
                    </span>
                  </li>
                </ul>
              </details>
            </div>
          </section>
        </template>
      </template>
    </section>
  </main>
</template>

<style scoped>
.qualityWorkspace {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 380px minmax(0, 1fr);
  background: #f5f7fb;
  color: #102d69;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.controlRail,
.courseRail {
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgba(16, 45, 105, 0.08);
  background: rgba(255, 255, 255, 0.9);
}

.controlRail {
  padding: 22px 18px;
}

.courseRail {
  padding: 22px 14px;
}

.detailCanvas {
  min-width: 0;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  padding: 24px;
}

.workspaceBrand {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #e30613;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 10px;
  color: #062b6f;
  font-size: 28px;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.workspaceBrand p:not(.eyebrow) {
  margin: 0;
  color: #61708a;
  font-size: 13px;
  line-height: 1.5;
}

.railSection {
  display: grid;
  gap: 12px;
  padding: 18px 0;
  border-top: 1px solid rgba(16, 45, 105, 0.08);
}

.railSection h2,
.courseRailHeader h2 {
  margin: 0;
  color: #062b6f;
  font-size: 16px;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.sectionHeader,
.courseRailHeader,
.detailHeader,
.validationPanel header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 14px;
}

.controlGroup,
.searchBox {
  display: grid;
  gap: 7px;
}

label {
  color: #516078;
  font-size: 12px;
  font-weight: 850;
}

select,
input {
  width: 100%;
  min-height: 42px;
  border: 1px solid rgba(16, 45, 105, 0.14);
  border-radius: 13px;
  padding: 0 12px;
  background: #f8fafc;
  color: #102d69;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  outline: none;
}

select:focus,
input:focus {
  border-color: rgba(15, 68, 150, 0.42);
  box-shadow: 0 0 0 4px rgba(15, 68, 150, 0.08);
  background: #ffffff;
}

.ghostButton {
  min-height: 28px;
  border: 1px solid rgba(16, 45, 105, 0.1);
  border-radius: 999px;
  padding: 0 10px;
  background: #ffffff;
  color: #516078;
  font-size: 11px;
  font-weight: 850;
  cursor: pointer;
}

.statusFilters {
  display: grid;
  gap: 8px;
}

.statusFilter {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  min-height: 44px;
  border: 1px solid rgba(16, 45, 105, 0.08);
  border-radius: 14px;
  padding: 9px 11px;
  background: #ffffff;
  color: #102d69;
  text-align: left;
  cursor: pointer;
}

.statusFilter span {
  font-size: 13px;
  font-weight: 900;
}

.statusFilter small {
  color: #6b778c;
  font-size: 11px;
  font-weight: 750;
}

.statusFilter.active {
  border-color: rgba(15, 68, 150, 0.34);
  box-shadow: 0 0 0 3px rgba(15, 68, 150, 0.08);
}

.statusFilter.ok.active {
  border-color: rgba(22, 163, 74, 0.34);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08);
}

.statusFilter.warning.active {
  border-color: rgba(245, 158, 11, 0.36);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.statusFilter.error.active {
  border-color: rgba(239, 68, 68, 0.34);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.statsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.statCard {
  padding: 13px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(16, 45, 105, 0.06);
}

.statCard strong {
  display: block;
  font-size: 25px;
  line-height: 1;
}

.statCard span {
  display: block;
  margin-top: 5px;
  color: #6b778c;
  font-size: 11px;
  font-weight: 800;
}

.statCard.ok {
  color: #14532d;
}

.statCard.warning {
  color: #6b4300;
}

.statCard.error {
  color: #9d1c1c;
}

.courseRailHeader {
  margin-bottom: 16px;
}

.searchBox {
  margin-bottom: 14px;
}

.courseList {
  display: grid;
  gap: 8px;
}

.courseRow {
  width: 100%;
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px;
  background: transparent;
  color: #102d69;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.courseRow:hover {
  background: #f3f6fb;
  transform: translateY(-1px);
}

.courseRow.active {
  border-color: rgba(15, 68, 150, 0.22);
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(16, 45, 105, 0.08);
}

.statusDot {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 999px;
  background: #94a3b8;
}

.courseRow.ok .statusDot {
  background: #16a34a;
}

.courseRow.warning .statusDot {
  background: #f59e0b;
}

.courseRow.error .statusDot {
  background: #ef4444;
}

.courseRowContent {
  min-width: 0;
}

.courseRowContent strong {
  display: block;
  color: #062b6f;
  font-size: 13px;
  line-height: 1.22;
}

.courseRowContent small {
  display: block;
  margin-top: 6px;
  color: #6b778c;
  font-size: 11px;
  font-weight: 700;
}

.detailHeader {
  position: sticky;
  top: 0;
  z-index: 20;
  margin: -24px -24px 22px;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(16, 45, 105, 0.08);
  background: rgba(245, 247, 251, 0.9);
  backdrop-filter: blur(16px);
}

.detailHeader h2 {
  max-width: 940px;
  margin: 0;
  color: #062b6f;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.detailMeta {
  margin: 10px 0 0;
  color: #61708a;
  font-size: 13px;
}

.statusBadge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  border-radius: 999px;
  padding: 0 13px;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.04em;
}

.statusBadge.ok {
  background: #eefbf2;
  color: #14532d;
}

.statusBadge.warning {
  background: #fff7e6;
  color: #6b4300;
}

.statusBadge.error {
  background: #ffecec;
  color: #9d1c1c;
}

.summaryStrip {
  display: grid;
  grid-template-columns: 180px 180px 180px minmax(0, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.summaryStrip div {
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(16, 45, 105, 0.06);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(16, 45, 105, 0.05);
}

.summaryStrip span {
  display: block;
  margin-bottom: 6px;
  color: #6b778c;
  font-size: 11px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.summaryStrip strong {
  display: block;
  min-width: 0;
  color: #102d69;
  font-size: 13px;
  line-height: 1.35;
  word-break: break-word;
}

.diagnosticsBlock {
  display: grid;
  gap: 14px;
}

.diagnosticsBlock h3 {
  margin: 0 0 8px;
  color: #516078;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.diagnosticRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 32px;
  padding: 0 10px;
  border-radius: 11px;
  background: #ffffff;
  color: #102d69;
  font-size: 12px;
  font-weight: 800;
}

.diagnosticRow + .diagnosticRow {
  margin-top: 6px;
}

.diagnosticRow span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.diagnosticRow strong {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  border-radius: 999px;
  background: #edf1f7;
  color: #516078;
  font-size: 11px;
  font-weight: 900;
}

.emptyHint {
  margin: 0;
  color: #8a95a8;
  font-size: 12px;
  font-weight: 700;
}

.validationPanel {
  margin-bottom: 18px;
  padding: 16px;
  border: 1px solid rgba(16, 45, 105, 0.06);
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(16, 45, 105, 0.05);
}

.validationPanel header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 14px;
  margin-bottom: 14px;
}

.validationPanel h3 {
  margin: 0;
  color: #062b6f;
  font-size: 16px;
}

.validationPanel header p {
  margin: 5px 0 0;
  color: #6b778c;
  font-size: 12px;
  font-weight: 750;
}

.validationCounters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.counter {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  border-radius: 999px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.counter.warning {
  background: #fff7e6;
  color: #6b4300;
}

.counter.error {
  background: #ffecec;
  color: #9d1c1c;
}

.validationGroups {
  display: grid;
  gap: 10px;
}

.validationGroup {
  border: 1px solid rgba(16, 45, 105, 0.07);
  border-radius: 16px;
  background: #f8fafc;
  overflow: hidden;
}

.validationGroup summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 13px;
  color: #102d69;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  list-style: none;
}

.validationGroup summary::-webkit-details-marker {
  display: none;
}

.validationGroup summary span {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.validationGroup summary strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #ffffff;
  color: #516078;
  font-size: 11px;
}

.validationGroup ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0 10px 10px;
  list-style: none;
}

.validationGroup li {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #ffffff;
  color: #102d69;
  font-size: 13px;
}

.validationGroup li.warning strong {
  color: #6b4300;
}

.validationGroup li.error strong {
  color: #9d1c1c;
}

.validationGroup li.ok strong {
  color: #14532d;
}

.previewCanvas {
  min-width: 0;
}

.errorBox {
  padding: 16px;
  border-radius: 20px;
  background: #ffecec;
  color: #9d1c1c;
}

.errorBox p {
  margin: 6px 0 0;
}

@media (max-width: 1320px) {
  .qualityWorkspace {
    grid-template-columns: 260px 340px minmax(0, 1fr);
  }

  .summaryStrip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1040px) {
  .qualityWorkspace {
    display: block;
  }

  .controlRail,
  .courseRail,
  .detailCanvas {
    min-height: auto;
    max-height: none;
    border-right: 0;
    border-bottom: 1px solid rgba(16, 45, 105, 0.08);
  }

  .detailHeader {
    position: static;
    margin: 0 0 18px;
    border: 1px solid rgba(16, 45, 105, 0.08);
    border-radius: 22px;
    background: #ffffff;
  }

  .summaryStrip {
    grid-template-columns: 1fr;
  }
}

.stressCases {
  display: grid;
  gap: 8px;
}

.stressButton {
  width: 100%;
  min-height: 38px;
  border: 1px solid rgba(16, 45, 105, 0.1);
  border-radius: 13px;
  padding: 0 11px;
  background: #ffffff;
  color: #102d69;
  font: inherit;
  font-size: 12px;
  font-weight: 850;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.stressButton:hover {
  border-color: rgba(15, 68, 150, 0.28);
  box-shadow: 0 10px 24px rgba(16, 45, 105, 0.08);
  transform: translateY(-1px);
}

.batchExportButton {
  flex: 0 0 auto;
  min-height: 32px;
  border: 0;
  border-radius: 999px;
  padding: 0 12px;
  background: #0941a1;
  color: #ffffff;
  font: inherit;
  font-size: 11px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(9, 65, 161, 0.18);
}

.batchExportButton:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(9, 65, 161, 0.24);
}

.batchExportButton:disabled {
  cursor: wait;
  opacity: 0.58;
}

.batchExportError {
  margin: 0 8px 10px;
  padding: 10px 12px;
  border: 1px solid rgba(157, 28, 28, 0.12);
  border-radius: 14px;
  background: #ffecec;
  color: #9d1c1c;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.4;
}
</style>
