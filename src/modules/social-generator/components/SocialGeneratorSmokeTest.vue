<script setup lang="ts">
import { computed, ref } from 'vue';
import SocialPreviewStage from './SocialPreviewStage.vue';
import { socialCreativesMock } from '../data/social-creatives.mock';
import {
  SOCIAL_FORMAT_ORDER,
  getSocialFormat,
} from '../renderer/socialFormats';
import type { SocialFormatId } from '../types/social.types';
import { renderSocialSvg } from '../renderer/renderSocialSvg';

const selectedCreativeIndex = ref(0);
const selectedFormatId = ref<SocialFormatId>('square-1080');
const previewZoom = ref(1);
const showDebug = ref(true);

const selectedCreative = computed(() => {
  return socialCreativesMock [selectedCreativeIndex.value];
});

const selectedFormat = computed(() => {
  return getSocialFormat(selectedFormatId.value);
});

const activeSvg = computed(() => {
  return renderSocialSvg({
    creative: selectedCreative.value,
    formatId: selectedFormatId.value,
    showDebugOverlay: showDebug.value,
  });
});
</script>

<template>
  <main class="socialSmoke">
    <aside class="socialSmoke__panel">
      <header class="socialSmoke__header">
        <p class="socialSmoke__eyebrow">TEB Creative Stack</p>
        <h1>Social Generator</h1>
        <p>
          Roboczy model jednego aktywnego podglądu. Format zmienia proporcje,
          ale dane kreacji pozostają wspólne.
        </p>
      </header>

      <section class="socialSmoke__section">
        <h2>Kreacja</h2>

        <label class="socialSmoke__field">
          <span>Kierunek</span>
          <select v-model.number="selectedCreativeIndex">
            <option
              v-for="(creative, index) in socialCreativesMock"
              :key="creative.courseId"
              :value="index"
            >
              {{ creative.courseName }}
            </option>
          </select>
        </label>
      </section>

      <section class="socialSmoke__section">
        <h2>Format podglądu</h2>

        <div class="socialSmoke__formatTabs">
          <button
            v-for="formatId in SOCIAL_FORMAT_ORDER"
            :key="formatId"
            type="button"
            class="socialSmoke__formatButton"
            :class="{ 'is-active': selectedFormatId === formatId }"
            @click="selectedFormatId = formatId"
          >
            {{ getSocialFormat(formatId).ratio }}
            <span>{{ getSocialFormat(formatId).width }}×{{ getSocialFormat(formatId).height }}</span>
          </button>
        </div>
      </section>

      <section class="socialSmoke__section">
        <h2>Podgląd</h2>

        <label class="socialSmoke__field">
          <span>Zoom UI</span>
          <input
            v-model.number="previewZoom"
            type="range"
            min="0.6"
            max="1.2"
            step="0.05"
          >
          <strong>{{ Math.round(previewZoom * 100) }}%</strong>
        </label>

        <label class="socialSmoke__check">
          <input
            v-model="showDebug"
            type="checkbox"
          >
          <span>Debug overlay</span>
        </label>
      </section>

      <section class="socialSmoke__section socialSmoke__summary">
        <h2>Aktywny render</h2>
        <dl>
          <div>
            <dt>Format</dt>
            <dd>{{ selectedFormat.label }}</dd>
          </div>
          <div>
            <dt>Wymiar</dt>
            <dd>{{ selectedFormat.width }}×{{ selectedFormat.height }}</dd>
          </div>
          <div>
            <dt>Kierunek</dt>
            <dd>{{ selectedCreative.courseName }}</dd>
          </div>
        </dl>
      </section>
    </aside>

    <section class="socialSmoke__preview">
      <SocialPreviewStage
        :svg="activeSvg"
        :format="selectedFormat"
        :preview-zoom="previewZoom"
      />
    </section>
  </main>
</template>

<style scoped>
.socialSmoke {
  display: grid;
  grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
  min-height: 100vh;
  background: #eef3fb;
  color: #102d69;
}

.socialSmoke__panel {
  display: grid;
  align-content: start;
  gap: 22px;
  padding: 32px;
  border-right: 1px solid rgba(15, 68, 150, 0.12);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
}

.socialSmoke__header {
  display: grid;
  gap: 8px;
}

.socialSmoke__eyebrow {
  margin: 0;
  color: #0f4496;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.socialSmoke__header h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1;
}

.socialSmoke__header p {
  margin: 0;
  color: #53627a;
  line-height: 1.5;
}

.socialSmoke__section {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid rgba(15, 68, 150, 0.1);
  border-radius: 22px;
  background: #ffffff;
}

.socialSmoke__section h2 {
  margin: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.socialSmoke__field {
  display: grid;
  gap: 8px;
  color: #53627a;
  font-size: 13px;
}

.socialSmoke__field select,
.socialSmoke__field input[type='range'] {
  width: 100%;
}

.socialSmoke__field select {
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(15, 68, 150, 0.18);
  border-radius: 12px;
  color: #102d69;
  background: #f8fafc;
}

.socialSmoke__formatTabs {
  display: grid;
  gap: 8px;
}

.socialSmoke__formatButton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid rgba(15, 68, 150, 0.14);
  border-radius: 14px;
  color: #102d69;
  background: #f8fafc;
  cursor: pointer;
}

.socialSmoke__formatButton span {
  color: #68758a;
  font-size: 12px;
}

.socialSmoke__formatButton.is-active {
  border-color: #0f4496;
  background: #0f4496;
  color: #ffffff;
}

.socialSmoke__formatButton.is-active span {
  color: rgba(255, 255, 255, 0.72);
}

.socialSmoke__check {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #53627a;
  font-size: 14px;
}

.socialSmoke__summary dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.socialSmoke__summary dl > div {
  display: grid;
  gap: 2px;
}

.socialSmoke__summary dt {
  color: #718096;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.socialSmoke__summary dd {
  margin: 0;
  color: #102d69;
  font-weight: 700;
}

.socialSmoke__preview {
  min-width: 0;
  padding: 32px;
}

@media (max-width: 1100px) {
  .socialSmoke {
    grid-template-columns: 1fr;
  }

  .socialSmoke__panel {
    border-right: 0;
    border-bottom: 1px solid rgba(15, 68, 150, 0.12);
  }
}
</style>