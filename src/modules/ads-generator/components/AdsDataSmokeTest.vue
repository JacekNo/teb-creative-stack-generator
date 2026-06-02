<script setup lang="ts">
import { computed } from "vue";
import {
  getCities,
  getCourses,
  getImageMap,
  resolveTestCreatives,
} from "../utils/creativeResolver";
import AdsFormatPreview from "./AdsFormatPreview.vue";

const testCreatives = computed(() => resolveTestCreatives());

const stats = computed(() => {
  return {
    courses: getCourses().length,
    cities: getCities().length,
    images: getImageMap().length,
  };
});
</script>

<template>
  <main class="page">
    <section class="hero">
      <p class="eyebrow">TEB Creative Stack Generator</p>
      <h1>Smoke test danych</h1>
      <p>
        Ten widok sprawdza, czy generator potrafi połączyć kierunek, miasto,
        brand, kolory i zdjęcie w jeden obiekt kreacji.
      </p>

      <div class="stats">
        <div>
          <strong>{{ stats.courses }}</strong>
          <span>kierunki</span>
        </div>
        <div>
          <strong>{{ stats.cities }}</strong>
          <span>miasta</span>
        </div>
        <div>
          <strong>{{ stats.images }}</strong>
          <span>mapowania zdjęć</span>
        </div>
      </div>
    </section>

    <section class="grid">
      <article
        v-for="creative in testCreatives"
        :key="`${creative.courseId}-${creative.cityId}`"
        class="card"
        :style="{
          borderColor: creative.colors.primary,
          background: creative.colors.soft,
        }"
      >
        <div class="imageWrap">
          <img :src="creative.imagePath" :alt="creative.title" />
        </div>

        <div class="content">
          <p class="brand" :style="{ color: creative.colors.primary }">
            {{ creative.brand.brand_label }}
          </p>

          <h2>{{ creative.title }}</h2>

          <p v-if="creative.subtitle" class="subtitle">
            {{ creative.subtitle }}
          </p>

          <p class="city">
            {{ creative.cta }}
          </p>

          <dl>
            <div>
              <dt>courseId</dt>
              <dd>{{ creative.courseId }}</dd>
            </div>
            <div>
              <dt>cityId</dt>
              <dd>{{ creative.cityId }}</dd>
            </div>
            <div>
              <dt>image</dt>
              <dd>{{ creative.imagePath }}</dd>
            </div>
            <div>
              <dt>length</dt>
              <dd>
                {{ creative.meta.courseLengthClass }} /
                {{ creative.meta.cityLengthClass }}
              </dd>
            </div>
          </dl>

          <div v-if="creative.meta.warnings.length" class="warnings">
            <strong>Uwagi:</strong>
            <ul>
              <li v-for="warning in creative.meta.warnings" :key="warning">
                {{ warning }}
              </li>
            </ul>
          </div>
        </div>
        <div class="previewBlock">
          <AdsFormatPreview :creative="creative" />
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px;
  background: #f6f7fb;
  color: #102d69;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.hero {
  max-width: 1040px;
  margin: 0 auto 32px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e30613;
}

h1 {
  margin: 0 0 12px;
  font-size: clamp(32px, 5vw, 56px);
  line-height: 0.95;
}

.hero > p:not(.eyebrow) {
  max-width: 760px;
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: #42526e;
}

.stats {
  display: flex;
  gap: 16px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.stats div {
  min-width: 140px;
  padding: 16px 18px;
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
}

.grid {
  max-width: 1040px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.card {
  display: grid;
  grid-template-columns: minmax(260px, 420px) 1fr;
  overflow: hidden;
  border: 2px solid;
  border-radius: 32px;
  box-shadow: 0 24px 80px rgba(16, 45, 105, 0.12);
}

.imageWrap {
  min-height: 280px;
  background: #dfe4ea;
}

.imageWrap img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  display: block;
}

.content {
  padding: 28px;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(12px);
}

.previewBlock {
  grid-column: 1 / -1;
  padding: 24px;
  background: rgba(255, 255, 255, 0.55);
}

.brand {
  margin: 0 0 10px;
  font-weight: 800;
}

h2 {
  margin: 0;
  font-size: clamp(26px, 4vw, 44px);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 20px;
  line-height: 1.15;
  color: #42526e;
}

.city {
  display: inline-flex;
  margin: 18px 0 4px;
  padding: 10px 14px;
  border-radius: 999px;
  background: #102d69;
  color: #fff;
  font-weight: 800;
}

dl {
  margin: 20px 0 0;
  display: grid;
  gap: 8px;
}

dl div {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
}

dt {
  color: #6b778c;
  font-size: 13px;
}

dd {
  margin: 0;
  font-size: 13px;
  word-break: break-word;
}

.warnings {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #fff7e6;
  color: #6b4300;
}

.warnings ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

@media (max-width: 820px) {
  .page {
    padding: 24px;
  }

  .card {
    grid-template-columns: 1fr;
  }
}
</style>
