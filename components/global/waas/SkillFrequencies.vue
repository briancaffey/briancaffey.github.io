<template>
  <div>
    <div>
      Select a skill from the dropdown to see the most common skills listed with
      that skill:
    </div>
    <select id="skillSelect" v-model="selectedSkill" name="skill">
      <option v-for="skill in skillFrequencies" :key="skill" :value="skill">
        {{ skill }}
      </option>
    </select>
    <div
      v-for="(skill, i) in $store.getters['waas/getRelatedSkillsForSkill'](
        selectedSkill
      )"
      :key="i"
    >
      {{ skill[0] }} ({{ skill[1] }})
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSkill: null,
    }
  },
  computed: {
    skillFrequencies() {
      return Object.keys(this.$store.getters['waas/getSkillFrequencies'])
    },
  },
  created() {
    this.$store.dispatch('waas/fetchSkillFrequencyData')
  },
}
</script>

<style scoped></style>
