import Vue from 'vue';
import App from './App.vue';
// @ts-ignore
import uView from 'uview-ui';
Vue.config.productionTip = false;
Vue.use(uView);
new App().$mount();
