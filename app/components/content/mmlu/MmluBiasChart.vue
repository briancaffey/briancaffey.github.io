<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="330" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
export default {
  data() {
    return {
      series: [{ name: 'gold (correct answer)', data: [22.9, 24.7, 25.5, 26.9] }, { name: 'model picks', data: [24.8, 26.8, 24.9, 23.5] }],
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 3, columnWidth: '60%' } },
        colors: ['#8c8c8c', '#4C72B0'],
        dataLabels: { enabled: true, formatter: function (v) { return v + '%' } },
        title: { text: 'Answer-position bias: gold vs predicted letter' },
        xaxis: { categories: ["A", "B", "C", "D"], title: { text: 'answer letter' } },
        yaxis: { title: { text: 'fraction (%)' } }
      }
    },
  },
}
</script>
