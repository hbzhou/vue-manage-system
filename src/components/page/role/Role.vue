<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx"></i>角色</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="roleName" placeholder="请输入角色名称" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="data" border class="table">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
           <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible =false">取消</el-button>
          <el-button type="primary" @click="saveAdd">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改" :visible="editVisible" width="30%">
       <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色名称">
             <el-input v-model="form.roleName"></el-input>
          </el-form-item>
         <el-form-item label="备注">
            <el-input v-model="form.remark"></el-input>
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
                roleName:'',
                form: {
                    roleId: '',
                    roleName: '',
                    remark:''

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
                this.$get('/system/role/page', request).then( response => {
                    this.tableData = response.data.list;
                    this.total = response.data.total;
                });

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
                    roleName: this.roleName,
                }
                this.$get('/system/role/page', request).then( response => {
                    this.tableData = response.data.list
                    this.total = response.data.total
                })

            },
            handleAdd: function() {
                this.addVisible = true;
                this.form = {
                    roleId: '',
                    roleName: '',
                    remark:''
                };
            },
            saveAdd: function() {
                this.addVisible = false;
                this.$post('/system/role/', this.form).then( resposne => {
                    this.$message.success('Add Success');
                    this.getTableData();
                });
            },
            handleEdit: function(index) {
                this.editVisible = true;
                const role = this.tableData[index];
                this.form.roleId = role.roleId;
                this.form.roleName = role.roleName;
                this.form.remark = role.remark;
            },
            editSave: function() {
                const role = {
                    roleId:this.form.roleId,
                    roleName:this.form.roleName,
                    remark:this.form.remark,
                    modifyTime: new Date()
                }
                this.$put('/system/role/',role).then( success=>{
                    this.$message.success("Modify success");
                    this.editVisible = false;
                    this.getTableData();
                })
            },
            handleDelete: function(index) {
                const item = this.tableData[index];
                const roleId = item.roleId;
                this.$delete('/system/role/'+roleId).then( success=>{
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
