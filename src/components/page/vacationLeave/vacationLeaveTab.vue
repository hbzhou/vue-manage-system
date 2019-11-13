<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>电子流管理</el-breadcrumb-item>
        <el-breadcrumb-item>请假电子流</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="selectedTabName">
        <el-tab-pane label="我的流程" name="first">
          <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type='success' icon="el-icon-circle-plus-outline" size='mini' @click="handleAdd">请假</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="applyType" label="类型"></el-table-column>
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="endTime" label="结束时间"></el-table-column>
            <el-table-column prop="reason" label="请假原因"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size='mini' @click="handleEdit(scope.$index, scope.row)">查看完整流程</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="流程审批" name="second">
            <el-table :data="taskTableData" border class="table"  @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="vacationLeave.applicant" label="申请人"></el-table-column>
              <el-table-column prop="vacationLeave.applyType" label="类型"  ></el-table-column>
              <el-table-column prop="vacationLeave.startTime" label="开始时间"> </el-table-column>
              <el-table-column prop="vacationLeave.endTime" label="结束时间" ></el-table-column>
              <el-table-column prop="days" label="天数"></el-table-column>
              <el-table-column prop="vacationLeave.reason" label="请假原因"></el-table-column>
              <el-table-column prop="vacationLeave.applyTime" label="申请时间"></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size='mini' @click="handleFlow(scope.$index, scope.row)">审批流程</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="审批流程" :visible="handleVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="申请人">
          <el-input v-model="form.applicant" :readonly="true"> </el-input>
        </el-form-item>
        <el-form-item label="请假类型">
          <el-input v-model="form.applyType" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="form.startTime" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="form.endTime" :readonly="true" ></el-input>
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input type="textarea" :rows="2"  v-model="form.reason" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-input  v-model="form.applyTime" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="审批">
          <el-select v-model="form.approved">
            <el-option label="同意" value="1"></el-option>
            <el-option label="拒绝" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见" >
          <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible =false">取消</el-button>
          <el-button type="primary" @click="saveHandle">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="发起请假电子流" :visible="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="请假类型">
          <el-select v-model="form.applyType">
            <el-option label="年假" value="annual_leave"></el-option>
            <el-option label="事假" value="personal_leave"></el-option>
            <el-option label="病假" value="sick_leave"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" type="datetime"  placeholder="选择开始时间" default-time="09:00:00"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" default-time="18:00:00"></el-date-picker>
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input type="textarea" :rows="2" placeholder="请输入请假原因" v-model="form.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible =false">取消</el-button>
          <el-button type="primary" @click="saveAdd">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
    export default {
        name: 'basetable',
        data() {
            return {
                selectedTabName: 'first',
                tableData: [],
                taskTableData:[],
                multipleSelection: [],
                select_word: '',
                addVisible: false,
                handleVisible: false,
                form: {
                    applyType: '',
                    startTime: '',
                    endTime: '',
                    reason: ''
                }

            };
        },
        created() {
            this.getData();
            this.getTaskData();
        },
        methods: {
            dateFormat: function(row, column) {
                const date = row[column.property];
                if (date === undefined) {
                    return ' ';
                }
                return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            getData() {
                this.$get('/vacation-leave/', null).then((response => {
                    this.tableData = response.data;
                }));
            },
            getTaskData() {
                this.$get("/vacation-leave/tasks", null).then((response => {
                    this.taskTableData = response.data;
                }))
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {

            },
            handleAdd() {
                this.addVisible = true;
                this.form = {
                    applyType: '',
                    startTime: '',
                    endTime: '',
                    reason: ''
                };
            },
            saveAdd() {
                this.addVisible = false;
                this.$post('/vacation-leave/', this.form).then((response => {
                    this.$message.success('请求成功');
                    this.getData();
                    this.getTaskData();
                }));
            },
            handleFlow(index, row){
                this.handleVisible = true;
                const item  = row;
                const vacationLeave = item.vacationLeave;
                this.form = {
                    taskId: item.taskId,
                    applicant: vacationLeave.applicant,
                    applyType: vacationLeave.applyType,
                    startTime: vacationLeave.startTime,
                    endTime: vacationLeave.endTime,
                    reason: vacationLeave.reason,
                    applyTime: vacationLeave.applyTime,
                }
            },
            saveHandle (){
                this.handleVisible = false;
                const request = {
                    result: this.form.approved,
                    remarks: this.form.remark
                }
                this.$put("/vacation-leave/handleTask/"+ this.form.taskId , request).then((response => {
                    this.$message.success("请求成功");
                    this.getTaskData()
                    this.getData();
                }))
            }

        }
    };

</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 150px;
    display: inline-block;
  }

  .del-dialog-cnt {
    font-size: 16px;
    text-align: center
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }
</style>
