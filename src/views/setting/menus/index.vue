<template>
    <div class="menu-container">
      <div class="header-container">
        <el-button type="primary">新增</el-button>
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                v-loading="loading"
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
            <el-tooltip v-for="(key,value) in model.row.modulesMaps" effect="dark" placement="top">
              <div slot="content">{{key | contentFilter}}</div>
              <span style="color: #20a0ff">{{value}}
                              <el-divider direction="vertical"/>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作">
          <template #default="scope">
            <i class="el-icon-plus" @click="handleAdd(scope.row)" style="color: #20a0ff"/>
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

      <el-dialog class="dialog-container" title="新增" :visible.sync="dialogVisible" width="60%">
        <el-divider></el-divider>
        <el-form :rules="rules" v-model="form" label-position="left">
          <el-form-item label="父级菜单：">
            <el-select v-model="selectValue" disabled placeholder="请选择">
              <el-option v-for="item in form.options" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入菜单名称"/>
          </el-form-item>
          <el-form-item label="菜单地址：" prop="address">
            <el-input v-model="form.address" placeholder="请输入菜单地址"/>
          </el-form-item>
          <el-form-item label="图标地址：" prop="icon">
            <el-input v-model="form.icon" placeholder="请输入图标地址"/>
          </el-form-item>
          <el-form-item label="显示顺序：" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="9000" @change="handleChange"/>
          </el-form-item>
          <el-form-item label="显示状态：" prop="status">
            <el-select v-model="selectStatus" placeholder="请选择">
              <el-option v-for="str in form.status"  :value="str"/>
            </el-select>
          </el-form-item>
          <el-form-item label="模块：" align="right" prop="model">
            <div class="model-container">
              <div class="add-container" @click="dialogAdd">
                <i class="el-icon-circle-plus-outline" style="color: #20a0ff">添加子集</i>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="userDialogClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog class="module-dialog-container" title="添加模块" :visible.sync="moduleDialogVisible" width="60%">
        <el-divider></el-divider>
        <el-form :rules="moduleRules" v-model="moduleForm" label-position="left">
          <el-form-item label="模块名称：">
            <el-input v-model="moduleForm.moduleName" placeholder="请输入模块名称"/>
          </el-form-item>
          <el-form-item label="API地址：" prop="name">
            <div class="module-address-container" v-model="moduleForm.apiAddress">
              <div>
                <el-input placeholder="请输入模块名称"/>
                <i class="el-icon-circle-plus-outline" style="color: #20a0ff"/>
              </div>
              <div class="module-add-container">
                <i class="el-icon-circle-plus-outline" style="color: #20a0ff">添加子集</i>
              </div>
            </div>
          </el-form-item>

        </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="moduleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="userDialogClick">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import {getMenuList} from "@/api/userManger";
  import pagination from '@/components/Pagination'
  import {menuSave} from "@/api/menu";

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
            return val.join('\n')
            // val.forEach(item => {
            //   if (str !== ''){
            //     str = str+',' +'\n'+item
            //   }else {
            //     str = str + item
            //   }
            //
            // })
          }
          return str
        },
      },
      data(){
        return {
          tableData: [],
          total: 0,
          page: 1,
          size: 20,
          loading:true,
          defaultProps: {
            children: 'Subdirectory',
            label: 'name'
          },
          dialogVisible: false,
          num: 1,
          form: {
          name: '',
          address: '',
          icon: '',
          sort: 888,
          model: '',
          status: ['显示', '不显示'],
          options:['首页']
        },
          selectValue:'',
          selectStatus:'显示',
          clickData:null,
          moduleDialogVisible:false,
          moduleForm:{
            moduleName:'',
            apiAddress:''
          },
          rules:{
            name:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            address:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            sort:[{ required: true, message: '请输入活动名称', trigger: 'blur' }],
            status:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
            ]
          },
          moduleRules:{
            moduleName:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            apiAddress:[
             // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ]
          }
        }

      },
      created() {
        this.menuList()
      }
      ,
      methods:{
        dialogAdd(){
          this.isRightClick = false
          this.moduleDialogVisible = true
        },
        userDialogClick(){
          let  model = new Object()
          model.parentId = this.clickData.parentId
          model.menuIcon = this.form.address
          model.menuLink = this.form.icon
          model.menuName = this.form.name
          model.showIndex = this.form.sort
          if (this.selectStatus === this.form.status[0]){
            model.state = true
          }else {
            model.state = false
          }
          let str = JSON.stringify(model)
          console.log(str)
          menuSave(str).then(response => {
            this.dialogVisible = false
            getMenuList(1,20)
          }).catch(err => {
            this.$message({
              message:err.message,
              type:'warning'
            })
          })
        },
        handleAdd(data){
          this.dialogVisible = true
          this.selectValue = data.menuName
          this.clickData = data
        },
        handleEdit(){

        },
        handleDelete(){

        },
        menuList(){
          getMenuList(this.page,this.size).then(response => {
            this.loading = false
            this.tableData = response.result.data
            this.total = response.result.totalCount
              this.page = response.result.pageSize
              this.size = response.result.currPage
          })
        },
        stringSplit(val){
          debugger
          let string = ''
          if (val.length>30){
             string = string +'<br/>'+string.slice(0,30)
          }
          this.stringSplit(string.slice(31,string.length-31))
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
.dialog-container{
  ::v-deep{
    .el-form{
      margin-left: 30px;
      .is-required{
        .el-form-item__label{
          padding-left: 0px;
        }
      }
      .el-form-item__label{
        padding-left: 10px;
        text-align: right;
      }
    }

  }
  ::v-deep.el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-divider:nth-of-type(1){
    margin-top: 0;
    margin-bottom: 30px;
  }
  .el-divider{
    margin-top: 40px;
    margin-bottom: 10px;
  }
}
  .el-form-item{
    .el-input{
      width: 80%;
    }

  }
  .model-container{
    width: 78%;
    padding: 20px;
    border-radius: 5px;
    margin-right: 30px;
    float: right;
    display: flex;
    align-content: center;
    justify-content: center;
    border: #97a8be solid 0.5px;

    .add-container{
      display: flex;
      width: 100%;
      padding-top: 10px;
      height: 40px;
      border: #99a9bf dashed 0.5px;
      border-radius: 5px;
      align-content: center;
      justify-content: center;
      cursor: pointer;
    }
    .el-icon-circle-plus-outline{
      padding-right: 10px;
    }
    .el-icon-circle-plus-outline:before{
      padding-right: 10px;
      padding-top: 1px;
    }
  }
  .module-dialog-container{
    .el-form{
      margin-left: 30px;
      margin-right: 30px;
    }
    ::v-deep.el-dialog__body{
      padding-top: 0;
      padding-bottom: 0;
    }
    .el-divider:nth-of-type(1){
      margin-top: 0;
      margin-bottom: 30px;
    }
    .el-divider{
      margin-top: 40px;
      margin-bottom: 10px;
    }
    .module-address-container{
      width: 80%;
      float: right;
      border: #99a9bf dashed 0.5px;
    }
  }
</style>
