<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.name" placeholder="品牌名称">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">添加品牌</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleBatchDelete" type="primary">删除</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column min-width="150px" label="品牌名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="新增品牌" :visible.sync="showAdd">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改品牌" :visible.sync="showUpdate">
      <el-form :model="form" :rules="rules" ref="updateform" label-width="100px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('updateform')">取 消</el-button>
        <el-button type="primary" @click="update('updateform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {brandlist, addBrand, delBrand, queryById, updateBrand} from '@/api/brand';
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    directives: {
      waves
    },
    data() {
      return {
        delIds: [],
        showAdd: false,
        showUpdate: false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          name: ''
        },
        form: {name: '', id: ''},
        rules: {
          name: [
            {
              required: true,
              message: '请输入品牌名称',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        brandlist(this.listQuery).then((response, err) => {
          this.list = response.data.data;
          this.total = response.data.recordsTotal;
          this.listLoading = false
        })
      },
      handleSelectionChange(val){
        if (val && val.length > 0) {
          this.delIds = val.map(row => row.id);
        } else {
          this.delIds = [];
        }
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleBatchDelete(){
        if (this.delIds && this.delIds.length > 0) {
          this.$confirm('是否确认删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delBrand(this.delIds);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            message: '请至少选择一个品牌',
            type: 'warning'
          })
        }
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleCreate() {
        this.resetForm();
        this.showAdd = true;
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
      },
      cancel(formName) {
        this.showUpdate = false;
        this.showAdd = false;
        this.$refs[formName].resetFields();
      },
      handleDelete(id){
        this.$confirm('是否确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBrand(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delBrand(ids)
      {
        delBrand({"ids": ids.toString()}).then(() => {
          this.getList();
          this.delIds = [];
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addBrand(this.form).then((res) => {
              this.showAdd = false;
              this.getList();
              this.$message({
                type: 'success',
                message: '创建成功!'
              });
            })
          } else {
            return false;
          }
        });
      },
      update(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateBrand(this.form).then(() => {
              this.showUpdate = false;
              this.getList();
              this.$message({
                type: 'success',
                message: '更新成功!'
              });
            })
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.form = {
          name: '',
          id: ''
        };
      },
      handleUpdate(id){
        queryById(id).then(res => {
          this.form = {name: res.data.name, id: id}
          this.showUpdate = true;
          this.$refs["updateform"].resetFields();
        })
      }
    }
  }
</script>
