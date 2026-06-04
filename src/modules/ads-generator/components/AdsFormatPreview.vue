<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ResolvedCreativeInput } from '../types/ads.types';
import { GOOGLE_ADS_FORMATS } from '../renderer/googleAdsFormats';
import { renderAdSvg } from '../renderer/renderAdSvg';
import { downloadCreativePngSet } from '../export/downloadSvgPngSet';

const props = defineProps<{
  creative: ResolvedCreativeInput;
}>();

const scaleOptions = [
  {
    label: '100%',
    value: 1,
    description: 'realny rozmiar',
  },
  {
    label: '50%',
    value: 0.5,
    description: 'kontrola czytelności',
  },
  {
    label: '25%',
    value: 0.25,
    description: 'symulacja małych placementów',
  },
] as const;

const previewScale = ref<(typeof scaleOptions)[number]['value']>(0.25);
const isExporting = ref(false);
const exportError = ref('');

const activeScaleDescription = computed(() => {
  return scaleOptions.find((option) => option.value === previewScale.value)?.description;
});

const previews = computed(() => {
  return GOOGLE_ADS_FORMATS.map((format) => ({
    format,
    svg: renderAdSvg(props.creative, format),
    scaledWidth: Math.round(format.width * previewScale.value),
    scaledHeight: Math.round(format.height * previewScale.value),
  }));
});

async function handleDownloadSet() {
  if (isExporting.value) return;

  isExporting.value = true;
  exportError.value = '';

  try {
    await downloadCreativePngSet(props.creative);
  } catch (error) {
    exportError.value =
      error instanceof Error
        ? error.message
        : 'Nie udało się wyeksportować setu PNG.';
  } finally {
    isExporting.value = false;
  }
}
</script>

<template>
  <section class="previewPanel" aria-label="Podgląd formatów Google Ads">
    <header class="previewToolbar">
      <div>
        <p class="eyebrow">Podgląd Google Ads</p>
        <h2>Formaty eksportowe</h2>
      </div>

      <div class="toolbarActions">
        <div class="scaleControl" aria-label="Skala podglądu">
          <span class="scaleLabel">Skala</span>

          <div class="scaleButtons">
            <button
              v-for="option in scaleOptions"
              :key="option.value"
              type="button"
              :class="{ active: previewScale === option.value }"
              @click="previewScale = option.value"
            >
              {{ option.label }}
            </button>
          </div>

          <span class="scaleHint">{{ activeScaleDescription }}</span>
        </div>

        <button
          type="button"
          class="exportButton"
          :disabled="isExporting"
          @click="handleDownloadSet"
        >
          {{ isExporting ? 'Eksportuję…' : 'Pobierz set PNG' }}
        </button>
      </div>
    </header>

    <p v-if="exportError" class="exportError">
      {{ exportError }}
    </p>

    <div class="formats">
      <article v-for="preview in previews" :key="preview.format.id" class="formatCard">
        <header class="formatHeader">
          <div>
            <strong>{{ preview.format.label }}</strong>
            <span class="formatMeta">
              {{ preview.format.width }}×{{ preview.format.height }}
            </span>
          </div>

          <span class="scaledMeta">
            {{ preview.scaledWidth }}×{{ preview.scaledHeight }}
          </span>
        </header>

        <div class="svgViewport">
          <div
            class="svgScale"
            :style="{
              '--preview-width': `${preview.scaledWidth}px`,
              '--preview-height': `${preview.scaledHeight}px`,
            }"
            v-html="preview.svg"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.previewPanel {
  display: grid;
  gap: 16px;
}

.previewToolbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  padding: 16px 18px;
  border: 1px solid rgba(16, 45, 105, 0.08);
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.72));
  box-shadow: 0 14px 36px rgba(16, 45, 105, 0.07);
}

.eyebrow {
  margin: 0 0 4px;
  color: #6b778c;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #062b6f;
  font-size: 20px;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.scaleControl {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.scaleLabel,
.scaleHint {
  color: #6b778c;
  font-size: 12px;
  font-weight: 700;
}

.scaleButtons {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: #edf1f7;
}

.scaleButtons button {
  min-height: 30px;
  border: 0;
  border-radius: 999px;
  padding: 0 12px;
  background: transparent;
  color: #102d69;
  font: inherit;
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}

.scaleButtons button.active {
  background: #ffffff;
  box-shadow: 0 5px 14px rgba(16, 45, 105, 0.12);
}

.formats {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 18px;
  align-items: start;
}

.formatCard {
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(16, 45, 105, 0.06);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(16, 45, 105, 0.1);
}

.formatHeader {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  margin-bottom: 12px;
  color: #102d69;
}

.formatHeader strong {
  display: block;
  font-size: 14px;
  line-height: 1.2;
}

.formatMeta {
  display: block;
  margin-top: 3px;
  color: #6b778c;
  font-size: 12px;
  font-weight: 650;
}

.scaledMeta {
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: #edf1f7;
  color: #516078;
  font-size: 11px;
  font-weight: 800;
}

.svgViewport {
  overflow: auto;
  max-height: 70vh;
  padding: 10px;
  border: 1px solid rgba(16, 45, 105, 0.06);
  border-radius: 18px;
  background:
    linear-gradient(45deg, rgba(16, 45, 105, 0.035) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(16, 45, 105, 0.035) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(16, 45, 105, 0.035) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(16, 45, 105, 0.035) 75%),
    #f6f8fb;
  background-position:
    0 0,
    0 6px,
    6px -6px,
    -6px 0;
  background-size: 12px 12px;
}

.svgScale {
  width: var(--preview-width);
  height: var(--preview-height);
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(16, 45, 105, 0.14);
}

.svgScale :deep(svg) {
  display: block;
  width: var(--preview-width);
  height: var(--preview-height);
}
.toolbarActions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.exportButton {
  min-height: 38px;
  border: 0;
  border-radius: 999px;
  padding: 0 16px;
  background: #0941a1;
  color: #ffffff;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(9, 65, 161, 0.2);
}

.exportButton:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(9, 65, 161, 0.26);
}

.exportButton:disabled {
  cursor: wait;
  opacity: 0.68;
}

.exportError {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid rgba(157, 28, 28, 0.12);
  border-radius: 16px;
  background: #ffecec;
  color: #9d1c1c;
  font-size: 13px;
  font-weight: 750;
}
@media (max-width: 1100px) {
  .previewToolbar {
    align-items: start;
    flex-direction: column;
  }

  .scaleControl {
    justify-content: flex-start;
  }
.toolbarActions {
  justify-content: flex-start;
}
  .formats {
    grid-template-columns: 1fr;
  }
}
</style>