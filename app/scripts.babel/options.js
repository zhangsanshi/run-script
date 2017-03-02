'use strict';

import App from './app.vue';
import { LocalStorage } from './storage.js';
import Util from './util/util.js';

function ready() {
  var app = new Vue({
    el: '#app',
    render: function (createElement) {
      return createElement(App);
    }
  });
}

function check() {
  LocalStorage.get(['on', 'off'], (items) => {
    var setObj = {};
    if (!Array.isArray(items.on)) {
      setObj.on = [];
    }
    if (!Array.isArray(items.off)) {
      setObj.off = [];
    }
    LocalStorage.set(setObj, () => {
      ready();
    });
  });
}
check();

window.onload = function () {
  const refreshEle = Util.$query('#refresh')[0];
  refreshEle.addEventListener('click', () => {
    LocalStorage.refresh();
  });
}