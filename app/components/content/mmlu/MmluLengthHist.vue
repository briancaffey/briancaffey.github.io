<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="360" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
import { mmluLengthHist } from '~/data/charts/mmlu'

export default {
  data() {
    return {
      series: mmluLengthHist.series,
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '95%' } },
        colors: ['#4C72B0'], dataLabels: { enabled: false },
        title: { text: '5-shot prompt length distribution (tokens)' },
        xaxis: { categories: mmluLengthHist.categories, tickAmount: 10, title: { text: 'prompt length (tokens)' } },
        yaxis: { title: { text: '# questions' } },
        annotations: { xaxis: [ { x: 1754, borderColor: '#C44E52', label: { text: 'p95', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] }
      }
    },
  },
}
</script>
