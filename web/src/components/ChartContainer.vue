<template>
  <div class="container">
    <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";

export default {
  name: "LineChartContainer",
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartdata: null,
    options: {
      title: {
        display: true,
        text: "都道府県別　人口比較",
      },
    },
  }),
  async mounted() {
    this.loaded = false;
    try {
      const { userlist } = await fetch("/api/userlist");
      this.chartData = userlist;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>