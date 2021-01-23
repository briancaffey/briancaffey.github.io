<template>
  <div>
    <apexchart
      type="scatter"
      height="350"
      :options="chartOptions"
      :series="$store.getters['waas/getSalaryEquitySeries']"
    ></apexchart>
    {{ $colorMode.preference }}
  </div>
</template>

<script>
/* eslint-disable */
export default {
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
        chart: {
          animations: {
            enabled: false,
          },
          height: 350,
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'xy',
          },
        },
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function (val) {
              return parseFloat(val).toFixed(1)
            },
          },
        },

        yaxis: {
          decimalsInFloat: 3,
          tickAmount: 7,
        },
      },
    }
  },
  computed: {
    series() {
      return this.$store.getters['waas/getSalaryEquitySeriesTest']
    },
  },
}
</script>

<style scoped></style>
