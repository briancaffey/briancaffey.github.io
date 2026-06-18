<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="400" type="heatmap" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
export default {
  data() {
    return {
      series: [{"name": "gold D", "data": [{"x": "pred A", "y": 8.8}, {"x": "pred B", "y": 11.2}, {"x": "pred C", "y": 9.0}, {"x": "pred D", "y": 70.9}]}, {"name": "gold C", "data": [{"x": "pred A", "y": 10.4}, {"x": "pred B", "y": 11.0}, {"x": "pred C", "y": 72.7}, {"x": "pred D", "y": 5.9}]}, {"name": "gold B", "data": [{"x": "pred A", "y": 10.1}, {"x": "pred B", "y": 75.6}, {"x": "pred C", "y": 7.9}, {"x": "pred D", "y": 6.4}]}, {"name": "gold A", "data": [{"x": "pred A", "y": 75.1}, {"x": "pred B", "y": 10.4}, {"x": "pred C", "y": 8.6}, {"x": "pred D", "y": 6.0}]}],
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
