<template>
  <client-only>
    <apexchart height="1000" :options="chartOptions" :series="series" />
  </client-only>
</template>

<script>
export default {
  data() {
    return {
      series: [
        { name: 'Housing and Real Estate', data: [18, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'Construction', data: [3, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'Home and Personal', data: [0, 29, 0, 0, 0, 0, 0, 0] },
        { name: 'Gaming', data: [0, 13, 0, 0, 0, 0, 0, 0] },
        { name: 'Transportation Services', data: [0, 5, 0, 0, 0, 0, 0, 0] },
        { name: 'Food and Beverage', data: [0, 17, 0, 0, 0, 0, 0, 0] },
        { name: 'Content', data: [0, 13, 0, 0, 0, 0, 0, 0] },
        { name: 'Social', data: [0, 12, 0, 0, 0, 0, 0, 0] },
        { name: 'Consumer Electronics', data: [0, 4, 0, 0, 0, 0, 0, 0] },
        { name: 'Apparel and Cosmetics', data: [0, 11, 0, 0, 0, 0, 0, 0] },
        { name: 'Travel, Leisure and Tourism', data: [0, 2, 0, 0, 0, 0, 0, 0] },
        { name: 'Job and Career Services', data: [0, 2, 0, 0, 0, 0, 0, 0] },
        {
          name: 'Virtual and Augmented Reality',
          data: [0, 4, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Engineering, Product and Design',
          data: [0, 0, 57, 0, 0, 0, 0, 0],
        },
        { name: 'Infrastructure', data: [0, 0, 30, 0, 0, 0, 0, 0] },
        { name: 'Productivity', data: [0, 0, 28, 0, 0, 0, 0, 0] },
        { name: 'Security', data: [0, 0, 17, 0, 0, 0, 0, 0] },
        { name: 'Sales', data: [0, 0, 16, 0, 0, 0, 0, 0] },
        { name: 'Marketing', data: [0, 0, 20, 0, 0, 0, 0, 0] },
        { name: 'Recruiting and Talent', data: [0, 0, 23, 0, 0, 0, 0, 0] },
        { name: 'Retail', data: [0, 0, 27, 0, 0, 0, 0, 0] },
        { name: 'Analytics', data: [0, 0, 15, 0, 0, 0, 0, 0] },
        { name: 'Supply Chain and Logistics', data: [0, 0, 18, 0, 0, 0, 0, 0] },
        { name: 'Finance and Accounting', data: [0, 0, 9, 0, 0, 0, 0, 0] },
        { name: 'Operations', data: [0, 0, 19, 0, 0, 0, 0, 0] },
        { name: 'Legal', data: [0, 0, 4, 0, 0, 0, 0, 0] },
        { name: 'Office Management', data: [0, 0, 9, 0, 0, 0, 0, 0] },
        { name: 'Human Resources', data: [0, 0, 17, 0, 0, 0, 0, 0] },
        {
          name: 'Education (Not categorized)',
          data: [0, 0, 0, 29, 0, 0, 0, 0],
        },
        { name: 'Healthcare IT', data: [0, 0, 0, 0, 22, 0, 0, 0] },
        { name: 'Medical Devices', data: [0, 0, 0, 0, 7, 0, 0, 0] },
        { name: 'Healthcare Services', data: [0, 0, 0, 0, 17, 0, 0, 0] },
        { name: 'Drug Discovery and Delivery', data: [0, 0, 0, 0, 9, 0, 0, 0] },
        { name: 'Diagnostics', data: [0, 0, 0, 0, 12, 0, 0, 0] },
        {
          name: 'Consumer Health and Wellness',
          data: [0, 0, 0, 0, 17, 0, 0, 0],
        },
        { name: 'Industrial Bio', data: [0, 0, 0, 0, 9, 0, 0, 0] },
        { name: 'Therapeutics', data: [0, 0, 0, 0, 3, 0, 0, 0] },
        { name: 'Banking and Exchange', data: [0, 0, 0, 0, 0, 18, 0, 0] },
        { name: 'Asset Management', data: [0, 0, 0, 0, 0, 12, 0, 0] },
        { name: 'Insurance', data: [0, 0, 0, 0, 0, 10, 0, 0] },
        { name: 'Credit and Lending', data: [0, 0, 0, 0, 0, 14, 0, 0] },
        { name: 'Payments', data: [0, 0, 0, 0, 0, 17, 0, 0] },
        { name: 'Consumer Finance', data: [0, 0, 0, 0, 0, 14, 0, 0] },
        {
          name: 'Financial Technology and Services (Not categorized)',
          data: [0, 0, 0, 0, 0, 1, 0, 0],
        },
        { name: 'Agriculture', data: [0, 0, 0, 0, 0, 0, 7, 0] },
        { name: 'Aviation and Space', data: [0, 0, 0, 0, 0, 0, 8, 0] },
        { name: 'Energy', data: [0, 0, 0, 0, 0, 0, 2, 0] },
        { name: 'Climate', data: [0, 0, 0, 0, 0, 0, 4, 0] },
        { name: 'Manufacturing and Robotics', data: [0, 0, 0, 0, 0, 0, 8, 0] },
        { name: 'Automotive', data: [0, 0, 0, 0, 0, 0, 6, 0] },
        { name: 'Drones', data: [0, 0, 0, 0, 0, 0, 6, 0] },
        {
          name: 'Government (Not categorized)',
          data: [0, 0, 0, 0, 0, 0, 0, 6],
        },
      ],
      chartOptions: {
        dataLabels: {
          enabled: false,
        },
        theme: {
          mode:
            this.$colorMode.preference === 'light' ||
            this.$colorMode.preference === 'system'
              ? 'light'
              : 'dark',
        },
        title: {
          text: 'YC Company Count by Category and Subcategory',
        },
        chart: {
          animations: {
            enabled: false,
          },
          height: 350,
          type: 'bar',
          stacked: true,
          zoom: {
            enabled: true,
            type: 'xy',
          },
        },
        xaxis: {
          decimalsInFloat: 0,
          title: {
            text: 'Age',
          },
          categories: [
            'Real Estate and Construction',
            'Consumer',
            'B2B Software and Services',
            'Education',
            'Healthcare',
            'Financial Technology and Services',
            'Industrials',
            'Government',
          ],
        },

        yaxis: {
          // decimalsInFloat: 3,
          tickAmount: 7,
          title: {
            text: 'Count',
          },
        },
      },
    }
  },
}
</script>
