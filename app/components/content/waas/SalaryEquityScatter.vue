<template>
  <div>
    <client-only>
      <apexchart
        type="scatter"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWaasStore } from '@/stores/waas'; // Import the Pinia store
const colorMode = useColorMode();
const store = useWaasStore();

// Fetch data when the component is mounted
onMounted(() => {
  store.fetchData();
});

// Chart options
const chartOptions = ref({
  theme: {
    mode:
      colorMode.preference === 'light' ||
      colorMode.preference === 'system'
        ? 'light'
        : 'dark',
  },
  title: {
    text: "Average Salary, Equity and Years of Experience",
  },
  chart: {
    animations: {
      enabled: false,
    },
    height: 350,
    type: 'scatter',
    zoom: {
      enabled: true,
      type: 'xy',
    },
  },
  xaxis: {
    title: {
      text: "Average Salary",
    },
    tickAmount: 10,
    labels: {
      formatter: function (val) {
        return parseFloat(val).toFixed(1);
      },
    },
  },
  tooltip: {
    x: {
      show: true,
      formatter: function (value, opts) {
        return (
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
            .jobTitle +
          " | " +
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
            .companyName
        );
      },
    },
    y: {
      show: false,
      formatter: function (value, opts) {
        return (
          "$" +
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].x +
          " | " +
          (opts.series[opts.seriesIndex][opts.dataPointIndex] * 100).toFixed(3) +
          "%"
        );
      },
    },
  },
  yaxis: {
    title: {
      text: "Average Equity",
    },
    decimalsInFloat: 3,
    tickAmount: 7,
  },
});

// Computed property for the series data
const series = computed(() => store.getSalaryEquitySeries);

</script>

<style scoped></style>
