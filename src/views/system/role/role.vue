<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.name" placeholder="角色名称">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">添加角色</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleBatchDelete" type="primary">删除</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column min-width="150px" label="角色名称">
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

    <el-dialog title="新增角色" :visible.sync="showAdd">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="选择权限">
          <el-tree
            :data="ahthoritys"
            :props="defaultProps"
            ref="tree"
            show-checkbox
            node-key="id">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改角色" :visible.sync="showUpdate">
      <el-form :model="form" :rules="rules" ref="updateform" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="选择权限">
          <el-tree
            :data="ahthoritys"
            :props="defaultProps"
            ref="updatetree"
            show-checkbox
            node-key="id">
          </el-tree>
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

  import {rolelist, queryAuthoritys, queryById, updateRole, addRole, deleteRole} from '@/api/role';
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    directives: {
      waves
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        ahthoritys: [],
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
              message: '请输入角色名称',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      this.getList()
      this.queryAuthoritys();
    },
    methods: {
      getList() {
        this.listLoading = true
        rolelist(this.listQuery).then((response, err) => {
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
            this.delRoles(this.delIds);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            message: '请至少选择一个角色',
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
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([]);
        }
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
          this.delRoles(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delRoles(ids)
      {
        deleteRole({"ids": ids.toString()}).then((res) => {
          this.getList();
          this.delIds = [];
          if (res.data == -1) {
            this.$message({
              type: 'error',
              message: '角色已经被员工使用不能删除!'
            });
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        });
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (!this.$refs.tree.getCheckedKeys() || this.$refs.tree.getCheckedKeys().length == 0) {
              this.$message({
                type: 'error',
                message: '请选择权限!'
              });
              return false;
            }

            const selectedIds = this.selectedIds('tree');
            this.form.roleAuthorities = selectedIds.map(id => {
              return {
                authorityId: id
              };
            });

            addRole(this.form).then(() => {
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
            if (!this.$refs.updatetree.getCheckedKeys() || this.$refs.updatetree.getCheckedKeys().length == 0) {
              this.$message({
                type: 'error',
                message: '请选择权限!'
              });
              return false;
            }

            const selectedIds = this.selectedIds('updatetree');
            this.form.roleAuthorities = selectedIds.map(id => {
              return {
                authorityId: id
              };
            });
            updateRole(this.form).then(() => {
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
        this.showUpdate = true;
        queryById(id).then(res => {
          this.form = {name: res.data.name, id: id};
          const checkedKeys = new Array();
          res.data.authorities.forEach(auth => {
            checkedKeys.push(auth.id)
          })
          this.$refs.updatetree.setCheckedKeys(checkedKeys);
          this.$refs["updateform"].resetFields();
        })
      },
      queryAuthoritys(){
        queryAuthoritys().then(res => {
          this.ahthoritys.push(res.data);
        })
      },
      selectedIds(treename){
        var checkedKeys = this.$refs[treename].getCheckedKeys();
        var halfCheckedKeys = this.$refs[treename].getHalfCheckedKeys();
        halfCheckedKeys.filter(x => x != 0).forEach(value => checkedKeys.push(value));
        return checkedKeys;
      }
    }
  }
</script>
