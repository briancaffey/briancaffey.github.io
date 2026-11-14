<template>
  <client-only>
    <apexchart :key="isDark ? 'd' : 'l'" height="1350" type="bar" :options="chartOptions" :series="series" />
  </client-only>
</template>
<script>
import { mmluSubject } from '~/data/charts/mmlu'

export default {
  data() {
    return {
      series: mmluSubject.series,
    }
  },
  computed: {
    isDark() { return !!(this.$colorMode && this.$colorMode.value === 'dark') },
    chartOptions() {
      return {
        theme: { mode: this.isDark ? 'dark' : 'light' },
        chart: { background: 'transparent', fontFamily: 'inherit', animations: { enabled: false }, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, distributed: true, barHeight: '80%' } },
        colors: mmluSubject.colors,
        dataLabels: { enabled: false },
        legend: { show: false },
        title: { text: 'Accuracy by subject (color = category, hover for details)' },
        xaxis: { max: 100, title: { text: 'accuracy (%)' } },
        yaxis: { labels: { style: { fontSize: '11px' } } },
        annotations: { xaxis: [ { x: 73.5, borderColor: '#888', strokeDashArray: 5, label: { text: 'overall', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } }, { x: 25, borderColor: '#aaa', strokeDashArray: 2, label: { text: 'random', style: { background: '#475569', color: '#ffffff', fontSize: '11px' } } } ] },
        tooltip: { custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const cat = { '#4C72B0': 'STEM', '#DD8452': 'Humanities', '#55A868': 'Social Sciences', '#C44E52': 'Other' }[w.config.colors[dataPointIndex]] || ''
          const subj = w.globals.labels[dataPointIndex]
          return '<div style="padding:6px 10px"><b>' + subj + '</b><br>category: ' + cat + '<br>accuracy: ' + series[seriesIndex][dataPointIndex] + '%</div>'
        } }
      }
    },
  },
}
</script>
