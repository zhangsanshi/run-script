<template>
  <div class="list">
    <h3>
      {{title}}
      <el-button type="primary" size="small"
         @click="openEdit()">添加<i class="el-icon-plus"></i></el-button>
    </h3>
    <el-table
        :data="list"
    >
        <el-table-column
            prop="url"
            label="链接"
        ></el-table-column>
        <el-table-column
            prop="script"
            label="脚本"
        ></el-table-column>
        <el-table-column
            label="操作"
        >
            <template scope="scope">
                <el-button type="text" size="small" @click="openEdit(scope.$index)">编辑</el-button>
                <el-button type="text" size="small" @click="remove(scope.$index)">删除</el-button>
                <el-button type="text" size="small" @click="changeStatus(scope.$index)">{{listStatusText}}</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="" v-model="itemEditDialog">
      <el-form :model="form">
        <el-form-item label="链接(正则表达式)" >
          <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="脚本" >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.script">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeItemEditDialog()">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Status from '../config/status.js';
  export default Vue.component('list', {
    data() {
      return {
        form: {},
        itemEditDialog: false
      };
    },
    props: ['list', 'title'],
    methods: {
      openEdit(index) {
        if (index !== undefined) {
          this.form = Object.assign({
            index,
          }, this.list[index]);
        } else {
          this.form = {};
        }
        this.itemEditDialog = true;
      },
      changeStatus(index) {
        this.$emit('changeStatus', index);
      },
      closeItemEditDialog(index) {
        this.form = {};
        this.itemEditDialog = false;
      },
      save() {
        this.$emit('save', Object.assign(this.form));
        this.itemEditDialog = false;
      },
      remove(index) {
        this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('remove', index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    }
  });
</script>
