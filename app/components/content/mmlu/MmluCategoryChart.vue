<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="360" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
export default {
  data() {
    return {
      series: [{ name: 'Accuracy', data: [70.2, 67.7, 82.1, 77.1] }],
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
        xaxis: { categories: ["STEM (n=3153)", "Humanities (n=4705)", "Social Sciences (n=3077)", "Other (n=3107)"] },
        yaxis: { max: 100, title: { text: 'accuracy (%)' } },
        annotations: { yaxis: [ { y: 73.5, borderColor: '#888', strokeDashArray: 5, label: { text: 'overall 73.5%', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } }, { y: 25, borderColor: '#aaa', strokeDashArray: 2, label: { text: 'random 25%', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] }
      }
    },
  },
}
</script>
