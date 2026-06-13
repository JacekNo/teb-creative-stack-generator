<script setup lang="ts">
import { computed } from 'vue';
import type {
  SocialCreativeData,
  SocialFormatId,
} from '../types/social.types';
import { getSocialFormat } from '../renderer/socialFormats';
import { renderSocialSvg } from '../renderer/renderSocialSvg';

const props = defineProps<{
  creative: SocialCreativeData;
  formatId: SocialFormatId;
  showDebugOverlay?: boolean;
}>();

const format = computed(() => getSocialFormat(props.formatId));

const svgMarkup = computed(() =>
  renderSocialSvg({
    creative: props.creative,
    formatId: props.formatId,
    showDebugOverlay: props.showDebugOverlay ?? false,
  }),
);
</script>

<template>
  <article class="socialPreview">
    <header class="socialPreview__header">
      <div>
        <p class="socialPreview__eyebrow">Social format</p>
        <h3>{{ format.label }}</h3>
      </div>
      <span class="socialPreview__size">
        {{ format.width }}×{{ format.height }}
      </span>
    </header>

    <div class="socialPreview__canvas">
      <div
        class="socialPreview__svg"
        v-html="svgMarkup"
      />
    </div>
  </article>
</template>

<style scoped>
.socialPreview {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.socialPreview__header {
  display: flex;
  gap: 12px;
  align-items: end;
  justify-content: space-between;
}

.socialPreview__eyebrow {
  margin: 0 0 4px;
  color: #5d6875;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.socialPreview h3 {
  margin: 0;
  color: #102d69;
  font-size: 15px;
  line-height: 1.1;
}

.socialPreview__size {
  flex: 0 0 auto;
  color: #5d6875;
  font-size: 12px;
  font-weight: 700;
}

.socialPreview__canvas {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(16, 45, 105, 0.14);
  border-radius: 18px;
  background:
    linear-gradient(45deg, rgba(16, 45, 105, 0.035) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(16, 45, 105, 0.035) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(16, 45, 105, 0.035) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(16, 45, 105, 0.035) 75%);
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0;
  background-size: 20px 20px;
}

.socialPreview__svg {
  display: grid;
  place-items: center;
  padding: 16px;
}

.socialPreview__svg :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  max-height: 720px;
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(16, 45, 105, 0.12);
}
</style>