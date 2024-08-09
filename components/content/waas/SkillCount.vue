<template>
  <div>
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'skill-count',
  created() {
    this.$store.dispatch('waas/fetchData')
  },
  data() {
    return {
      chartOptions: {
        theme: {
          mode:
            this.$colorMode.preference === 'light' ||
            this.$colorMode.preference === 'system'
              ? 'light'
              : 'dark',
        },
        plotOptions: {},
        title: {
          text: "Count of skills listed in job postings",
        },
        chart: {
          animations: {
            enabled: false,
          },
          height: 600,
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'xy',
          },
        },
        xaxis: {
        title: {
          text: "Skill",
        },
          categories: this.$store.getters['waas/getTopSkills'],
          tickAmount: 10,
          labels: {
            show: false,
            // formatter: function (val) {
            //   return parseFloat(val).toFixed(1)
            // },
          },
        },
        dataLabels: {
          enabled: false,
        },

        yaxis: {
          title: {
            text: "Count",
          },
        },
      },
    }
  },
  computed: {
    series() {
      return [
        {
          name: 'Skill Count',
          data: this.$store.getters['waas/getTopSkillCounts'],
        },
      ]
    },
  },
}
</script>

<style scoped></style>
