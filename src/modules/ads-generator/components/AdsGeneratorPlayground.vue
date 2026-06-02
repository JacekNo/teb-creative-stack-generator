<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AdsFormatPreview from './AdsFormatPreview.vue';
import { getBrands, getCities, getCourses, resolveCreativeInput } from '../utils/creativeResolver';
import type { BrandKey } from '../types/ads.types';

const courses = getCourses();
const cities = getCities();
const brands = getBrands();

const selectedBrand = ref<'all' | BrandKey>('all');
const searchQuery = ref('');

const selectedCourseId = ref(
  courses.find((course) => course.record_id === 'pku-barber')?.record_id ?? courses[0]?.record_id ?? '',
);

const selectedCityId = ref(
  cities.find((city) => city.city_id === 'pila')?.city_id ?? cities[0]?.city_id ?? '',
);

const quickCases = [
  {
    label: 'Krótki tekst',
    courseId: 'pku-barber',
    cityId: 'pila',
  },
  {
    label: 'Średni tekst',
    courseId: 'sp-technik-dentystyczny-z-technologia-cad-cam',
    cityId: 'poznan',
  },
  {
    label: 'Długi tekst',
    courseId: 'sp-technik-uslug-kosmetycznych-z-certyfikatem-bielenda-professional',
    cityId: 'piotrkow-trybunalski',
  },
];

const filteredCourses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesBrand =
      selectedBrand.value === 'all' || course.brand_key === selectedBrand.value;

    const searchable = [
      course.record_id,
      course.course_name_raw,
      course.course_title,
      course.course_subtitle,
      course.offer_type,
      course.brand_key,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !query || searchable.includes(query);

    return matchesBrand && matchesSearch;
  });
});

watch(
  filteredCourses,
  (items) => {
    if (!items.length) return;

    const selectedStillExists = items.some((course) => course.record_id === selectedCourseId.value);

    if (!selectedStillExists) {
      selectedCourseId.value = items[0].record_id;
    }
  },
  { immediate: true },
);

const resolvedState = computed(() => {
  try {
    return {
      creative: resolveCreativeInput(selectedCourseId.value, selectedCityId.value),
      error: '',
    };
  } catch (error) {
    return {
      creative: null,
      error: error instanceof Error ? error.message : 'Unknown resolver error',
    };
  }
});

const selectedCourse = computed(() => {
  return courses.find((course) => course.record_id === selectedCourseId.value);
});

const selectedCity = computed(() => {
  return cities.find((city) => city.city_id === selectedCityId.value);
});

const stats = computed(() => {
  return {
    courses: courses.length,
    filteredCourses: filteredCourses.value.length,
    cities: cities.length,
    brands: brands.length,
  };
});

function applyQuickCase(courseId: string, cityId: string) {
  selectedCourseId.value = courseId;
  selectedCityId.value = cityId;
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <div>
        <p class="eyebrow">TEB Creative Stack Generator</p>
        <h1>Google Ads playground</h1>
        <p>
          Panel testowy do sprawdzania, jak dane kierunku, miasta, brandu i zdjęcia
          składają się w 3 formaty Google Ads.
        </p>
      </div>

      <div class="stats">
        <div>
          <strong>{{ stats.courses }}</strong>
          <span>kierunki</span>
        </div>
        <div>
          <strong>{{ stats.filteredCourses }}</strong>
          <span>w filtrze</span>
        </div>
        <div>
          <strong>{{ stats.cities }}</strong>
          <span>miasta</span>
        </div>
        <div>
          <strong>{{ stats.brands }}</strong>
          <span>brandy</span>
        </div>
      </div>
    </section>

    <section class="controls">
      <div class="control">
        <label for="brand">Brand</label>
        <select id="brand" v-model="selectedBrand">
          <option value="all">Wszystkie brandy</option>
          <option v-for="brand in brands" :key="brand.brand_key" :value="brand.brand_key">
            {{ brand.brand_label }}
          </option>
        </select>
      </div>

      <div class="control search">
        <label for="search">Szukaj kierunku</label>
        <input
          id="search"
          v-model="searchQuery"
          type="search"
          placeholder="np. barber, kosmetycznych, CAD/CAM..."
        />
      </div>

      <div class="control">
        <label for="course">Kierunek</label>
        <select id="course" v-model="selectedCourseId">
          <option
            v-for="course in filteredCourses"
            :key="course.record_id"
            :value="course.record_id"
          >
            {{ course.offer_type }} — {{ course.course_name_raw }}
          </option>
        </select>
      </div>

      <div class="control">
        <label for="city">Miasto</label>
        <select id="city" v-model="selectedCityId">
          <option v-for="city in cities" :key="city.city_id" :value="city.city_id">
            {{ city.city_display }}
          </option>
        </select>
      </div>
    </section>

    <section class="quickCases">
      <button
        v-for="item in quickCases"
        :key="item.label"
        type="button"
        @click="applyQuickCase(item.courseId, item.cityId)"
      >
        {{ item.label }}
      </button>
    </section>

    <section v-if="resolvedState.error" class="error">
      <strong>Błąd resolvera:</strong>
      <span>{{ resolvedState.error }}</span>
    </section>

    <section v-else-if="resolvedState.creative" class="summary">
      <div>
        <span>Wybrany kierunek</span>
        <strong>{{ selectedCourse?.course_name_raw }}</strong>
      </div>

      <div>
        <span>Miasto</span>
        <strong>{{ selectedCity?.city_display }}</strong>
      </div>

      <div>
        <span>Brand</span>
        <strong :style="{ color: resolvedState.creative.colors.primary }">
          {{ resolvedState.creative.brand.brand_label }}
        </strong>
      </div>

      <div>
        <span>Zdjęcie</span>
        <strong>{{ resolvedState.creative.imagePath }}</strong>
      </div>

      <div v-if="resolvedState.creative.meta.warnings.length" class="warnings">
        <span>Uwagi</span>
        <ul>
          <li v-for="warning in resolvedState.creative.meta.warnings" :key="warning">
            {{ warning }}
          </li>
        </ul>
      </div>
    </section>

    <section v-if="resolvedState.creative" class="preview">
      <AdsFormatPreview :creative="resolvedState.creative" />
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

.hero {
  max-width: 1280px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: end;
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

.hero p:not(.eyebrow) {
  max-width: 720px;
  margin: 0;
  color: #42526e;
  font-size: 18px;
  line-height: 1.55;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 12px;
}

.stats div {
  padding: 16px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 16px 50px rgba(16, 45, 105, 0.08);
}

.stats strong {
  display: block;
  font-size: 30px;
  line-height: 1;
}

.stats span {
  display: block;
  margin-top: 6px;
  color: #6b778c;
  font-size: 13px;
}

.controls,
.summary,
.quickCases,
.preview,
.error {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

.controls {
  display: grid;
  grid-template-columns: 220px minmax(260px, 1fr);
  gap: 16px;
  padding: 20px;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 20px 70px rgba(16, 45, 105, 0.1);
}

.control {
  display: grid;
  gap: 8px;
}

.control:nth-child(3),
.control:nth-child(4) {
  grid-column: span 1;
}

label {
  font-size: 13px;
  font-weight: 800;
  color: #42526e;
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

.quickCases {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

button {
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: #102d69;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}

button:hover {
  filter: brightness(1.08);
}

.summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.summary > div {
  padding: 16px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 40px rgba(16, 45, 105, 0.07);
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
  font-size: 14px;
  line-height: 1.35;
  word-break: break-word;
}

.warnings {
  grid-column: 1 / -1;
  background: #fff7e6 !important;
  color: #6b4300;
}

.warnings ul {
  margin: 0;
  padding-left: 18px;
}

.preview {
  margin-top: 24px;
}

.error {
  margin-top: 18px;
  padding: 18px 20px;
  border-radius: 20px;
  background: #ffecec;
  color: #9d1c1c;
}

.error strong,
.error span {
  display: block;
}

.error span {
  margin-top: 6px;
}

@media (max-width: 980px) {
  .page {
    padding: 24px;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .controls {
    grid-template-columns: 1fr;
  }

  .summary {
    grid-template-columns: 1fr;
  }
}
</style>