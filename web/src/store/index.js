import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    checked: [],
  },
  mutations: {
    setChecked(state, val) {
      state.checked = val;
    },
  },
  actions: {},
  modules: {},
  getters: {
    getChecked: (state) => {
      return state.checked;
    },
  },
});
