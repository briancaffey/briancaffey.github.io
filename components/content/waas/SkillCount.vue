<template>
  <div>

    <client-only>

      <apexchart
      v-if="chartOptions && series"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
      />
    </client-only>
  </div>
</template>

<script setup>
import { useWaasStore } from '@/stores/waas';
// import { VueApexCharts } from 'vue3-apexcharts';
import { computed } from 'vue';
const colorMode = useColorMode();
const store = useWaasStore();
onMounted(() => {
  store.fetchData();
});
const series = computed(() => {
  return [
    {
      name: 'Skill Count',
      // Using Pinia store for data
      data: store.getTopSkillCounts,
    },
  ];
});
const chartOptions = computed(() => {
  return {
        theme: {
          mode:
            colorMode.preference === 'light' ||
            colorMode.preference === 'system'
              ? 'light'
              : 'dark',
        },
        plotOptions: {},
        title: {
          text: "Count of skills listed in job postings",
        },
        chart: {
          animations: {
            enabled: false,
          },
          height: 600,
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'xy',
          },
        },
        xaxis: {
          title: {
            text: "Skill",
          },
          // Using Pinia store for categories
          categories: store.getTopSkills,
          tickAmount: 10,
          labels: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        }
      }
    });
</script>
