<template>
  <div class="home">
    <div class="container mt-5">
      <div class="justify-content-center" id="app">
        <h1 class="mb-3">都道府県 人口比較グラフ</h1>
        <h2 class="mb-3">都道府県</h2>

        <!-- {{ checked }}
        <h2>グラフ</h2>-->
        <PrefecuteresCheckbox></PrefecuteresCheckbox>
        <LineChartContainer />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import PrefecuteresCheckbox from '@/components/PrefecuteresCheckbox.vue'
import PrefecuteresCheckbox from "../components/PrefecturesCheckbox";
import LineChartContainer from "../components/ChartContainer";

export default {
  name: "Home",
  components: {
    PrefecuteresCheckbox,
    LineChartContainer,
  },
};
</script>
