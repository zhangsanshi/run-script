<template>
    <div class="app-main">
        <section class="app-tool">
            <el-upload
                action="/"
                :before-upload="importData"
            >
                <el-button type="info" size="small" >导入<i class="el-icon-arrow-up"></i></el-button>
            </el-upload>

            <el-button type="info" size="small" @click="exportData()">导出<i class="el-icon-arrow-down"></i></el-button>
        </section>
        <search-box @filter="filterData"></search-box>
        <on-list title="使用中" :list="on"
            @changeStatus="changeStatus($event, 'on')"
            @remove="remove($event, 'on')"
            @save="save($event, 'on')"></on-list>
        <off-list title="禁用中"  :list="off"
            @remove="remove($event, 'off')"
            @changeStatus="changeStatus($event, 'off')"
            @save="save($event, 'off')"></off-list>
    </div>
</template>
<style>
    .app-tool {
        text-align: right;
        margin: 5px 0;
    }
    .app-tool .el-upload {
        float: right;
        width: auto;
        margin-left: 10px;
    }
</style>
<script>
  import { LocalStorage } from './storage.js';
  import searchBox from './component/search-box.vue';
  import onList from './component/onList.vue';
  import offList from './component/offList.vue';
  import Status from './config/status.js';
  let cloneData = {
    on: [],
    off: []
  };
  export default Vue.component('app-main', {
    data() {
      return {
        on: [],
        off: []
      };
    },
    components: {
      'on-list': onList,
      'off-list': offList
    },
    created() {
      this.getData();
    },
    methods: {
      getData(cb) {
         LocalStorage.get(['on', 'off'], (items) => {
           this.$data.on = items.on;
           this.$data.off = items.off;
           cloneData = items;
           if (cb) {
             cb(items);
           }
         });
      },
      exportData() {
        this.getData((items) => {
            const a = document.createElement('a');
            const blob = new Blob([JSON.stringify(items, null, '\t')]);
            a.setAttribute('download', 'run-script.json');
            a.setAttribute('href', URL.createObjectURL(blob));
            a.click();
        });
      },
      importData(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileContent = reader.result;
          let json = '';
          try {
            json = JSON.parse(fileContent);
            LocalStorage.get(['on', 'off'], (items) => {
              function mergeArray(source, target) {
                if (target && Array.isArray(target) && target.length) {
                  target.forEach((targetItem) => {
                    const existed = source.some((sourceItem) => {
                      return sourceItem.script === targetItem.script && sourceItem.url === targetItem.url;
                    });
                    if (!existed) {
                      source.push({
                        url: targetItem.url,
                        script: targetItem.script
                      });
                    }
                  });
                }
              }
              mergeArray(items.on, json.on);
              mergeArray(items.off, json.off);
              LocalStorage.set(items, () => {
                this.$message({
                  message: '导入成功',
                  type: 'success'
                });
                this.getData();
              });
            });
          } catch (e) {
            this.$message.error('文件解析失败，格式为 JSON 格式');
          }
        }
        reader.onerror = () => {
          this.$message.error('文件读取失败');
        };
        reader.readAsText(file);
        return false;
      },
      filterData(filter) {
        let data = [];
        this.$data.on = cloneData.on.filter((item) => {
          return item.url.indexOf(filter) !== -1;
        });
        this.$data.off = cloneData.off.filter((item) => {
          return item.url.indexOf(filter) !== -1;
        });
      },
      save(item, attr) {
        const index = item.index;
        delete item.index;
        const {url, script} = item;
        const copyItem = {
          url,
          script
        };
        if (index === 0 || index) {
          cloneData[attr][index] = copyItem;
          LocalStorage.set(cloneData, this.getData.bind(this));
        } else {
          LocalStorage.add(attr, copyItem, this.getData.bind(this));
        }
      },
      remove(index, attr) {
        LocalStorage.removeIndex(attr, index - 0, this.getData.bind(this));
      },
      changeStatus(index, attr){
        let targetAttr = '';
        if (attr === 'on') {
          targetAttr = 'off';
        } else {
          targetAttr = 'on';
        }
        LocalStorage.change(attr, index, targetAttr, this.getData.bind(this));
      }
    }
  });
</script>
