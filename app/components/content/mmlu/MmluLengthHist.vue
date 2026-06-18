<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="360" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
export default {
  data() {
    return {
      series: [{ name: 'questions', data: [1743, 1807, 1856, 1721, 1979, 1470, 291, 275, 170, 57, 97, 146, 151, 85, 80, 62, 60, 90, 199, 526, 435, 208, 97, 40, 20, 10, 31, 67, 68, 29, 6, 1, 3, 21, 42, 32, 22, 26, 14, 5] }],
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
        xaxis: { categories: [274, 346, 418, 489, 561, 633, 705, 777, 849, 920, 992, 1064, 1136, 1208, 1279, 1351, 1423, 1495, 1567, 1639, 1710, 1782, 1854, 1926, 1998, 2070, 2141, 2213, 2285, 2357, 2429, 2500, 2572, 2644, 2716, 2788, 2860, 2931, 3003, 3075], tickAmount: 10, title: { text: 'prompt length (tokens)' } },
        yaxis: { title: { text: '# questions' } },
        annotations: { xaxis: [ { x: 1754, borderColor: '#C44E52', label: { text: 'p95', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] }
      }
    },
  },
}
</script>
