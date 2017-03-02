export default {
  wrapPromise(func) {
    return new Promise(func);
  },
  $query(selector) {
    return document.querySelectorAll(selector);
  },
  toggleClass(ele, className, isAdd) {
    if (isAdd) {
      ele.className = ele.className + ' active';
    } else {
      ele.className = ele.className.replace(/(\s?)active(\s?)/g, ' ');
    }
  },
  getActiveTab() {
    return this.wrapPromise(function (resolve, reject) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        resolve(tabs);
      });
    });
  }
};