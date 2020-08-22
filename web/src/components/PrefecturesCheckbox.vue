<template>
  <div>
    <ul>
      <li v-for="(pref, key) in prefectures" :key="key">
        <input type="checkbox" :value="pref" v-model="checked" />&nbsp;
        <span>{{ pref.prefName }}</span>
        <br />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import store from "../store";
export default {
  name: "PrefecuteresCheckbox",
  data() {
    return {
      prefectures: null,
      checked: [],
    };
  },
  created() {
    this.getPrefData();
  },
  methods: {
    getPrefData() {
      //都道府県データの取得
      const prefectures_url =
        "https://opendata.resas-portal.go.jp/api/v1/prefectures";
      axios
        .get(prefectures_url, {
          headers: { "X-API-KEY": "GUg7et7BNeHPhCkOMWIMi6ANFd6kCoPzffIOFLwG" },
        })
        //prefecturesに都道府県データをオブジェクトとして返す
        .then((response) => (this.prefectures = response.data.result));
    },
  },
  /** ChartContainerでチェックされた都道府県の人口データ取得APIを叩くためにstateを変更 */
  watch: {
    checked: function () {
      store.commit("setChecked", this.checked);
    },
  },
};
</script>

<style>
ul > li {
  list-style: none;
  display: inline-block;
  padding: 10px;
  width: 120px;
}
</style>