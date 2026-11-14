<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="330" type="line" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
import { mmluLengthAccuracy } from '~/data/charts/mmlu'

export default {
  data() {
    return {
      series: mmluLengthAccuracy.series,
      counts: [1716, 1720, 1710, 1719, 1721, 1698, 1742, 1687],
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        colors: ['#55A868'], stroke: { width: 3 }, markers: { size: 5 },
        dataLabels: { enabled: true, formatter: function (v) { return v + '%' } },
        title: { text: 'Accuracy vs prompt length' },
        xaxis: { categories: mmluLengthAccuracy.categories, title: { text: 'prompt length (tokens, binned)' } },
        yaxis: { title: { text: 'accuracy (%)' } },
        annotations: { yaxis: [ { y: 73.5, borderColor: '#888', strokeDashArray: 5, label: { text: 'overall', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] }
      }
    },
  },
}
</script>
