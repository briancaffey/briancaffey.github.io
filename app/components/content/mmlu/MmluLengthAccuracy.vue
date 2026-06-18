<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="330" type="line" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
export default {
  data() {
    return {
      series: [{ name: 'accuracy', data: [82.1, 78.8, 79.7, 82.3, 70.8, 66.2, 65.5, 62.0] }],
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
        xaxis: { categories: [273, 342, 410, 474, 535, 609, 924, 1496], title: { text: 'prompt length (tokens, binned)' } },
        yaxis: { title: { text: 'accuracy (%)' } },
        annotations: { yaxis: [ { y: 73.5, borderColor: '#888', strokeDashArray: 5, label: { text: 'overall', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] }
      }
    },
  },
}
</script>
