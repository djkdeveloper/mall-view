<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.name" placeholder="会员名称">
      </el-input>
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.mobile" placeholder="手机号码">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">添加会员</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleBatchDelete" type="primary">删除</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column min-width="150px" label="会员名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="手机号码">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.mobile}}</span>
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

    <el-dialog title="新增会员" :visible.sync="showAdd">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="会员姓名" prop="username">
          <el-input v-model="form.username" placeholder="请输会员姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input :type="passwordType1" v-model="form.password" placeholder="请输会员密码"></el-input>
          <span class="show-pwd" @click="showPwd1">
          <svg-icon icon-class="eye"/>
        </span>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="passwordAgain">
          <el-input :type="passwordType2" v-model="form.passwordAgain" placeholder="请输会员密码"></el-input>
          <span class="show-pwd" @click="showPwd2">
          <svg-icon icon-class="eye"/>
        </span>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输会员手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改会员" :visible.sync="showUpdate">
      <el-form :model="form" :rules="rules" ref="updateform" label-width="100px">
        <el-form-item label="会员姓名" prop="username">
          <el-input v-model="form.username" placeholder="请输会员姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输会员手机号码"></el-input>
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

  import {customerlist, addCustomer, deleteCustomers, queryById, updateCustomer} from '@/api/customer';
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    directives: {
      waves
    },
    data() {
      const mobileValidator = (rule, value, callback) => {
        if (!value || !/^1[3|4|5|8][0-9]\d{4,8}$/.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      }

      const passwordValidator = (rule, value, callback) => {
        if (!value || value != this.form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }
      return {
        passwordType1: 'password',
        passwordType2: 'password',
        delIds: [],
        showAdd: false,
        showUpdate: false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          name: '',
          mobile: ''
        },
        form: {username: '', id: '', password: '', mobile: '', passwordAgain: ''},
        rules: {
          username: [
            {
              required: true,
              message: '请输入会员姓名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入会员密码',
              trigger: 'blur'
            }
          ], mobile: [
            {
              required: true,
              trigger: 'blur',
              validator: mobileValidator
            }
          ], passwordAgain: [
            {
              required: true,
              trigger: 'blur',
              validator: passwordValidator
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
        customerlist(this.listQuery).then(response => {
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
            this.delCustomer(this.delIds);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            message: '请至少选择一个会员',
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
          this.delCustomer(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delCustomer(ids)
      {
        deleteCustomers({"ids": ids.toString()}).then(() => {
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
            addCustomer(this.form).then((res) => {
              this.showAdd = false;
              this.getList();
              if (res.data == -1) {
                this.$message({
                  type: 'error',
                  message: '用户名已经存在!'
                });
              } else if (res.data == -2) {
                this.$message({
                  type: 'error',
                  message: '手机号码已经存在!'
                });
              } else {
                this.$message({
                  type: 'success',
                  message: '创建成功!'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      update(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateCustomer(this.form).then((res) => {
              this.showUpdate = false;
              this.getList();
              if (res.data == -1) {
                this.$message({
                  type: 'error',
                  message: '用户名已经存在!'
                });
              } else if (res.data == -2) {
                this.$message({
                  type: 'error',
                  message: '手机号码已经存在!'
                });
              } else {
                this.$message({
                  type: 'success',
                  message: '更新成功!'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.passwordType1 = 'password';
        this.passwordType2 = 'password';
        this.form = {username: '', id: '', password: '', mobile: '', passwordAgain: ''};
      },
      handleUpdate(id){
        queryById(id).then(res => {
          this.form = {username: res.data.username, id: res.data.id, mobile: res.data.mobile},
            this.showUpdate = true;
          this.$refs["updateform"].resetFields();
        })
      },
      showPwd1() {
        if (this.passwordType1 === 'password') {
          this.passwordType1 = ''
        } else {
          this.passwordType1 = 'password'
        }
      },
      showPwd2() {
        if (this.passwordType2 === 'password') {
          this.passwordType2 = ''
        } else {
          this.passwordType2 = 'password'
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

</style>

