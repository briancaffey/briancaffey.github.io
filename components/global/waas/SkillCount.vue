<template>
  <div>
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
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
        plotOptions: {},
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

        // yaxis: {
        //   decimalsInFloat: 3,
        //   tickAmount: 7,
        // },
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
