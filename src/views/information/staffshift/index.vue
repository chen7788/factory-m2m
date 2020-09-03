<template>
    <div class="staffShift-container">
      <div class="header-container">

      </div>
      <div class="content-container">
        <el-col :span="3">
          <el-tree :data="treeData" v-loading="treeLoading" :props="defaultProps">

          </el-tree>
        </el-col>
        <el-col :span="21">
          <el-table :data="tableData" highlight-current-row v-loading="tableLoading" height="500px">
                        <el-table-column align="center"
                          type="selection"
                          width="80">
                        </el-table-column>
            <el-table-column  label="工号" fixed="left" prop="code" sortable align="center"/>
            <el-table-column  label="姓名" fixed="left" prop="staffName" sortable align="center"/>
            <el-table-column  :label="getMouth"   align="center">
              <el-table-column v-for="(item,index) in getdays" :label="item.num" :key="item.num"   align="center">
                <el-table-column :label="item.week" :key="item.num" align="center">
                  <el-table-column label="班别" prop="keyvalue" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.keyvalue | rosterFilter(index)}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>


            </el-table-column>
            <el-table-column  :label="getNextMouth"  align="center">
              <el-table-column v-for="item in getNextdays" :label="item.num" :key="item.num" prop="item.value" align="center">
                <el-table-column :label="item.week" :key="item.num" align="center">
                  <el-table-column label="班别" align="center"/>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>
          <div style="height: 45px;margin-top: 10px">
            <div style="width: 120px;float: left;margin-left: 20px;margin-top: 12px;font-size: 15px">
              {{selectedValue | selectedValueFilter}}
            </div>
            <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="handlePagination" layout="prev, pager, next, sizes" background=false />
            <div align="center" style="float: right;margin-right: 5px;margin-top: 12px;font-size: 15px">
              {{total | totalFilter(limit)}}
            </div>
          </div>
        </el-col>
      </div>
    </div>
</template>

<script>
  import { getTree, getList} from "@/api/roster";
  import pagination from '@/components/Pagination'
  import {dateFormat} from "@/utils";

  export default {
    components:{
      pagination
    },
        data(){
          return {
            treeData:[],
            treeLoading:true,
            tableData:[],
            tableLoading:true,
            defaultProps: {
              children: 'Subdirectory',
              label: 'departmentName'
            },
            total:0,
            page:0,
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
      rosterFilter(val,index){
        if (Array.isArray(val)){
          let obj = val[index]
          return obj.name
        }
        return ''
      }
    },
    created() {
        this.leftTree()
      this.getRightList()
    },
    computed:{
          getMouth(){
            let date = new Date()
            let year = date.getFullYear()
            let mouth = date.getMonth()
            mouth += 1
            return year +'-'+mouth
          },
      getNextMouth(){
        let date = new Date()
        let year = date.getFullYear().toString()
        let month = date.getMonth()
        month += 1
        if (month === 12){
          month = 1
          year +=1
        }else {
          month += 1
        }
        return year +'-'+month
      },
       getdays(){
         let date = new Date()
         let day = date.getDate()
         let day2 = this.getMonthCountDay(date.getFullYear(),date.getMonth())
         let arr = []
         for (let i = day; i <=day2; i++) {
           date.setDate(i)
           let ddd = this.getWeekDay(date.getDay())
           let obj = Object()
           obj['num'] = i.toString()
           obj['week'] = ddd
           obj['value'] = ddd
           arr.push(obj)
         }
         return arr
  },
      getNextdays(){
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()
        if (month === 12){
          month = 1
        }else {
          month += 1
        }
        date.setMonth(month)
        let mm = date.getDay()
        let arr = []
        for (let i = 1; i <=day; i++) {
          date.setDate(i)
          let ddd = this.getWeekDay(date.getDay())
          let obj = Object()
          obj['num'] = i.toString()
          obj['week'] = ddd
          arr.push(obj)
        }
        return arr
      }
    },
    methods:{
      getMonthCountDay(year, month) {
        let days = new Date(year, month + 1, 0).getDate()
        return days
      },
          leftTree(){
            getTree().then(response => {
              this.treeLoading = false
              let result = JSON.parse(response.result)
              this.treeData = result
            })
          },
      getRightList(page,limit){
            let date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        let time1 = dateFormat("YYYY-mm-dd HH:MM:SS", date)

        let year = date.getFullYear()
        let month = date.getMonth()

        if (month === 12){
          month = 1
          year +=1
        }else {
          month += 1
        }
        date.setMonth(month)
        date.setFullYear(year)
        date.setHours(23)
        date.setMinutes(59)
        date.setSeconds(59)
        let time2 = dateFormat("YYYY-mm-dd HH:MM:SS", date)
            getList(page,limit,time1,time2).then(response => {
              this.tableLoading = false
              this.total = response.result.totalCount
              this.limit = response.result.pageSize
              this.page = response.result.currPage
              this.tableData = response.result.data
            })
      },
      handlePagination(){
            this.getRightList(this.page,this.limit)
      },
      getWeekDay(day){
            let str = ''
          switch (day) {
          case 0:
            str = '日'
            break
          case 1:
            str = '一'
            break
            case 2:
              str = '二'
              break
            case 3:
              str = '三'
              break
            case 4:
              str = '四'
              break
            case 5:
              str = '五'
              break
            default:
              str = '六'
          }
          return str
      }
    }
  }
</script>

<style lang="scss" scoped>
.staffShift-container{
}
  .header-container{
    height: 60px;
  }
  .content-container{
    height: 100%;
    .el-col{

    }
    .el-tree{
      height: calc(100vh - 160px);
      width: 100%;
      padding-left: 20px;
      padding-top: 20px;
    }
    .el-table{
      margin-left: 10px;

    }
  }
</style>
