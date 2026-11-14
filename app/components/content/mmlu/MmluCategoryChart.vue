<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="360" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
import { mmluCategory } from '~/data/charts/mmlu'

export default {
  data() {
    return {
      series: mmluCategory.series,
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        plotOptions: { bar: { distributed: true, borderRadius: 4 } },
        colors: ["#4C72B0", "#DD8452", "#55A868", "#C44E52"],
        dataLabels: { enabled: true, formatter: function (v) { return v + '%' }, offsetY: -22, style: { colors: ['#888'] } },
        legend: { show: false },
        title: { text: 'MMLU 5-shot accuracy by category' },
        xaxis: { categories: mmluCategory.categories },
        yaxis: { max: 100, title: { text: 'accuracy (%)' } },
        annotations: { yaxis: [ { y: 73.5, borderColor: '#888', strokeDashArray: 5, label: { text: 'overall 73.5%', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } }, { y: 25, borderColor: '#aaa', strokeDashArray: 2, label: { text: 'random 25%', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] }
      }
    },
  },
}
</script>
