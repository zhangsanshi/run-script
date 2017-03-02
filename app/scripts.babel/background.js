'use strict';
import { LocalStorage } from './storage.js';
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
  if (request && request.url) {
    LocalStorage.get(['on', 'off'], (items) => {
      let onList = [];
      let offList = [];
      function filterData(item) {
        const targetUrl = request.url;
        const sourceUrl = item.url;
        return new RegExp(sourceUrl).test(targetUrl) || sourceUrl === targetUrl;
      }
      if (items.on) {
        onList = items.on.filter(filterData);
      }
      if (items.off) {
        offList = items.off.filter(filterData);
      }
      console.log(onList, offList);
      if (onList.length && !offList.length) {
        sendResponse(onList);
      } else {
        sendResponse([]);
      }
    });
  }
  return true;
});