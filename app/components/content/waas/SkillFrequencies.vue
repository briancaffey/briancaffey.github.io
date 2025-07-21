<template>
  <div>
    <client-only>

      <div>
        Select a skill from the dropdown to see the most common skills listed with
        that skill:
      </div>
      <select id="skillSelect" v-model="selectedSkill" name="skill">
        <option v-for="skill in skillFrequencies" :key="skill" :value="skill">
          {{ skill }}
        </option>
      </select>
      <div v-for="(skill, i) in relatedSkills" :key="i">
        {{ skill[0] }} ({{ skill[1] }})
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWaasStore } from '@/stores/waas'; // Import the Pinia store

const store = useWaasStore();
const selectedSkill = ref(null);

// Fetch skill frequencies when the component is mounted
onMounted(() => {
  store.fetchSkillFrequencyData();
});

// Computed property to get the list of skill frequencies
const skillFrequencies = computed(() =>
  Object.keys(store.getSkillFrequencies)
);

// Computed property to get related skills for the selected skill
const relatedSkills = computed(() =>
  selectedSkill.value
    ? store.getRelatedSkillsForSkill(selectedSkill.value)
    : []
);
</script>
