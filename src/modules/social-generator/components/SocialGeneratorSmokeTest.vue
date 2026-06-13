<script setup lang="ts">
import { computed, ref } from 'vue';
import SocialFormatPreview from './SocialFormatPreview.vue';
import { socialCreativesMock } from '../data/social-creatives.mock';
import { SOCIAL_FORMAT_ORDER } from '../renderer/socialFormats';

const selectedCreativeIndex = ref(0);
const showDebugOverlay = ref(true);

const selectedCreative = computed(
  () => socialCreativesMock[selectedCreativeIndex.value] ?? socialCreativesMock[0],
);
</script>

<template>
  <section class="socialSmoke">
    <header class="socialSmoke__header">
      <div>
        <p class="socialSmoke__eyebrow">TEB Creative Stack</p>
        <h2>Social generator smoke test</h2>
        <p>
          Roboczy podgląd renderera social media na danych mockowych.
          Layout jest techniczny, a nie finalny wizualnie.
        </p>
      </div>

      <label class="socialSmoke__toggle">
        <input
          v-model="showDebugOverlay"
          type="checkbox"
        >
        Debug overlay
      </label>
    </header>

    <div class="socialSmoke__controls">
      <label
        v-for="(creative, index) in socialCreativesMock"
        :key="creative.courseId"
        class="socialSmoke__choice"
      >
        <input
          v-model="selectedCreativeIndex"
          type="radio"
          :value="index"
        >
        <span>
          <strong>{{ creative.courseName }}</strong>
          <small>{{ creative.offerMode }}</small>
        </span>
      </label>
    </div>

    <div class="socialSmoke__grid">
      <SocialFormatPreview
        v-for="formatId in SOCIAL_FORMAT_ORDER"
        :key="formatId"
        :creative="selectedCreative"
        :format-id="formatId"
        :show-debug-overlay="showDebugOverlay"
      />
    </div>
  </section>
</template>

<style scoped>
.socialSmoke {
  display: grid;
  gap: 24px;
  padding: 32px;
}

.socialSmoke__header {
  display: flex;
  gap: 24px;
  align-items: start;
  justify-content: space-between;
}

.socialSmoke__eyebrow {
  margin: 0 0 8px;
  color: #0f4496;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.socialSmoke h2 {
  margin: 0 0 8px;
  color: #102d69;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 0.98;
  letter-spacing: -0.05em;
}

.socialSmoke p {
  max-width: 720px;
  margin: 0;
  color: #5d6875;
}

.socialSmoke__toggle {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid rgba(16, 45, 105, 0.14);
  border-radius: 999px;
  color: #102d69;
  font-size: 13px;
  font-weight: 800;
  background: #ffffff;
}

.socialSmoke__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.socialSmoke__choice {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid rgba(16, 45, 105, 0.14);
  border-radius: 16px;
  background: #ffffff;
  color: #102d69;
  cursor: pointer;
}

.socialSmoke__choice span {
  display: grid;
  gap: 2px;
}

.socialSmoke__choice strong {
  font-size: 14px;
  line-height: 1.1;
}

.socialSmoke__choice small {
  color: #5d6875;
  font-size: 11px;
  font-weight: 700;
}

.socialSmoke__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  gap: 20px;
  align-items: start;
}

@media (max-width: 1100px) {
  .socialSmoke__grid {
    grid-template-columns: 1fr;
  }

  .socialSmoke__header {
    display: grid;
  }
}
</style>