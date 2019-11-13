<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx"></i>菜单</el-breadcrumb-item>
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="menuName" placeholder="请输入菜单名称" class="handle-input mr10"></el-input>
        <el-select v-model="type">
           <el-option value="0" label="菜单"></el-option>
           <el-option value="1" label="按钮"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="data" border class="table">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="menuName" label="菜单名称"></el-table-column>
        <el-table-column prop="path" label="路由URL"></el-table-column>
        <el-table-column prop="component" label="组件名称"></el-table-column>
        <el-table-column prop="perms" label="权限"></el-table-column>
        <el-table-column prop="icon" label="图标"></el-table-column>
        <el-table-column prop="type" label="类型" width="50px">
          <template slot-scope="scope">
               <div v-if="scope.row.type==0">菜单</div>
               <div v-else>按钮</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" :formatter="dateFormat"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="page" :page-sizes="[5,10,20]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增" :visible="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.menuName"></el-input>
        </el-form-item>
        <el-form-item label="路由URL">
           <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="组件名称">
           <el-input v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item label="权限">
           <el-input v-model="form.perms"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option value="0" label="菜单"></el-option>
            <el-option value="1" label="按钮"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible =false">取消</el-button>
          <el-button type="primary" @click="saveAdd">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改" :visible="editVisible" width="30%">
       <el-form ref="form" :model="form" label-width="80px">
         <el-form-item label="菜单名称">
           <el-input v-model="form.menuName"></el-input>
         </el-form-item>
         <el-form-item label="路由URL">
           <el-input v-model="form.path"></el-input>
         </el-form-item>
         <el-form-item label="组件名称">
           <el-input v-model="form.component"></el-input>
         </el-form-item>
         <el-form-item label="权限">
           <el-input v-model="form.perms"></el-input>
         </el-form-item>
         <el-form-item label="图标">
           <el-input v-model="form.icon"></el-input>
         </el-form-item>
         <el-form-item label="类型">
           <el-select v-model="form.type">
             <el-option value="0" label="菜单"></el-option>
             <el-option value="1" label="按钮"></el-option>
           </el-select>
         </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="editVisible =false">取消</el-button>
         <el-button type="primary" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: 'Dept',
        data() {
            return {
                tableData: [],
                page: 1,
                pageSize: 5,
                total: 0,
                menuName:'',
                type:'',
                form: {
                    menuId: '',
                    menuName: '',
                    path:'',
                    component:'',
                    perms:'',
                    type:''

                },
                addVisible: false,
                editVisible: false
            };

        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                });
            }
        },
        created() {
            this.getTableData();
        },
        methods: {
            dateFormat: function(row, column) {
                const date = row[column.property];
                if (date === undefined) return '';
                return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            getTableData: function() {
                const request = {
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.$get('/system/menu/page', request).then( (response) =>{
                    this.tableData = response.data.list;
                    this.total = response.data.total;
                })

            },
            handleCurrentChange: function(val) {
                this.page = val;
                this.getTableData();
            },
            handleSizeChange: function(val) {
                this.pageSize = val;
                this.getTableData();
            },
            search: function(){
                const request  = {
                    page: this.page,
                    pageSize: this.pageSize,
                    menuName: this.menuName,
                    type: this.type===''? null:this.type
                }
                this.$get('/system/menu/page', request).then( (response) =>{
                    this.tableData = response.data.list;
                    this.total = response.data.total;
                })


            },
            handleAdd: function() {
                this.addVisible = true;
                this.form={
                        menuId: '',
                        menuName: '',
                        component:'',
                        path:'',
                        perms:'',
                        type:''
                }
            },
            saveAdd: function() {
                this.addVisible = false;
                this.$post('/system/menu/', this.form).then(response => {
                    this.$message.success('Add Success');
                    this.getTableData();
                });
            },
            handleEdit: function(index) {
                this.editVisible = true;
                const menu = this.tableData[index];
                this.form={
                    menuId: menu.menuId,
                    menuName: menu.menuName,
                    path:menu.path,
                    component: menu.component,
                    perms:menu.perms,
                    type:menu.type
                }
            },
            editSave: function() {
                const menu = {
                    menuId:this.form.menuId,
                    menuName:this.form.menuName,
                    path:this.form.path,
                    component: this.form.component,
                    perms:this.form.perms,
                    type: this.form.type,
                    modifyTime: new Date()
                }
                this.$put('/system/menu/',menu).then( success=>{
                    this.$message.success("Modify success");
                    this.editVisible = false;
                    this.getTableData();
                })
            },
            handleDelete: function(index) {
                const item = this.tableData[index];
                const menuId = item.menuId;
                this.$delete('/system/menu/'+menuId).then( success=>{
                    this.$message.success("delete success");
                    this.getTableData();
                })
            }

        }
    };
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }
  .handle-input {
    width: 150px;
    display: inline-block;
  }
  .mr10 {
    margin-right: 10px;
  }

</style>
