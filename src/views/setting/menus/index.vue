<template>
    <div class="menu-container">
      <div class="header-container">
        <el-button type="primary">新增</el-button>
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                style="width: 100%;margin-bottom: 15px;"
                row-key="id"
                border
                height="calc(100vh - 270px)"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column align="center" width="180"
                         prop="menuName"
                         label="菜单名称"
        >
        </el-table-column>
        <el-table-column align="center" prop="menuLink"
                         label="菜单地址">
        </el-table-column>
        <el-table-column align="center" prop="modulesMaps"
                         label="模块列表">
          <template #default="model">
            <el-tooltip v-for="(key,value) in model.row.modulesMaps" effect="dark" :content="key | contentFilter" placement="top">
              <span>{{value}}
                              <el-divider direction="vertical"/>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作">
          <template>
            <i class="el-icon-plus" @click="handleAdd" style="color: #20a0ff"/>
            <el-divider direction="vertical"/>
            <i class="el-icon-edit" @click="handleEdit" style="color: #20a0ff"/>
            <el-divider direction="vertical"/>
            <i class="el-icon-delete" @click="handleDelete" style="color: #20a0ff"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <pagination :total="total" :page.sync="page" :limit.sync="size" @pagination="handlePagination" layout="prev, pager, next, sizes" />
        <div align="center" style="float: right;margin-right: 5px;margin-top: 8px;font-size: 15px">
          {{total | totalFilter(size)}}
        </div>
      </div>

      <el-dialog title="新增" :visible="dialogVisible" width="60%">
<!--        <el-form v-model="form" label-position="left">-->
<!--          <el-form-item label="父级菜单" prop="partent">-->
<!--            <el-select v-model="selectValue" disabled placeholder="请选择">-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </el-dialog>
    </div>
</template>

<script>
  import {getMenuList} from "@/api/userManger";
  import pagination from '@/components/Pagination'

    export default {
      components:{
        pagination
      },
      filters:{
        totalFilter(val,value){
          return '总共 '+val.toString()+' 条记录    '+'共 '+value.toString()+' 页'
        },
        modelFilter(val){
          alert(val)
        },
        contentFilter(val){
          let str = ''
          if (Array.isArray(val)){
            val.forEach(item => {
              str = str + item
            })
          }
          return str
        }
      },
      data(){
        return {
          tableData:[],
          total:0,
          page:1,
          size:20,
          defaultProps: {
            children: 'Subdirectory',
            label: 'name'
          },
          dialogVisible:false
        }
      },
      created() {
        this.menuList()
      }
      ,
      methods:{
        handleAdd(){

        },
        handleEdit(){

        },
        handleDelete(){

        },
        menuList(){
          getMenuList(this.page,this.size).then(response => {
            this.tableData = response.result.data
            this.total = response.result.totalCount,
              this.page = response.result.pageSize,
              this.size = response.result.currPage
          })
        },
        handlePagination(){

        }
      }
    }
</script>

<style lang="scss" scoped>
  .menu-container{
    margin: 20px;
    height: 100%;
    background-color: white;
    position: relative;
  }
.header-container{
  border-bottom: #97a8be solid 0.5px;
}
  .header-container > .el-button{
    margin: 20px;
  }
  .pagination-container{
    height: 50px;
  }
  .menu-container{
    .el-table{
      ::v-deep {
        .el-icon-arrow-right:before{
          content: '+';
          display: inline-block;
          margin-right: 3px;
          width: 16px;
          height: 16px;
          line-height: 12px;
          font-size: 16px;
          border: 1px solid #999999;
        }
        .el-table__expand-icon--expanded{
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          .el-icon-arrow-right:before {
            content: '-';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 3px;
            line-height: 10px;
            font-size: 18px;
            border: 1px solid #999999;
          }
        }
      }
    }
  }

</style>
