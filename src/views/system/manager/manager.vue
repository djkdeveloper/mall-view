<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.name" placeholder="员工名称">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">添加员工</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleBatchDelete" type="primary">删除</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column min-width="150px" label="员工名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="角色名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.role.name}}</span>
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

    <el-dialog title="新增员工" :visible.sync="showAdd">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="员工名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入员工名称"></el-input>
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
        <el-form-item label="角色" prop="roleId">
          <el-select class="filter-item" v-model="form.roleId" placeholder="请选择">
            <el-option v-for="item in  roles" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改员工" :visible.sync="showUpdate">
      <el-form :model="form" :rules="rules" ref="updateform" label-width="100px">
        <el-form-item label="员工名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入员工名称"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select class="filter-item" v-model="form.roleId" placeholder="请选择">
            <el-option v-for="item in  roles" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
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

  import {managerlist, addManager, deleteManagers, queryById, updateManager, queryRoles} from '@/api/manager';
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    directives: {
      waves
    },
    data() {
      const passwordValidator = (rule, value, callback) => {
        if (!value || value != this.form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }
      return {
        roles: [],
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
          name: ''
        },
        form: {userName: '', password: '', passwordAgain: '', id: '', roleId: ''},
        rules: {
          userName: [
            {
              required: true,
              message: '请输入员工名称',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入员工密码',
              trigger: 'blur'
            }
          ], passwordAgain: [
            {
              required: true,
              trigger: 'blur',
              validator: passwordValidator
            }
          ], roleId: [
            {
              required: true,
              message: '请选择员工的角色',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      this.getList();
      this.queryRoles();
    },
    methods: {
      getList() {
        this.listLoading = true
        managerlist(this.listQuery).then(response => {
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
            this.deleteManagers(this.delIds);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            message: '请至少选择一个员工',
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
          this.deleteManagers(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteManagers(ids)
      {
        deleteManagers({"ids": ids.toString()}).then(() => {
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
            this.form.managerRole = {roleId: this.form.roleId};
            addManager(this.form).then((res) => {
              this.showAdd = false;
              this.getList();
              if (res.data == -1) {
                this.$message({
                  type: 'error',
                  message: '名称已经存在!'
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
            this.form.managerRole = {roleId: this.form.roleId};
            updateManager(this.form).then((res) => {
              this.showUpdate = false;
              this.getList();
              if (res.data == -1) {
                this.$message({
                  type: 'error',
                  message: '员工名称已经存在!'
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
        this.form = {
          name: '',
          id: ''
        };
      },
      handleUpdate(id){
        queryById(id).then(res => {
          this.form = {userName: res.data.userName, password: '', passwordAgain: '', id: id, roleId: res.data.role.id};
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
      },
      queryRoles(){
        queryRoles().then(res => {
          this.roles = res.data;
        })
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
