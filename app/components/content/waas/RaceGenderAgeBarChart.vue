<template>
  <client-only>
    <apexchart height="350" :options="chartOptions" :series="series" />
  </client-only>
</template>

<script>
import { raceGenderAge } from '~/data/charts/waas'


export default {

  data() {
    return {
      series: raceGenderAge.series,
      chartOptions: {
        dataLabels: {
          enabled: false,
        },
        theme: {
          mode:
            this.$colorMode.preference === 'light' ||
            this.$colorMode.preference === 'system'
              ? 'light'
              : 'dark',
        },
        title: {
          text: "Age, Race and Gender",
        },
        chart: {

          animations: {
            enabled: false,
          },
          height: 350,
          type: 'bar',
          stacked: true,
          zoom: {
            enabled: true,
            type: 'xy',
          },
        },
        xaxis: {
          decimalsInFloat: 0,
          title: {
            text: "Age",
          },
          categories: raceGenderAge.categories,
          tickAmount: 10,
          labels: {
            formatter: function (val) {
              return parseFloat(val).toFixed(1)
            },
          },
        },

        yaxis: {
          // decimalsInFloat: 3,
          tickAmount: 7,
          title: {
            text: "Count",
          },
        },
      },
    }
  },
}
</script>
