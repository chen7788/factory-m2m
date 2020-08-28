<template>
    <div>
      <div class="header-container">
        <el-button icon="el-icon-plus" style="margin-left: 15px" @click.prevent="handleAdd">新增</el-button>
        <el-button icon="el-icon-edit" style="margin-left: 15px">修改</el-button>
        <el-button icon="el-icon-delete" style="margin-left: 15px">删除</el-button>
        <el-button icon="el-icon-edit" style="float: right;margin-right: 20px">查询</el-button>
        <el-button icon="el-icon-delete" style="float: right">设置</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData" v-loading="tableLoading" :header-row-style="table-header" highlight-current-row border height="500px">
          <el-table-column align="center" type="selection" width="80"/>
          <el-table-column align="center" label="工艺代码" prop="routeNo" sortable/>
          <el-table-column align="center" label="工艺名称" prop="routeName" sortable/>
          <el-table-column align="center" label="投入工序" prop="inputProcessName" sortable/>
          <el-table-column align="center" label="产出工序" prop="outputProcessName" sortable/>
          <el-table-column align="center" label="有效" prop="enabled" sortable>
            <template #default="scope">
              <span>{{scope.row.enabled | enableFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="描述" prop="description" sortable/>
        </el-table>
      </div>
      <div style="height: 45px;margin-top: 10px">
        <div style="width: 120px;float: left;margin-left: 20px;margin-top: 12px;font-size: 15px">
          {{selectedValue | selectedValueFilter}}
        </div>
        <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="handlePagination" layout="prev, pager, next, sizes" background=false />
        <div align="center" style="float: right;margin-right: 5px;margin-top: 12px;font-size: 15px">
          {{total | totalFilter(limit)}}
        </div>
      </div>
    </div>
</template>

<script>
  import {getList} from "@/api/craft";
  import pagination from '@/components/Pagination'
  export default {
    components:{
      pagination
    },
    data(){
      return{
        tableData:[],
        tableLoading:true,
        total:0,
        page:1,
        limit:20,
        selectedValue:0
      }
    },
    filters:{
      selectedValueFilter(val){
        return '已选中 '+val.toString()+' 项'
      },
      totalFilter(val,value){
        return '总共 '+val.toString()+' 条记录    '+'共 '+value.toString()+' 页'
      },
      enableFilter(val){
        if (val){
          return '有'
        }
        return '无'
      }
    },
    created() {
      this.listData()
    },
    methods:{
      handleAdd(){

      },
      listData(){
        getList(this.page,this.limit).then(response => {
          this.tableLoading = false
          this.total = response.result.totalCount
          this.limit = response.result.pageSize
          this.page = response.result.currPage
          this.tableData = response.result.data
        })
      },
      handlePagination(){
        this.listData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-container{
    margin-top: 20px;
    height: 80px;
    .el-button{
      width: 60px;
      height: 30px;
      padding-left: 5px;
      padding-top: 7px;
      color: #20a0ff;
      background-color: transparent;
      border: none;
    }
  }
  .table-container{
    .table-header{
      background-color: #5a5e66;
    }
  }

</style>
