<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="400" type="heatmap" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
import { mmluConfusion } from '~/data/charts/mmlu'

export default {
  data() {
    return {
      series: mmluConfusion.series,
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        colors: ['#4C72B0'], dataLabels: { enabled: true, formatter: function (v) { return v + '%' } },
        title: { text: 'Confusion: gold (row) vs model pick (col), row-normalized' },
        plotOptions: { heatmap: { radius: 2, enableShades: true, colorScale: { ranges: [ { from: 0, to: 100, color: '#4C72B0' } ] } } }
      }
    },
  },
}
</script>
