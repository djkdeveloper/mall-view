<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.name" placeholder="商品名称">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary">添加商品</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleBatchDelete" type="primary">删除</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column min-width="150px" label="商品名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="价格">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="库存">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="品牌">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.brand.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="三级分类">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.thirdCategory.name}}</span>
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

    <el-dialog title="新增商品" :visible.sync="showAdd">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入商品库存"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入商品价格"></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="brandId">
          <el-select filterable class="filter-item" v-model="form.brandId" placeholder="请选择">
            <el-option v-for="item in  brands" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类" prop="firstCateId">
          <el-select filterable class="filter-item" @change="changeFirstCate" v-model="form.firstCateId"
                     placeholder="请选择">
            <el-option v-for="item in  firstcategorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="secondCateId">
          <el-select filterable class="filter-item" @change="changeSecondCate" v-model="form.secondCateId"
                     placeholder="请选择">
            <el-option v-for="item in  secondcategorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类" prop="thirdCateId">
          <el-select filterable class="filter-item" v-model="form.thirdCateId" placeholder="请选择">
            <el-option v-for="item in  thirdcategorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload ref="addupload"
                     action="http://localhost:8081/mall-goods/upload"
                     :on-success="uploadlode"
                     :before-upload="beforeupload"
                     :on-remove="removePic"
                     list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改商品" :visible.sync="showUpdate">
      <el-form :model="form" :rules="rules" ref="updateform" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入商品库存"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入商品价格"></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="brandId">
          <el-select filterable class="filter-item" v-model="form.brandId" placeholder="请选择">
            <el-option v-for="item in  brands" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类" prop="firstCateId">
          <el-select filterable class="filter-item" @change="changeFirstCate" v-model="form.firstCateId"
                     placeholder="请选择">
            <el-option v-for="item in  firstcategorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="secondCateId">
          <el-select filterable class="filter-item" @change="changeSecondCate" v-model="form.secondCateId"
                     placeholder="请选择">
            <el-option v-for="item in  secondcategorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类" prop="thirdCateId">
          <el-select filterable class="filter-item" v-model="form.thirdCateId" placeholder="请选择">
            <el-option v-for="item in  thirdcategorys" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload ref="uploadupload"
                     action="http://localhost:8081/mall-goods/upload"
                     :on-success="uploadlode"
                     :before-upload="beforeupload"
                     :on-remove="removePic"
                     :file-list="pics"
                     list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
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

  import {
    spulist,
    queryAllBrands,
    queryAllFirstCategorys,
    addSpu,
    delSpus,
    queryCateroryChildren,
    queryById,
    updateSpu
  } from '@/api/spu';
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    directives: {
      waves
    },
    data() {

      const stockValidator = (rule, value, callback) => {
        if (!value || !/^\d+$/.test(value)) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      }

      const priceValidator = (rule, value, callback) => {
        if (!value || !/^([0-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,2})$/.test(value)) {
          callback(new Error('请输入正确的价格'));
        } else {
          callback();
        }
      }

      return {
        pics: [],
        brands: [],
        firstcategorys: [],
        secondcategorys: [],
        thirdcategorys: [],
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
        form: {
          name: '',
          id: '',
          price: '',
          stock: '',
          brandId: '',
          thirdCateId: '',
          firstCateId: '',
          secondCateId: '',
          pic: ''
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            }
          ],
          stock: [
            {
              required: true,
              trigger: 'blur',
              validator: stockValidator
            }
          ],
          price: [
            {
              required: true,
              trigger: 'blur',
              validator: priceValidator
            }
          ],
          brandId: [
            {
              required: true,
              message: '请选择品牌',
              trigger: 'blur'
            }
          ],
          firstCateId: [
            {
              required: true,
              message: '请选择一级分类',
              trigger: 'blur'
            }
          ],
          secondCateId: [
            {
              required: true,
              message: '请选择二级分类',
              trigger: 'blur'
            }
          ],
          thirdCateId: [
            {
              required: true,
              message: '请选择三级分类',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      this.getList();
      this.getAllBrands();
      this.queryAllFirstCategorys();
    },
    methods: {
      getAllBrands(){
        queryAllBrands().then(response => {
          this.brands = response.data;
        })
      },
      queryAllFirstCategorys(){
        queryAllFirstCategorys().then(response => {
          this.firstcategorys = response.data;
        })
      },
      getList() {
        this.listLoading = true
        spulist(this.listQuery).then(response => {
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
            this.delSpus(this.delIds);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            message: '请至少选择一个商品',
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
        if (this.$refs["addupload"]) {
          this.$refs["addupload"].clearFiles();
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
          this.delSpus(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delSpus(ids)
      {
        delSpus({"ids": ids.toString()}).then(() => {
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

            // 校验图片是否上传
            if (!this.form.pic) {
              this.$message({
                type: 'error',
                message: '请上传一张图片!'
              });
              return false;
            }
            addSpu(this.form).then(() => {
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
            // 校验图片是否上传
            if (!this.form.pic) {
              this.$message({
                type: 'error',
                message: '请上传一张图片!'
              });
              return false;
            }
            updateSpu(this.form).then(() => {
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
          id: '',
          price: '',
          stock: '',
          brandId: '',
          thirdCateId: '',
          firstCateId: '',
          secondCateId: '',
          pic: ''
        };
      },
      handleUpdate(id){
        queryById(id).then(res => {
          this.form = {
            name: res.data.name,
            id: id,
            price: res.data.price,
            stock: res.data.stock,
            brandId: res.data.brandId,
            thirdCateId: res.data.thirdCateId,
            firstCateId: res.data.firstCateId,
            secondCateId: res.data.secondCateId,
            pic: res.data.pic
          }

          this.pics = [{name: "", url: res.data.pic}];

          queryCateroryChildren(this.form.firstCateId).then(response => {
            this.secondcategorys = response.data;
          })

          queryCateroryChildren(this.form.secondCateId).then(response => {
            this.thirdcategorys = response.data;
          })

          this.showUpdate = true;
          this.$refs["updateform"].resetFields();
        })
      },
      changeFirstCate(){
        this.form.secondCateId = '';
        this.form.thirdCateId = '';
        queryCateroryChildren(this.form.firstCateId).then(response => {
          this.secondcategorys = response.data;
        })
      },
      changeSecondCate(){
        this.form.thirdCateId = '';
        queryCateroryChildren(this.form.secondCateId).then(response => {
          this.thirdcategorys = response.data;
        })
      },
      uploadlode(response){
        this.form.pic = response;
      },
      beforeupload()
      {
        if (this.form.pic) {
          this.$message({
            type: 'warn',
            message: '图片只能上传一张!'
          });
          return false;
        }
      },
      removePic(){
        this.form.pic = '';
      }
    }
  }
</script>
