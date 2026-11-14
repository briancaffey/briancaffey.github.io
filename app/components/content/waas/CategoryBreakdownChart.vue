<template>
  <client-only>
    <apexchart height="1000" :options="chartOptions" :series="series" />
  </client-only>
</template>

<script>
import { categoryBreakdown } from '~/data/charts/waas'

export default {
  data() {
    return {
      series: categoryBreakdown.series,
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
          text: 'YC Company Count by Category and Subcategory',
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
            text: 'Age',
          },
          categories: categoryBreakdown.categories,
        },

        yaxis: {
          // decimalsInFloat: 3,
          tickAmount: 7,
          title: {
            text: 'Count',
          },
        },
      },
    }
  },
}
</script>
