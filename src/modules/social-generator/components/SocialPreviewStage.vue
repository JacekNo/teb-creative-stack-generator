<script setup lang="ts">
import { computed } from 'vue';
import type { SocialFormatDefinition } from '../renderer/socialFormats';

type Props = {
  svg: string;
  format: SocialFormatDefinition;
  previewZoom?: number;
};

const props = withDefaults(defineProps<Props>(), {
  previewZoom: 1,
});

const stageStyle = computed(() => ({
  '--preview-aspect-ratio': `${props.format.width} / ${props.format.height}`,
  '--preview-zoom': String(props.previewZoom),
}));
</script>

<template>
  <section
    class="socialPreviewStage"
    :style="stageStyle"
    :aria-label="`Podgląd formatu ${format.label}`"
  >
    <div class="socialPreviewStage__viewport">
      <div class="socialPreviewStage__canvas">
        <div
          class="socialPreviewStage__artboard"
          v-html="svg"
        />
      </div>
    </div>

    <footer class="socialPreviewStage__meta">
      <span>{{ format.label }}</span>
      <span>{{ format.width }}×{{ format.height }}</span>
    </footer>
  </section>
</template>

<style scoped>
.socialPreviewStage {
  display: grid;
  gap: 14px;
  width: 100%;
}

.socialPreviewStage__viewport {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 560px;
  padding: 24px;
  overflow: auto;
  border: 1px solid rgba(15, 68, 150, 0.12);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(15, 68, 150, 0.08), transparent 34%),
    #f5f7fb;
}

.socialPreviewStage__canvas {
  width: min(100%, 760px);
  max-height: 78vh;
  aspect-ratio: var(--preview-aspect-ratio);
  transform: scale(var(--preview-zoom));
  transform-origin: center center;
  transition:
    aspect-ratio 220ms ease,
    transform 180ms ease;
}

.socialPreviewStage__artboard {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  box-shadow:
    0 24px 70px rgba(16, 45, 105, 0.16),
    0 2px 8px rgba(16, 45, 105, 0.08);
}

.socialPreviewStage__artboard :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.socialPreviewStage__meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #53627a;
  font-size: 13px;
}
</style>