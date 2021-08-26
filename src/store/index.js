import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import crm from './modules/crm'
import system from './modules/system'
import user from './modules/user'

const store = new Vuex.Store({
  modules: {
    crm,
    user,
    system
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
});

export default store;
