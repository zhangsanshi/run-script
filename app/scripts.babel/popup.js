'use strict';

import { LocalStorage } from './storage.js';
import Status from './config/status.js';
import Util from './util/util.js';

function toggleStatus(status, ele = Util.$query('#status')[0]) {
  if (status) {
    Util.toggleClass(ele.parentElement, 'active', true);
    ele.innerText = Status.off;
  } else {
    Util.toggleClass(ele.parentElement, 'active', false);
    ele.innerText = Status.on;
  }
}

function getPageStatus(func) {
  Util.getActiveTab().then(tabs => {
    const tab = tabs[0];
    if (tab) {
      LocalStorage.get(['on', 'off'], (items) => {
        let isOn = false;
        let isOff = false;
        function filterData(item) {
          const url = tab.url;
          const sourceUrl = item.url;
          return new RegExp(sourceUrl).test(url) || sourceUrl === url;
        }
        if (items.on) {
          isOn = items.on.some(filterData);
        }
        if (items.off) {
          isOff = items.off.some(filterData);
        }
        if (func) {
          func(isOn, isOff, tab);
        }
      });
    }
  });
}
let statusLoading = false;
function onStatusEvent() {
  const ele = Util.$query('#status')[0];
  statusLoading = true;
  ele.addEventListener('click', function() {
    getPageStatus((isOn, isOff, tab) => {
      toggleStatus(!(isOn && !isOff), this);
      if (isOn && !isOff) {
        LocalStorage.add('off', tab.url);
      } else {
        LocalStorage.remove('off', tab.url);
      }
      statusLoading = false;
    });
  });
}

function renderStatus() {
  getPageStatus((isOn, isOff) => {
    toggleStatus(isOn && !isOff);
  });
}

function linkToOptions() {
  const manageEle = Util.$query('#manage')[0];
  manageEle.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
}
window.onload = function () {
  renderStatus();
  linkToOptions();
  onStatusEvent();
};