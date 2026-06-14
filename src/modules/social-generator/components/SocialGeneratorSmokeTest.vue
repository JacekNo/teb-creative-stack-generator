<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import SocialPreviewStage from './SocialPreviewStage.vue';
import { socialCreativeCatalog } from '../data/socialCreativeCatalog';
import {
  SOCIAL_FORMAT_ORDER,
  getSocialFormat,
} from '../renderer/socialFormats';
import type {
  SocialComponentId,
  SocialCourseBadgeTone,
  SocialCourseFactIcon,
  SocialCourseFactType,
  SocialCreativeData,
  SocialFormatId,
  TextFallbackValue,
} from '../types/social.types';
import { renderSocialSvg } from '../renderer/renderSocialSvg';

const defaultCreativeIndex = socialCreativeCatalog.findIndex(
  (creative) =>
    creative.courseId === 'pku-online-programowanie-python-z-cisco-networking-academy' ||
    creative.courseId === 'pku-programowanie-python-z-cisco-networking-academy',
);
const selectedCreativeIndex = ref(Math.max(0, defaultCreativeIndex));
const selectedFormatId = ref<SocialFormatId>('square-1080');
const previewZoom = ref(1);
const showDebug = ref(true);

type EditableFact = {
  enabled: boolean;
  type: SocialCourseFactType;
  value: string;
  label: string;
  icon: SocialCourseFactIcon;
};

type EditableBadge = {
  enabled: boolean;
  label: string;
  tone: SocialCourseBadgeTone;
};

const form = reactive({
  titleMain: '',
  subtitle: '',
  modeLabel: '',
  showSubtitle: false,
  showModeLabel: false,
  cityName: '',
  showCity: false,
  showPartnerLogo: false,
  showCourseFacts: true,
  facts: [
    {
      enabled: true,
      type: 'duration' as SocialCourseFactType,
      value: '',
      label: '',
      icon: 'clock' as SocialCourseFactIcon,
    },
    {
      enabled: false,
      type: 'schedule' as SocialCourseFactType,
      value: '',
      label: '',
      icon: 'calendar' as SocialCourseFactIcon,
    },
  ] satisfies EditableFact[],
  showCourseBadges: true,
  badges: [
    {
      enabled: true,
      label: '',
      tone: 'primary' as SocialCourseBadgeTone,
    },
    {
      enabled: true,
      label: '',
      tone: 'green' as SocialCourseBadgeTone,
    },
    {
      enabled: false,
      label: '',
      tone: 'popular' as SocialCourseBadgeTone,
    },
  ] satisfies EditableBadge[],
});

function isTextFallbackValue(value: unknown): value is TextFallbackValue {
  return typeof value === 'object' && value !== null && 'full' in value;
}

function getTextValue(value: string | TextFallbackValue | undefined): string {
  if (!value) {
    return '';
  }

  if (isTextFallbackValue(value)) {
    return value.short ?? value.compact ?? value.full;
  }

  return value;
}

function setComponentEnabled(
  components: Set<SocialComponentId>,
  component: SocialComponentId,
  enabled: boolean,
): void {
  if (enabled) {
    components.add(component);
    return;
  }

  components.delete(component);
}

function resetFormFromCreative(creative: SocialCreativeData): void {
  const parts = creative.courseNameParts ?? {
    main: creative.courseName,
    subtitle: '',
    modeLabel: '',
  };

  form.titleMain = getTextValue(parts.main);
  form.subtitle = getTextValue(parts.subtitle);
  form.modeLabel = getTextValue(parts.modeLabel);
  form.showSubtitle = Boolean(form.subtitle);
  form.showModeLabel = Boolean(form.modeLabel);
  form.cityName = creative.cityName ?? '';
  form.showCity =
    creative.enabledComponents.includes('city') &&
    Boolean(creative.cityName) &&
    creative.offerMode !== 'online';
  form.showPartnerLogo =
    creative.enabledComponents.includes('partnerLogo') && Boolean(creative.partner);
  form.showCourseFacts = creative.enabledComponents.includes('courseFacts');
  form.showCourseBadges = creative.enabledComponents.includes('courseBadges');

  const facts = creative.courseFacts ?? [];
  form.facts.forEach((fact, index) => {
    const source = facts[index];
    fact.enabled = Boolean(source);
    fact.type = source?.type ?? (index === 0 ? 'duration' : 'schedule');
    fact.value = getTextValue(source?.value);
    fact.label = getTextValue(source?.label);
    fact.icon = source?.icon ?? (index === 0 ? 'clock' : 'calendar');
  });

  const badges = creative.courseBadges ?? [];
  form.badges.forEach((badge, index) => {
    const source = badges[index];
    badge.enabled = Boolean(source);
    badge.label = getTextValue(source?.label);
    badge.tone = source?.tone ?? (index === 0 ? 'primary' : 'green');
  });
}

const baseCreative = computed(() => {
  return socialCreativeCatalog[selectedCreativeIndex.value] ?? socialCreativeCatalog[0];
});

const selectedFormat = computed(() => {
  return getSocialFormat(selectedFormatId.value);
});

watch(
  baseCreative,
  (creative) => resetFormFromCreative(creative),
  { immediate: true },
);

const selectedCreative = computed<SocialCreativeData>(() => {
  const base = baseCreative.value;
  const enabledComponents = new Set(base.enabledComponents);
  const courseFacts = form.facts
    .filter((fact) => form.showCourseFacts && fact.enabled && fact.value)
    .map((fact, index) => ({
      id: `editable-fact-${index + 1}`,
      type: fact.type,
      value: fact.value,
      label: fact.label,
      icon: fact.icon,
    }));
  const courseBadges = form.badges
    .filter((badge) => form.showCourseBadges && badge.enabled && badge.label)
    .map((badge, index) => ({
      id: `editable-badge-${index + 1}`,
      label: badge.label,
      tone: badge.tone,
    }));

  setComponentEnabled(enabledComponents, 'courseFacts', courseFacts.length > 0);
  setComponentEnabled(enabledComponents, 'courseBadges', courseBadges.length > 0);
  setComponentEnabled(
    enabledComponents,
    'city',
    form.showCity && Boolean(form.cityName) && base.offerMode !== 'online',
  );
  setComponentEnabled(
    enabledComponents,
    'partnerLogo',
    form.showPartnerLogo && Boolean(base.partner),
  );

  return {
    ...base,
    courseName: [
      form.titleMain,
      form.showSubtitle ? form.subtitle : '',
      form.showModeLabel ? form.modeLabel : '',
    ]
      .filter(Boolean)
      .join(' '),
    courseNameParts: {
      main: form.titleMain,
      subtitle: form.showSubtitle ? form.subtitle : '',
      modeLabel: form.showModeLabel ? form.modeLabel : '',
    },
    cityName: form.cityName,
    partner: form.showPartnerLogo ? base.partner : undefined,
    courseFacts,
    courseBadges,
    enabledComponents: [...enabledComponents],
  };
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
              v-for="(creative, index) in socialCreativeCatalog"
              :key="creative.courseId"
              :value="index"
            >
              {{ creative.courseName }}
            </option>
          </select>
        </label>
      </section>

      <section class="socialSmoke__section">
        <h2>Treść testowa</h2>

        <label class="socialSmoke__field">
          <span>Nazwa kierunku</span>
          <input
            v-model="form.titleMain"
            type="text"
          >
        </label>

        <div class="socialSmoke__controlRow">
          <label class="socialSmoke__check">
            <input
              v-model="form.showSubtitle"
              type="checkbox"
            >
            <span>Dopisek</span>
          </label>
          <input
            v-model="form.subtitle"
            type="text"
            :disabled="!form.showSubtitle"
          >
        </div>

        <div class="socialSmoke__controlRow">
          <label class="socialSmoke__check">
            <input
              v-model="form.showModeLabel"
              type="checkbox"
            >
            <span>ONLINE / tryb</span>
          </label>
          <input
            v-model="form.modeLabel"
            type="text"
            :disabled="!form.showModeLabel"
          >
        </div>

        <div class="socialSmoke__controlRow">
          <label class="socialSmoke__check">
            <input
              v-model="form.showCity"
              type="checkbox"
            >
            <span>Miasto</span>
          </label>
          <input
            v-model="form.cityName"
            type="text"
            :disabled="!form.showCity"
          >
        </div>

        <label class="socialSmoke__check">
          <input
            v-model="form.showPartnerLogo"
            type="checkbox"
            :disabled="!baseCreative.partner"
          >
          <span>Partner</span>
        </label>
      </section>

      <section class="socialSmoke__section">
        <h2>Course facts</h2>

        <label class="socialSmoke__check">
          <input
            v-model="form.showCourseFacts"
            type="checkbox"
          >
          <span>Pokazuj fakty</span>
        </label>

        <div
          v-for="(fact, index) in form.facts"
          :key="`fact-${index}`"
          class="socialSmoke__controlList"
        >
          <label class="socialSmoke__check">
            <input
              v-model="fact.enabled"
              type="checkbox"
              :disabled="!form.showCourseFacts"
            >
            <span>{{ index === 0 ? 'Czas trwania' : 'Tryb / harmonogram' }}</span>
          </label>

          <div class="socialSmoke__inlineFields">
            <label class="socialSmoke__miniField">
              <span>Wartość</span>
              <input
                v-model="fact.value"
                type="text"
                :disabled="!form.showCourseFacts || !fact.enabled"
              >
            </label>
            <label class="socialSmoke__miniField">
              <span>Opis</span>
              <input
                v-model="fact.label"
                type="text"
                :disabled="!form.showCourseFacts || !fact.enabled"
              >
            </label>
          </div>
        </div>
      </section>

      <section class="socialSmoke__section">
        <h2>Course badges</h2>

        <label class="socialSmoke__check">
          <input
            v-model="form.showCourseBadges"
            type="checkbox"
          >
          <span>Pokazuj badge’e</span>
        </label>

        <div
          v-for="(badge, index) in form.badges"
          :key="`badge-${index}`"
          class="socialSmoke__controlList"
        >
          <label class="socialSmoke__check">
            <input
              v-model="badge.enabled"
              type="checkbox"
              :disabled="!form.showCourseBadges"
            >
            <span>Badge {{ index + 1 }}</span>
          </label>

          <div class="socialSmoke__inlineFields">
            <label class="socialSmoke__miniField">
              <span>Tekst</span>
              <input
                v-model="badge.label"
                type="text"
                :disabled="!form.showCourseBadges || !badge.enabled"
              >
            </label>
            <label class="socialSmoke__miniField socialSmoke__miniField--tone">
              <span>Kolor</span>
              <select
                v-model="badge.tone"
                :disabled="!form.showCourseBadges || !badge.enabled"
              >
                <option value="primary">brand</option>
                <option value="light">outline</option>
                <option value="popular">jasny</option>
                <option value="green">zielony</option>
                <option value="online">online</option>
              </select>
            </label>
          </div>
        </div>
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
.socialSmoke__field input[type='text'],
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

.socialSmoke__field input[type='text'],
.socialSmoke__controlRow input,
.socialSmoke__miniField input,
.socialSmoke__miniField select {
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(15, 68, 150, 0.18);
  border-radius: 12px;
  color: #102d69;
  background: #f8fafc;
}

.socialSmoke__field input:disabled,
.socialSmoke__controlRow input:disabled,
.socialSmoke__miniField input:disabled,
.socialSmoke__miniField select:disabled {
  color: #8792a3;
  background: #eef2f7;
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

.socialSmoke__controlRow {
  display: grid;
  grid-template-columns: minmax(120px, 0.7fr) minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.socialSmoke__controlList {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(15, 68, 150, 0.08);
  border-radius: 14px;
  background: #f8fafc;
}

.socialSmoke__inlineFields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
}

.socialSmoke__miniField {
  display: grid;
  gap: 5px;
  color: #68758a;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.socialSmoke__miniField--tone {
  grid-template-columns: minmax(0, 1fr);
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
