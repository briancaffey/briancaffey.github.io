<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="340" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
import { mmluConfidence } from '~/data/charts/mmlu'

export default {
  data() {
    return {
      series: mmluConfidence.series,
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '95%' } },
        colors: ['#55A868', '#C44E52'], dataLabels: { enabled: false }, fill: { opacity: 0.7 },
        title: { text: 'Confidence (top1-top2 log-prob gap): correct vs incorrect' },
        xaxis: { categories: mmluConfidence.categories, tickAmount: 10, title: { text: 'confidence margin' } },
        yaxis: { title: { text: '# questions' } }
      }
    },
  },
}
</script>
