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
    loaded: true,
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
  /** チェックされたprefIdを渡す */
  watch: {
    checked: function (val) {
      this.loaded = false;
      // 描画前にグラフデータ初期化する
      this.chartdata.datasets = [];
      if (val.length === 0) {
        setTimeout(() => {
          this.loaded = true;
        }, 500);
      } else {
        // 配列の最後に格納されている都道府県のときにloadedをtrueにしたいためlastPrefを渡す
        let lastPref = false;
        for (let i = 0; i < val.length; i++) {
          if (i === val.length - 1) lastPref = true;
          this.getPopulationData(val[i], lastPref);
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
    createChartdata(poplation, prefName, lastPref) {
      const borderColor = "#2ecc71";

      const dataset = {
        label: prefName,
        data: poplation,
        borderColor: borderColor,
        backgroundColor: "rgba(0,0,0,0)",
      };
      this.chartdata.datasets.push(dataset);
      if (lastPref) {
        setTimeout(() => {
          this.loaded = true;
        }, 500);
      }
    },
    getPopulationData(stateChecked, lastPref) {
      let checkedId = stateChecked.prefCode;
      let checkedName = stateChecked.prefName;

      //人口構成データの取得
      const perYear_url =
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear";

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
            let poplationDataList = response.data.result.data.filter(data => data.label === '総人口')[0].data
            const populationData = poplationDataList.map((data) => {
              return data.value
            })
            this.createChartdata(populationData, checkedName, lastPref);
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