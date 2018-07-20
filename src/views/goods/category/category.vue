<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">添加分类</el-button>
    </div>
    <tree-table :data="list" :columns="columns" border>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>


    <el-dialog title="新增分类" :visible.sync="showAdd">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>

        <el-form-item label="层级" prop="grade">
          <el-select class="filter-item" v-model="form.grade" @change="gradechange" placeholder="请选择">
            <el-option v-for="item in  gradeOptions" :key="item.name" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="父级" prop="parentId">
          <el-select class="filter-item" v-model="form.parentId" placeholder="请选择">
            <el-option v-for="item in  categorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入分类排序"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改分类" :visible.sync="showUpdate">
      <el-form :model="form" :rules="rules" ref="updateform" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入分类排序"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="update('updateform')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import {
    categorys,
    queryCategoryByGrade,
    addCategory,
    queryById,
    updateCategory,
    deleteCategory
  } from '@/api/category';
  import waves from '@/directive/waves' // 水波纹指令
  import treeTable from '@/components/TreeTable'


  export default {
    name: 'category',
    components: {treeTable},
    directives: {
      waves
    },
    data() {

      const numberValidator = (rule, value, callback) => {
        if (!value || !/^\d+$/.test(value)) {
          callback(new Error('请输入合法的数字'));
        } else {
          callback();
        }
      }

      return {
        columns: [
          {
            text: '分类名称',
            value: 'name',
          },
          {
            text: '排序',
            value: 'sort',
            width: 200
          },
          {
            text: '子节点数量',
            value: 'childNum',
            width: 200
          }
        ],
        gradeOptions: [{name: '一级', value: 1}, {name: '二级', value: 2}, {name: '三级', value: 3}],
        categorys: [],
        showAdd: false,
        showUpdate: false,
        list: [],
        form: {name: '', id: '', grade: '', parentId: '', sort: ''},
        rules: {
          name: [
            {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            }
          ],
          grade: [
            {
              required: true,
              message: '请选择分类的层级',
              trigger: 'blur'
            }
          ],
          parentId: [
            {
              required: true,
              message: '请选择分类的父级',
              trigger: 'blur'
            }
          ],
          sort: [
            {
              required: true,
              trigger: 'blur',
              validator: numberValidator
            }
          ]
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      gradechange(){
        if (this.form.grade == 1) {
          this.form.parentId = 0;
          this.categorys = [{name: '无', id: 0}];
        } else {
          queryCategoryByGrade(this.form.grade - 1).then(res => {
            this.categorys = res.data;
            // 设置默认选中第一个
            if (this.categorys && this.categorys.length > 0) {
              this.form.parentId = this.categorys[0].id;
            } else {
              this.form.parentId = '';
            }
          })
        }
      },
      getList() {
        categorys().then(response => {
          this.list = response.data;
        })
      },
      handleCreate() {
        this.resetForm();
        this.showAdd = true;
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
      },
      cancel() {
        this.showUpdate = false;
        this.showAdd = false;
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addCategory(this.form).then((res) => {
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
      resetForm() {
        this.form = {name: '', id: '', grade: '', parentId: '', sort: ''};
      },
      handleUpdate(id){
        queryById(id).then(res => {
          this.showUpdate = true;
          this.form = {
            name: res.data.name,
            id: id,
            grade: res.data.grade,
            parentId: res.data.parentId,
            sort: res.data.sort
          }
          this.$refs["updateform"].resetFields();
        })
      },
      update(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateCategory(this.form).then(() => {
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
      handleDelete(id){
        this.$confirm('是否确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCategory(id).then((res) => {
            this.getList();
            if (res.data == -1) {
              this.$message({
                type: 'error',
                message: '分类下面有子分类，请先删除子分类!'
              });
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>
