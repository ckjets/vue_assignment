<template>
  <div class="container" style="text-align: -webkit-center;">
    <div style="width: 600px; ">
      <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
      <template v-if="!loaded">
        <div class="fullview">
          <div class="loading-spacer"></div>
          <vue-loading
            style="vue-loading"
            type="spiningDubbles"
            color="#333"
            :size="{ width: '200px', height: '200px' }"
          ></vue-loading>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
import axios from "axios";
import { VueLoading } from "vue-loading-template";

export default {
  name: "LineChartContainer",
  components: { LineChart, VueLoading },
  data: () => ({
    loaded: false,
    chartdata: {
      labels: [
        "1960",
        "1965",
        "1970",
        "1975",
        "1980",
        "1985",
        "1990",
        "1995",
        "2000",
        "2005",
        "2010",
        "2015",
        "2020",
        "2025",
        "2030",
        "2035",
        "2040",
        "2045",
      ],
      datasets: [],
    },
    options: {
      title: {
        display: true,
        text: "都道府県別　人口比較",
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
    },
  }),
  mounted() {
    this.loaded = false;
    // try {
    //   // const { userlist } = await fetch("/api/userlist");
    //   // this.chartData = userlist;
    //   this.loaded = true;
    // } catch (e) {
    //   console.error(e);
    // }
    // this.chartdata.datasets[0].data = [1111, 1111];
    this.loaded = true;
  },
  /** チェックされたprefIdを渡す */
  watch: {
    checked: function (val) {
      this.loaded = false;
      if (val.length === 0) {
        this.chartdata.datasets = [];
        this.loaded = true;
      } else {
        // 描画前にグラフデータ初期化する
        this.chartdata.datasets = [];
        for (let i = 0; i < val.length; i++) {
          //TODO グラフに描画済みのものは追加しない
          this.getPopulationData(val[i], i);
        }
      }
    },
  },

  /** ゲッターを介してチェックされたprefIdを取得 */
  computed: {
    checked() {
      return this.$store.getters.getChecked;
    },
  },
  methods: {
    createChartdata(poplation, prefName, checkedNumber) {
      let borderColor;

      if (checkedNumber === 0) {
        borderColor = "#2ecc71";
      } else if (checkedNumber === 1) {
        borderColor = "#3498db";
      }

      const dataset = {
        label: prefName,
        data: poplation,
        borderColor: borderColor,
        backgroundColor: "rgba(0,0,0,0)",
      };
      this.chartdata.datasets.push(dataset);
      // this.$set(this.chartdata.datasets,"2", datasets);
    },
    getPopulationData(stateChecked, checkedNumber) {
      let checkedId = stateChecked.prefCode;
      let checkedName = stateChecked.prefName;

      //人口構成データの取得
      const perYear_url =
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear";
      //population用の配列
      let populationData = [];
      let tmpPoplationData = [];

      try {
        axios
          .get(perYear_url, {
            headers: {
              "X-API-KEY": "GUg7et7BNeHPhCkOMWIMi6ANFd6kCoPzffIOFLwG",
            },
            params: {
              prefCode: checkedId, //選択された県
              cityCode: "-", //全て取得
            },
          })
          //populationに人口構成(総人口)のデータをオブジェクトとして返す
          .then((response) => {
            tmpPoplationData = response.data.result.data[0].data;
            for (var i = 0; i < tmpPoplationData.length; i++) {
              populationData.push(tmpPoplationData[i].value);
            }
            this.createChartdata(populationData, checkedName, checkedNumber);
            this.loaded = true;
          });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style>
.fullview {
  width: 100%;
  height: 100%;
  background: gray;
  opacity: 0.8;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
}
.loading-spacer {
  height: 30%;
}
</style>