<script setup lang="ts">
import { computed } from 'vue';
import type { ResolvedCreativeInput } from '../types/ads.types';
import { GOOGLE_ADS_FORMATS } from '../renderer/googleAdsFormats';
import { renderAdSvg } from '../renderer/renderAdSvg';

const props = defineProps<{
  creative: ResolvedCreativeInput;
}>();

const previews = computed(() => {
  return GOOGLE_ADS_FORMATS.map((format) => ({
    format,
    svg: renderAdSvg(props.creative, format),
  }));
});
</script>

<template>
  <section class="formats">
    <article v-for="preview in previews" :key="preview.format.id" class="formatCard">
      <header>
        <strong>{{ preview.format.label }}</strong>
        <span>{{ preview.format.width }}×{{ preview.format.height }}</span>
      </header>

      <div class="svgWrap">
        <div class="svgScale" v-html="preview.svg" />
      </div>
    </article>
  </section>
</template>

<style scoped>
.formats {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 18px;
  align-items: start;
}

.formatCard {
  padding: 14px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(16, 45, 105, 0.1);
}

header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: #102d69;
}

header span {
  color: #6b778c;
  font-size: 13px;
}

.svgWrap {
  overflow: hidden;
  border-radius: 16px;
  background: #edf1f7;
}

.svgScale {
  width: 100%;
}

.svgScale :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 1100px) {
  .formats {
    grid-template-columns: 1fr;
  }
}
</style>