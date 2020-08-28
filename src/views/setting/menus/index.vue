<template>
    <div class="menu-container">
      <div class="header-container">
        <el-button type="primary" @click.prevent="handleAddMenu">新增</el-button>
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
              <div v-html="contentFilter(key)" slot="content"></div>
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
            <i class="el-icon-edit" @click="handleEdit(scope.row)" style="color: #20a0ff"/>
            <el-divider direction="vertical"/>
            <i class="el-icon-delete" @click="handleDelete(scope.row)" style="color: #20a0ff"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <pagination :total="total" :page.sync="page" :limit.sync="size" @pagination="handlePagination" layout="prev, pager, next, sizes" />
        <div align="center" style="float: right;margin-right: 5px;margin-top: 8px;font-size: 15px">
          {{total | totalFilter(size)}}
        </div>
      </div>
<!--新增对话框-->
      <el-dialog class="dialog-container" title="新增" :visible.sync="dialogVisible" width="60%">
        <el-divider></el-divider>
        <el-form :rules="rules" :model="form" ref="form" label-width="100px" label-position="right">
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
            <el-select v-model="form.selectStatus" placeholder="请选择">
              <el-option v-for="str in form.status"  :value="str"/>
            </el-select>
          </el-form-item>
          <el-form-item label="模块：">
            <div class="add-module-container">
                <div v-for="(item,index) in form.modules" class="add-module-content">
                  <span >{{item.name}}</span>
                  <el-tooltip  effect="dark" placement="top-start" >
                    <div v-html="addressFilter(item.address)" style="width: 100px" slot="content"></div>
                    <span >{{item.address | addressShowFilter}}</span>
                  </el-tooltip>
                  <span>
                    <i class="el-icon-delete" @click="handleDeleteModule(item)" style="color: #20a0ff"/>
                    <i class="el-icon-edit" @click="handleEditModule(item)" style="color: #20a0ff"/>
                  </span>
                </div>
              <el-button icon="el-icon-circle-plus-outline"  @click="dialogAdd">添加</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogClick">确 定</el-button>
        </span>
      </el-dialog>
      <!--模块对话框-->
      <el-dialog class="module-dialog-container" title="添加模块" :visible.sync="moduleDialogVisible" width="60%">
        <el-divider></el-divider>
                  <el-form ref="moduleForm" :rules="moduleRules" hide-required-asterisk="hideRequiredAsterisk" :model="moduleForm" label-width="100px" label-position="right">
                    <el-form-item label="模块名称：">
                      <el-input v-model="moduleForm.moduleName" placeholder="请输入模块名称"/>
                    </el-form-item>
                    <el-form-item label="API地址：" prop="name">
                      <div class="module-address-container">
                          <el-form-item
                            v-for="(domain, index) in moduleForm.modulesMaps"
                            :key="domain.key"
                            :prop="'domains.' + index + '.value'">
                            <el-input v-model="domain.value" placeholder="请输入模块名称"></el-input>
<!--                            <el-button type="primary" icon="el-icon-delete" circle></el-button>-->
                            <span class="right-delete-container">
                            <i class="el-icon-delete" style="color: #20a0ff" @click.prevent="removeModule(domain)"/>
                          </span>
                          </el-form-item>

                        <el-button icon="el-icon-circle-plus-outline"  @click="addModule">添加</el-button>
                        </div>
                    </el-form-item>

                  </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="moduleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleAddModule">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import {getMenuList} from "@/api/userManger";
  import pagination from '@/components/Pagination'
  import {menuSave, updateSave} from "@/api/menu";

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
        addressShowFilter(val){
          let str = ''
          if (Array.isArray(val)){
            return  val[0].value
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
          options:['首页'],
          modules:[],
          selectStatus:'显示',
        },
          selectValue:'',
          clickData:null,
          moduleDialogVisible:false,
          moduleForm:{
            moduleName:'',
            modulesMaps:[{
              value: '',
            }],
          },
          hideRequiredAsterisk:true,
          rules:{
            name:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            address:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 1, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            sort:[{ required: true, message: '年龄不能为空'},
              { type: 'number', message: '年龄必须为数字值'}],
            selectStatus:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
            ]
          },
          moduleRules:{
            moduleName:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ]
          }
        }

      },
      created() {
        this.menuList()
      }
      ,
      methods:{
        contentFilter(val){
          let str = ''
          if (Array.isArray(val)){
            return val.join('</br>')
          }
          return str
        },
        addressFilter(val){
          let str = ''
          if (Array.isArray(val)){
            val.forEach(item => {
              str += item.value + '</br>'
            })
          }
          return str
        },
        //新增对话框删除按钮事件
        handleDeleteModule(item){
          let index = this.form.modules.indexOf(item)
          if (index !== -1) {
            this.form.modules.splice(index, 1)
          }
        },
        //新增对话框确定按钮事件
        addDialogClick(){
          this.$refs.form.validate(valid => {
            if (valid) {
              console.log(this.selectValue)
              console.log(this.clickData)
              if (this.selectValue === this.clickData.menuName){
                menuSave(this.clickData.id,this.form,this.moduleData()).then(response => {
                  this.$message({
                    message:'添加菜单成功',
                    type:'success'
                  })
                  this.dialogVisible = false
                  getMenuList(1,20)
                }).catch(err => {
                  // this.$message({
                  //   message:err.message,
                  //   type:'warning'
                  // })
                })
              }else {
                updateSave(this.clickData.parentId,this.clickData.id,this.form,this.moduleData()).then(response => {
                  this.$message({
                    message:'修改菜单成功',
                    type:'success'
                  })
                  this.dialogVisible = false
                  getMenuList(1,20)
                }).catch(err => {
                  // this.$message({
                  //   message:err.message,
                  //   type:'warning'
                  // })
                })
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })

        },
        moduleData(){
          let map = new Object()
          let data = this.form.modules.slice()
          if (Array.isArray(data)) {
            for (let model of data) {
              let values = []
              if (Array.isArray(model.address)) {
                for (let address of model.address) {
                  values.push(address.value)
                }
              }else {
                values.push(model.address.value)
              }
              map[model.name] = values
            }
            }else {
              if (Array.isArray(item.address)) {
                let values = []
                for (let address of item.address) {
                  values.push(address.value)
                }
                map[item.name] = values
            }else {
                map[data.name] = item.address.values
            }
          }
          return map
        },
        //添加模块对话框编辑按钮事件
        handleEditModule(item){
          this.moduleForm.moduleName = item.name
          this.moduleForm.modulesMaps = item.address
          this.dialogAdd()
        },
        //添加模块对话框确认按钮事件
        handleAddModule(){
          this.$refs.moduleForm.validate(valid => {
            if (valid) {
              let add =   this.form.modules.some(item => {
                if (item.name === this.moduleForm.moduleName){
                  item.address = this.moduleForm.modulesMaps
                  return true
                }
              })
              if (add !== true){
                this.form.modules.push({
                  name:this.moduleForm.moduleName,
                  address:this.moduleForm.modulesMaps.slice(),
                  key: Date.now()
                })
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })

          // if (this.editIndex){
          //   this.form.modules.some(item => {
          //     if (item.key === this.editIndex){
          //       name:this.moduleForm.moduleName,
          //       item.address = this.moduleForm.modulesMaps
          //       return true
          //     }
          //   })
          //   this.editIndex = null
          // }else {
          //
          // }
            //this.$refs.moduleForm.resetFields()
            this.moduleDialogVisible = false
          this.resetModuleForm()
        },
        resetModuleForm(isModule = true){
          if (isModule){
            this.moduleForm.moduleName = ''
            this.moduleForm.modulesMaps = []
          }else {
            this.selectValue = ''
            this.form.name = ''
            this.form.address = ''
            this.form.icon = ''
            this.form.modules = []
          }
        },
        //添加模块删除框添加事件
        removeModule(item) {
          let index = this.moduleForm.modulesMaps.indexOf(item)
          if (index !== -1) {
            this.moduleForm.modulesMaps.splice(index, 1)
          }
        },
        //添加模块添加框添加事件
        addModule() {
          this.moduleForm.modulesMaps.push({
            value: '',
            key: Date.now()
          })
        },
        //header添加子节点
        handleAddMenu(){
          this.selectValue = '顶级菜单'
          this.dialogVisible = true
        },

        //新增对话框添加子集按钮事件
        dialogAdd(){
          this.isRightClick = false
          this.moduleDialogVisible = true
        },
        //添加
        handleAdd(data){
          //this.$refs.form.resetFields()
          this.resetModuleForm(false)
          this.selectValue = data.menuName
          this.clickData = data
          this.dialogVisible = true
        },
        findNodeName(id,data){
          for (let model of data) {
            if (model.id === id) {
              return model.menuName
            }
            if (model.children && model.children.length > 0) {
              let model = this.findNodeName(id, model.children)
              if (typeof (model) !== "undefined" && model !== null) {
                return model
              }
            }
          }
        },
        //编辑
        handleEdit(data){
          this.clickData = data
          if (data.parentId === null){
            this.selectValue = '顶级菜单'
          }else {
            this.selectValue = this.findNodeName(data.parentId,this.tableData)
          }
            this.form.name = data.menuName
            this.form.address = data.menuLink
            this.form.sort = data.showIndex
            if (data.state){
              this.form.status = '显示'
            }else {
              this.form.status = '不显示'
            }
            if (Array.isArray(data.modulesMaps)){
              data.modulesMaps.forEach(item => {
                let model = new Map(Object.entries(item))
                model.forEach((value, key) => {
                  let arr = []
                  value.forEach(item => {
                    let  obj = new Object()
                    obj.key = Date.now()
                    obj.value= item
                    arr.push(obj)
                  })
                  this.form.modules.push({
                    name:key,
                    address:arr
                  })
                })
              })
            }else {
              let model = new Map(Object.entries(data.modulesMaps))
              model.forEach((value, key) => {
                let arr = []
                value.forEach(item => {
                  let  obj = new Object()
                  obj.key = Date.now()
                  obj.value= item
                  arr.push(obj)
                })
                this.form.modules.push({
                  name:key,
                  address:arr
                })
              })
            }
            this.dialogVisible = true
        },
        //删除
        handleDelete(data){
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
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
        handlePagination(){
          getMenuList(this.page,this.size)
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
  //border-bottom: #97a8be solid 0.5px;
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
  .el-form{
    margin-left: 40px;
    margin-right: 20px;
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
    margin-top: 30px;
    margin-bottom: 10px;
  }
}
  /*.el-form-item{*/
  /*  .el-input{*/
  /*    width: 80%;*/
  /*  }*/
  /*}*/
  .model-container{
    border-radius: 5px;
    border: #97a8be solid 0.5px;

    .add-container{
      margin: 20px;
      height: 40px;
      padding-top: 10px;
      border: #99a9bf dashed 0.5px;
      border-radius: 5px;
      display: flex;
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
      margin-right: 20px;
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
    .module-address-container {
      border: #99a9bf solid 0.5px;
      padding-right: 20px;
      padding-left: 20px;
      padding-bottom: 20px;
      border-radius: 5px;

      .el-input {
        margin-top: 20px;
        width: calc(100% - 30px);
      }

      .el-button {
        margin-top: 30px;
        width: 100%;
        color: #409EFF;
        border: #99a9bf dashed 0.5px;
      }

    }
    .right-delete-container{
      float: right;
      margin-top: 20px;
      padding-left: 15px;
    }
 }
  .add-module-container{
    border: #99a9bf solid 0.5px;
    padding: 20px;
    border-radius: 5px;


    .el-button{
      width: 100%;
      border: #99a9bf dashed 0.5px;
    }
  }
  .add-module-content{
    height: 20px;
    width: 100%;
    padding-left: 10px;
    margin-bottom: 20px;
    text-align: center;
  }
  .add-module-content>span:nth-child(2){
    width: 70%;
  }
  .add-module-content>span:first-child{
       width: 20%;
    float: left;
    text-align: left;
   }
  .add-module-content>span:last-child{
    .el-icon-edit{
      padding-left: 10px;
      cursor: pointer;
    }
    .el-icon-delete{
      cursor: pointer;
    }
    width: 50px;
    float: right;
  }


</style>
