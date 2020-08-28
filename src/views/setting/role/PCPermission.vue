<template>
    <div>
      <el-col :span="7">
        <div class="left-container">
          <div class="header-container">
            <div class="header-title-container">角色列表</div>
            <div class="header-item-container">
              <el-tooltip effect="dark" content="刷新"placement="bottom">
                <i class="el-icon-refresh header-item" @click="handleRefreshRole"/>
              </el-tooltip>
            </div>
          </div>
          <div class="tree-container">
            <el-tree :data="treeData" v-loading="treeLoading" element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.001)" element-loading-text="正在查询中。。。" default-expand-all :props="defaultProps" @node-click="handleNodeClick" />
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="right-container">
          <el-table ref="multipleTable"
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
                    v-loading="tableLoading" element-loading-text="正在查询中。。。"
            height="calc(100vh - 270px)"
                    @select-all="handleSelectionAll"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                                :expand-row-keys="expandKeys"
<!--                        <el-table-column align="center"-->
<!--                          type="selection"-->
<!--                          width="80">even-->
<!--        </el-table-column>-->
        <!--            @select="((selection,row)=>{handleSelect(selection,row)})"-->
        <!--            @select="((selection,row)=>{handleSelect(selection,row,$event)})"-->
        <el-table-column type="selection" width="100" align="center">
      <template #default="scope">
    <el-checkbox v-model="scope.row.isCheck" @change="handleCheckboxChange($event,scope.row)"></el-checkbox>
    </template>
    </el-table-column>
    <el-table-column  width="180" header-align="center"
  prop="menuName"
  label="菜单名称"
    >
    </el-table-column>
    <el-table-column header-align="center"
  label="模块">
    <template #default="scope">
    <el-checkbox-group v-model="scope.row.checked">
    <el-checkbox  v-for="(item,index) in Object.keys(scope.row.modulesMaps)" :label="item" :key="index" @change="handleCheckbox($event,scope.row,scope.$index)"></el-checkbox>
    </el-checkbox-group>
    </template>
    </el-table-column>
    </el-table>
    <div style="height: 45px;margin-top: 5px">
    <pagination :total="total" :page.sync="page" :limit.sync="size" @pagination="handlePagination" layout="prev, pager, next, sizes" background=false />
    <div align="center" style="float: right;margin-right: 5px;margin-top: 12px;font-size: 15px">
    {{total | totalFilter(size)}}
  </div>
  </div>
  <el-button type="primary" style="margin-left: 80px;margin-bottom: 20px" @click.prevent="handleClick">确定</el-button>
    </div>
    </el-col>
    </div>
    </template>

    <script>
  import { getTree, getMenuList, getMenuPermission, setMenuPermissions} from "@/api/userManger";
  import pagination from '@/components/Pagination'

  export default {
    name: "PCPermission",
    components:{
      pagination
    },
    filters:{
      selectedValueFilter(val){
        return '已选中 '+val.toString()+' 项'
      },
      totalFilter(val,value){
        return '总共 '+val.toString()+' 条记录    '+'共 '+value.toString()+' 页'
      }
    },
    data(){
      return{
        treeData: null,
        defaultProps: {
          children: 'Subdirectory',
          label: 'name'
        },
        treeLoading: true,
        page:1,
        size:10,
        total:0,
        tableData:[],
        expandKeys:[],
        checkData:{
          name:'',
          isChecked:false
        },
        tableAllSelect:false,
        tableLoading:false
      }
    },
    created() {
      this.getTreeData()
    },
    computed:{

    },
    methods:{
      handleSelect (event,row,) {
          alert(event)
          console.log(row)
        },
        setSelectRow(selection,row){
          if(row.children.length > 0){
            row.children.forEach(item => {
              this.$refs.table.toggleRowSelection(item)
              item.checked =  Object.keys(item.modulesMaps)
              // this.$refs.table.setCurrentRow(item)
            })
            // console.log(selection,row.children)
          }else{

            if (selection.length > 0){
              console.log(selection,row)
              row.checkList =  Object.keys(row.modulesMaps)
            }else if (selection.length === 0) {
              console.log(selection,row)
              row.checkList = [];
            }

          }
        },
          handleClick(){
            let arr = []
            this.queryParams(this.tableData,arr)
            setMenuPermissions(arr).then(response => {
              this.$message({
                message:'操作成功',
                type:'success'
              })
            })
          },
        queryParams(data,arr){
          for (let item of data) {
            if (item.isCheck){
              let obj = new Object()
              let partent = new Object()
              if (item.checked && Array.isArray(item.checked)){
                item.checked.forEach(key => {
                obj[key] =  item.modulesMaps[key]
                })
              }
            partent['menuId'] = item.id
              partent['modulesMaps'] = obj
              arr.push(partent)
            }
            if (item.hasOwnProperty("children") && item.children.length>0){
              this.queryParams(item.children,arr)
            }
          }
        },
        handleCheckboxChange(isSelected,data){
          let model = [].concat(this.tableData)
          this.findWithId(data,isSelected)
          this.findWithPartenId(model,isSelected,data)
          this.setAllSelected(model,isSelected)
          this.tableData = model
        },
        setAllSelected(model,isSelected){
          let isAll = false
            isAll =  model.some(item => {
              return item.isCheck === true
            })
          if (isAll){
            this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(0,true)
            })
          }else {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(0,false)
            })
          }
        },
        //设置父ji
        findWithPartenId(data,isSelected,rowData){
          if (rowData.parentId === null){
            return
          }
          if (isSelected){
            let item = this.arrayWithPartenId(data,rowData.parentId,false)
            item.isCheck = isSelected
            if (item.parentId !== null){
              this.findWithPartenId(data,isSelected,item)
            }
          }else {
            let arr1 = this.arrayWithId(data,rowData.id,true)
          let isAll =  arr1.some(item =>{
              return item.isCheck === true
            })
            if (!isAll){
              let item = this.arrayWithPartenId(data,rowData.parentId,false)
              item.isCheck = isSelected
              if (item.parentId !== null){
                this.findWithPartenId(data,isSelected,item)
              }
            }
          }
        },
        //获取当前id同级数组
        arrayWithId(data,id,isArr){
          for (let item of data){
            if (item.id === id){
              if (isArr){
                return data
              }
              return item
            }else {
              if (item.hasOwnProperty("children") && item.children.length > 0) {
              let model = this.arrayWithId(item.children,id,isArr)
                if (typeof(model) !== "undefined" && model !== null){
                  return model
                }
              }
            }
          }
        },
        //获取当前id父ji数组
        arrayWithPartenId(data,partentId,isArr){
          for (let item of data){
            if (item.id === partentId){
              if (isArr){
                return  data
              }
              return item
            }else {
              if (item.hasOwnProperty("children") && item.children.length > 0) {
                let model = this.arrayWithPartenId(item.children,partentId,isArr)
                if (typeof(model) !== "undefined" && model !== null){
                  return model
                }

              }
            }
          }
        },

        //设置row是否选中
        findWithId(data,isSelected){
          if (Array.isArray(data)){
            data.forEach(item => {
              this.changeSubCheckStatus(item,isSelected)
            })
          }else {
            this.changeSubCheckStatus(data,isSelected)
          }

        },
        changeSubCheckStatus(data,isSelected){
          data.isCheck = isSelected
          if (data.hasOwnProperty("modulesMaps") && Object.keys(data.modulesMaps).length > 0) {
            if (isSelected) {
              data.checked = Object.keys(data.modulesMaps)
            } else {
              if (data.checked.length > 0) {
                data.checked = []
              }
            }
          }
          if (data.hasOwnProperty("children") && data.children.length > 0) {
            this.findWithId(data.children,isSelected)
          }
        },
        handleSelectionAll(selection){
          this.tableAllSelect = ! this.tableAllSelect
          if (this.tableAllSelect){
            this.findWithId(selection,this.tableAllSelect)
          }else {
            let model = [].concat(this.tableData)
            this.findWithId(model,this.tableAllSelect)
            this.tableData = model
          }

        },
        handleCheckbox(isSelected,data){

          let model = [].concat(this.tableData)
          if (isSelected){
            data.isCheck = isSelected
            if (data.checked.length === 1){
              this.findWithPartenId(model,isSelected,data)
              this.setAllSelected(model,isSelected)
              this.tableData = model
            }
          }else {
            if (data.checked.length === 0){
              data.isCheck = isSelected
              this.findWithPartenId(model,isSelected,data)
              this.setAllSelected(model,isSelected)
              this.tableData = model
            }
          }
        },
        handleRefreshRole(){
          this.getTreeData()
        },
        handlePagination(){
          this.getRoleUserList(this.treeClickData.id,this.limit,this.page)
        },
        //组织架构选择树形控件各分支
        handleNodeClick(data){
          this.tableLoading = true
          this.menuPermission();
        },
        getTreeData(){
          getTree().then(response => {
            this.treeLoading = false
            let data = JSON.parse(response.result)
            this.treeData = data
          })
        },
        menuPermission(){
          getMenuPermission('ff8080817292d6a70173e1493325002f','PC').then(response => {
            this.menuList(response.result)
         })
        },
        menuList(data){
          getMenuList(this.page,this.size).then(response => {
            this.tableLoading = false
            let model = response.result.data
                this.findNode(model,data)
            this.tableData = model
            this.setAllSelected(model,true)

          })
        },
        findNode(data,permissionData){
          for (let item of data) {
            item['isCheck'] = false
            if (item.modulesMaps && JSON.stringify(item.modulesMaps) !== "{}"){
              item['checked'] = []
            }
            let indexs = Object.keys(permissionData)
            if (indexs.length>0){
              indexs.some(value => {
                if (item.id === value){
                  item['isCheck'] = true
                  this.expandKeys.push(item.id)
                  let ddd = permissionData[value]
                  if (ddd instanceof Object){
                    item['checked'] = Object.keys(ddd)
                  }
                }
              })
            }
            if (item.hasOwnProperty("children") && item.children.length>0){
              let model = this.findNode(item.children,permissionData)
              if (typeof(model) !== "undefined" && model !== null){
                return model
              }
            }
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
  .header-container{
    .el-button{
      width: 25px;
      height: 25px;
      padding-left: 6px;
      padding-top: 6px;
      margin-top: 12.5px;
      border: 0;
    }
  }
  .el-table{
    .el-checkbox{
      margin-left: 5px;
    }
  }
  ::v-deep {
    .el-table__expand-icon{
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
</style>
<style scoped>
  .left-container{
    width: 100%;
    height: 100%;
    min-width: 200px;
    background-color: white;
    float: left;
  }
  .tree-container{
    margin: 20px;
    padding-left: 20px;
    padding-top: 20px;
    position: relative;
    border: 0.5px #b4bccc solid;
    height: calc(100vh - 240px);
  }
  .header-container{
    height: 55px;
    border-bottom: 0.5px #b4bccc solid;
  }
  .header-title-container{
    float: left;
    font-size: 17px;
    margin-top: 17px;
    margin-left: 20px;
    font-weight: bold;
  }
  .header-item-container{
    float: right;
    margin-right: 10px;
    margin-top: 15px;
    height: 26px;
    flex: 15;
  }
  .header-item{
    height: 26px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .right-container{
    width: calc(100% - 20px);
    height: 100%;
    margin-left: 20px;
    background-color: white;
    float: right;
  }
</style>
