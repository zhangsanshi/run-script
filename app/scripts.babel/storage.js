'use strict';

function getIndex(items = [], target) {
  const url = target.url || target;
  let index = -1;
  if (!items.length) {
    return index;
  }
  items.forEach((item, key) => {
    if (new RegExp(item.url).test(url) || item.url === url) {
      index = key;
    }
  });
  return index;
}

function noop() {

}
export const LocalStorage = {
  get(attr, cb = noop) {
    chrome.storage.local.get(attr, cb);
  },
  set(obj, cb = noop) {
    chrome.storage.local.set(obj, cb);
  },
  remove(attr, target, cb = noop) {
    this.get(attr, (items = {[attr]: []}) => {
      const index = getIndex(items[attr], target);
      if (index !== -1) {
        items[attr].splice(index, 1);
        this.set(items, cb);
      }
    });
  },
  removeIndex(attr, index, cb = noop) {
    this.get(attr, (items = {[attr]: []}) => {
      if (index !== -1) {
        items[attr].splice(index, 1);
        this.set(items, cb);
      }
    });
  },
  removeDisable(target, cb = noop) {
    this.get(['on', 'off'], (items = {['off']: []}) => {
      const index = getIndex(items['off'], target);
      if (index !== -1) {
        const disableItem = items['off'].splice(index, 1)[0];
        if (disableItem.script) {
          items['on'].push(disableItem);
        }
        this.set(items, cb);
      }
    });
  },
  change(attr, index, targetAtrr, cb) {
    this.get(attr, (items = {[attr]: []}) => {
      const item = items[attr].splice(index, 1);
      this.set(items, cb);
      this.get(targetAtrr, (targetItems = {[targetAtrr]: []}) => {
        targetItems[targetAtrr] = targetItems[targetAtrr] || [];
        targetItems[targetAtrr].push(item[0]);
        this.set(targetItems, cb);
      });
    });
  },
  add(attr, target, cb) {
    this.get(attr, (items = {[attr]: []}) => {
      const item = target.url ? target : {
        url: target
      };
      items[attr] = items[attr] || [];
      if (!items[attr].length) {
        items[attr] = [item];
      } else {
        items[attr].push(item);
      }
      this.set(items, cb);
    });
  },
  refresh() {
    this.get(['on', 'off'], (items) => {
      items.on = items.on.filter(item => {
        if (item) {
          delete item.index;
        }
        return item;
      });
      items.off = items.off.filter(item => {
        if (item) {
          delete item.index;
        }
        return item;
      });
      console.log(JSON.stringify(items, null, '\t'));
      this.set(items);
    });
  }
};
