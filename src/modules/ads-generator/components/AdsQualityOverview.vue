<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AdsFormatPreview from './AdsFormatPreview.vue';
import { getBrands, getCities, getCourses, resolveCreativeInput } from '../utils/creativeResolver';
import { validateGoogleAdsCreative } from '../validators/validateGoogleAdsCreative';
import type { BrandKey, CourseRecord, ResolvedCreativeInput } from '../types/ads.types';
import type {
  CreativeValidationLevel,
  CreativeValidationResult,
} from '../validators/validateGoogleAdsCreative';

type StatusFilter = 'all' | CreativeValidationLevel;

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
  cities.find((city) => city.city_id === 'piotrkow-trybunalski')?.city_id ??
    cities[0]?.city_id ??
    '',
);

const selectedBrand = ref<'all' | BrandKey>('all');
const selectedStatus = ref<StatusFilter>('all');
const searchQuery = ref('');

const selectedCourseId = ref(courses[0]?.record_id ?? '');

const allRows = computed<QualityRow[]>(() => {
  return courses.map((course) => {
    try {
      const creative = resolveCreativeInput(course.record_id, selectedCityId.value);
      const validation = validateGoogleAdsCreative(creative);

      return {
        course,
        creative,
        validation,
        status: validation.status,
        messagesCount: validation.messages.length,
        error: '',
      };
    } catch (error) {
      return {
        course,
        creative: null,
        validation: null,
        status: 'error',
        messagesCount: 1,
        error: error instanceof Error ? error.message : 'Unknown resolver error',
      };
    }
  });
});

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return allRows.value.filter((row) => {
    const matchesStatus = selectedStatus.value === 'all' || row.status === selectedStatus.value;

    const matchesBrand =
      selectedBrand.value === 'all' || row.course.brand_key === selectedBrand.value;

    const searchable = [
      row.course.record_id,
      row.course.offer_type,
      row.course.brand_key,
      row.course.course_name_raw,
      row.course.course_title,
      row.course.course_subtitle,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !query || searchable.includes(query);

    return matchesStatus && matchesBrand && matchesSearch;
  });
});

watch(
  filteredRows,
  (rows) => {
    if (!rows.length) return;

    const selectedStillExists = rows.some((row) => row.course.record_id === selectedCourseId.value);

    if (!selectedStillExists) {
      selectedCourseId.value = rows[0].course.record_id;
    }
  },
  { immediate: true },
);

const selectedRow = computed(() => {
  return allRows.value.find((row) => row.course.record_id === selectedCourseId.value) ?? null;
});

const stats = computed(() => {
  return {
    total: allRows.value.length,
    filtered: filteredRows.value.length,
    ok: allRows.value.filter((row) => row.status === 'ok').length,
    warning: allRows.value.filter((row) => row.status === 'warning').length,
    error: allRows.value.filter((row) => row.status === 'error').length,
  };
});

function selectCourse(courseId: string) {
  selectedCourseId.value = courseId;
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <div>
        <p class="eyebrow">TEB Creative Stack Generator</p>
        <h1>Quality overview</h1>
        <p>
          Przegląd kierunków pod kątem walidacji layoutu Google Ads. Ten widok pomaga
          szybko znaleźć kreacje wymagające korekty danych, tekstu lub układu.
        </p>
      </div>

      <div class="stats">
        <div class="stat">
          <strong>{{ stats.total }}</strong>
          <span>wszystkie</span>
        </div>
        <div class="stat ok">
          <strong>{{ stats.ok }}</strong>
          <span>OK</span>
        </div>
        <div class="stat warning">
          <strong>{{ stats.warning }}</strong>
          <span>warning</span>
        </div>
        <div class="stat error">
          <strong>{{ stats.error }}</strong>
          <span>error</span>
        </div>
      </div>
    </section>

    <section class="controls">
      <div class="control">
        <label for="city">Miasto testowe</label>
        <select id="city" v-model="selectedCityId">
          <option v-for="city in cities" :key="city.city_id" :value="city.city_id">
            {{ city.city_display }}
          </option>
        </select>
      </div>

      <div class="control">
        <label for="brand">Brand</label>
        <select id="brand" v-model="selectedBrand">
          <option value="all">Wszystkie brandy</option>
          <option v-for="brand in brands" :key="brand.brand_key" :value="brand.brand_key">
            {{ brand.brand_label }}
          </option>
        </select>
      </div>

      <div class="control">
        <label for="status">Status</label>
        <select id="status" v-model="selectedStatus">
          <option value="all">Wszystkie statusy</option>
          <option value="ok">OK</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div class="control search">
        <label for="search">Szukaj</label>
        <input
          id="search"
          v-model="searchQuery"
          type="search"
          placeholder="np. barber, kosmetycznych, CAD/CAM..."
        />
      </div>
    </section>

    <section class="workspace">
      <aside class="listPanel">
        <header class="listHeader">
          <strong>Kierunki</strong>
          <span>{{ stats.filtered }} w filtrze</span>
        </header>

        <div class="rows">
          <button
            v-for="row in filteredRows"
            :key="row.course.record_id"
            type="button"
            :class="[
              'row',
              row.status,
              { active: row.course.record_id === selectedCourseId },
            ]"
            @click="selectCourse(row.course.record_id)"
          >
            <span class="statusDot" />

            <span class="rowContent">
              <strong>{{ row.course.course_name_raw }}</strong>
              <small>
                {{ row.course.offer_type }} · {{ row.course.brand_key }} ·
                {{ row.messagesCount }} uwag
              </small>
            </span>
          </button>
        </div>
      </aside>

      <section class="detailPanel">
        <template v-if="selectedRow">
          <header class="detailHeader">
            <div>
              <span class="label">Wybrany kierunek</span>
              <h2>{{ selectedRow.course.course_name_raw }}</h2>
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
            <section class="summary">
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
                <span>Zdjęcie</span>
                <strong>{{ selectedRow.creative.imagePath }}</strong>
              </div>

              <div>
                <span>Layout</span>
                <strong>{{ selectedRow.creative.meta.layoutVariant }}</strong>
              </div>
            </section>

            <section v-if="selectedRow.validation?.messages.length" class="validationList">
              <h3>Walidacja</h3>

              <ul>
                <li
                  v-for="message in selectedRow.validation.messages"
                  :key="`${message.field}-${message.formatId}-${message.message}`"
                  :class="message.level"
                >
                  <strong>{{ message.level.toUpperCase() }}</strong>
                  <span>
                    {{ message.field }}
                    <template v-if="message.formatId"> / {{ message.formatId }}</template>:
                    {{ message.message }}
                  </span>
                </li>
              </ul>
            </section>

            <AdsFormatPreview :creative="selectedRow.creative" />
          </template>
        </template>
      </section>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40px;
  background: #f6f7fb;
  color: #102d69;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.hero,
.controls,
.workspace {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: end;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e30613;
}

h1 {
  margin: 0 0 10px;
  font-size: clamp(34px, 5vw, 64px);
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.hero p {
  max-width: 760px;
  margin: 0;
  color: #42526e;
  font-size: 18px;
  line-height: 1.55;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(86px, 1fr));
  gap: 10px;
}

.stat {
  padding: 14px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 50px rgba(16, 45, 105, 0.08);
}

.stat strong {
  display: block;
  font-size: 28px;
  line-height: 1;
}

.stat span {
  display: block;
  margin-top: 6px;
  color: #6b778c;
  font-size: 12px;
  font-weight: 700;
}

.stat.ok {
  color: #14532d;
}

.stat.warning {
  color: #6b4300;
}

.stat.error {
  color: #9d1c1c;
}

.controls {
  display: grid;
  grid-template-columns: 260px 220px 180px minmax(260px, 1fr);
  gap: 14px;
  padding: 18px;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 20px 70px rgba(16, 45, 105, 0.1);
  margin-bottom: 22px;
}

.control {
  display: grid;
  gap: 8px;
}

label {
  color: #42526e;
  font-size: 13px;
  font-weight: 800;
}

select,
input {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #d8dee9;
  border-radius: 14px;
  background: #f8fafc;
  color: #102d69;
  font: inherit;
}

.workspace {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.listPanel,
.detailPanel {
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 20px 70px rgba(16, 45, 105, 0.1);
}

.listPanel {
  position: sticky;
  top: 24px;
  overflow: hidden;
}

.listHeader {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 14px;
  border-bottom: 1px solid #edf1f7;
}

.listHeader span {
  color: #6b778c;
  font-size: 13px;
}

.rows {
  max-height: calc(100vh - 260px);
  overflow: auto;
  padding: 8px;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 12px;
  align-items: start;
  padding: 12px;
  border: 0;
  border-radius: 18px;
  background: transparent;
  color: #102d69;
  text-align: left;
  cursor: pointer;
}

.row:hover,
.row.active {
  background: #f3f6fb;
}

.statusDot {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 999px;
  background: #94a3b8;
}

.row.ok .statusDot {
  background: #16a34a;
}

.row.warning .statusDot {
  background: #f59e0b;
}

.row.error .statusDot {
  background: #ef4444;
}

.rowContent strong {
  display: block;
  font-size: 14px;
  line-height: 1.25;
}

.rowContent small {
  display: block;
  margin-top: 5px;
  color: #6b778c;
  font-size: 12px;
}

.detailPanel {
  padding: 22px;
}

.detailHeader {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: start;
  margin-bottom: 18px;
}

.label {
  display: block;
  margin-bottom: 6px;
  color: #6b778c;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

h2 {
  max-width: 850px;
  margin: 0;
  font-size: clamp(28px, 4vw, 46px);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.statusBadge {
  flex: 0 0 auto;
  padding: 9px 13px;
  border-radius: 999px;
  font-size: 13px;
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

.summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.summary div {
  padding: 14px;
  border-radius: 18px;
  background: #f8fafc;
}

.summary span {
  display: block;
  margin-bottom: 6px;
  color: #6b778c;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.summary strong {
  display: block;
  font-size: 13px;
  line-height: 1.35;
  word-break: break-word;
}

.validationList {
  margin-bottom: 18px;
  padding: 16px;
  border-radius: 20px;
  background: #f8fafc;
}

.validationList h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.validationList ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.validationList li {
  display: grid;
  grid-template-columns: 78px 1fr;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #fff;
  font-size: 13px;
}

.validationList li.ok strong {
  color: #14532d;
}

.validationList li.warning strong {
  color: #6b4300;
}

.validationList li.error strong {
  color: #9d1c1c;
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

@media (max-width: 1180px) {
  .hero,
  .workspace {
    grid-template-columns: 1fr;
  }

  .controls {
    grid-template-columns: 1fr 1fr;
  }

  .listPanel {
    position: static;
  }

  .rows {
    max-height: 420px;
  }

  .summary {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .page {
    padding: 22px;
  }

  .controls,
  .summary,
  .stats {
    grid-template-columns: 1fr;
  }

  .detailHeader {
    display: grid;
  }
}
</style>