<template>
  <div>
    <apexchart
      type="scatter"
      height="350"
      :options="chartOptions"
      :series="$store.getters['waas/getSalaryEquitySeries']"
    ></apexchart>
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
        title: {
          text: "Average Salary, Equity and Years of Experience",
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
          title: {
            text: "Average Salary",
          },
          tickAmount: 10,
          labels: {
            formatter: function (val) {
              return parseFloat(val).toFixed(1)
            },
          },
        },
        tooltip: {
          x: {
            show: true,
            formatter: function(value, opts) {
              return (
                opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
                  .jobTitle + 
                " | " + 
                opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
                  .companyName

              );
            }
          },
          y: {
            show: false,
            formatter: function(value, opts) {
              return (
                "$" +
                opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
                  .x + 
                " | " +
                (opts.series[opts.seriesIndex][opts.dataPointIndex] * 100).toFixed(3) +
                "%"

              );
            }
          }
        },

        yaxis: {
          title: {
            text: "Average Equity",
          },
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
