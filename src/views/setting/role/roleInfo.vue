<template>
    <div style="margin-left: 10px">
      <el-col :span="7">
        <div class="left-container">
          <div class="header-container">
            <div class="header-title-container">角色列表</div>
            <div class="header-item-container">
              <el-tooltip  effect="dark" content="添加"placement="bottom">
                <i class="el-icon-plus header-item" @click="handleAddRole"/>
              </el-tooltip>
              <el-tooltip v-show="deleteButtonShow" effect="dark" content="删除"placement="bottom">
                <i  class="el-icon-delete header-item" @click.prevent="handleDeleteRole"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="刷新"placement="bottom">
                <i class="el-icon-refresh header-item" @click="handleRefreshRole"/>
              </el-tooltip>
            </div>
          </div>
          <div class="tree-container">
            <el-tree :data="treeData" v-loading="treeLoading" element-loading-text="正在查询中。。。" default-expand-all :props="defaultProps" @node-click="handleNodeClick"/>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="right-container">
          <div class="header-container">
            <div class="header-title-container">角色详细信息</div>
          </div>
          <div class="form-container">
            <el-form ref="form" :rules="rules" :model="formData" label-position="left">
              <el-form-item label="角色名称：">
                <el-input v-model="formData.name" placeholder="请输入角色名称" clearable style="width: 200px"></el-input>
              </el-form-item>
              <el-form-item label="节点类型：">
                <el-radio v-model="formData.type" label="0">角色</el-radio>
                <el-radio v-model="formData.type" label="1">非角色</el-radio>
              </el-form-item>
              <el-form-item label="排序码：" label-width="80px">
                <el-input-number v-model="formData.code" controls-position="right" @change="handleChange" :min="1"></el-input-number>
              </el-form-item>
              <el-form-item label="描述：" label-width="80px">
                <el-input v-model="formData.desc" placeholder="请输入描述" clearable style="width: 200px" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="buttonLoading" @click.native.prevent="handleOprateRole">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="header-container">
            <div class="header-title-container">包含用户</div>
            <div v-show="userButtonShow" class="header-item-container">
              <el-tooltip  effect="dark" content="添加"placement="bottom">
                <i class="el-icon-plus header-item" @click="handleAddUser"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除"placement="bottom">
                <i  class="el-icon-delete header-item" @click="handleDeleteUser"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="刷新"placement="bottom">
                <i class="el-icon-refresh header-item" @click="handleRefreshUser"/>
              </el-tooltip>
            </div>
          </div>
          <div class="table-container">
            <el-table max-height="300px" size="mini" :data="tableData" v-loading="tableLoading" element-loading-text="正在查询中。。。" @selection-change="handleSelectionChange" highlight-current-row fit>
              <el-table-column align="center" type="selection" width="55"/>
              <el-table-column align="center" label="登录名" prop="loginName">
                <template #defalut="scope">
                  <span>{{scope.loginName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="用户名" prop="userName">
                <template #defalut="scope">
                  <span>{{scope.userName}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div style="height: 45px;margin-top: 5px">
              <div style="width: 120px;float: left;margin-left: 20px;margin-top: 12px;font-size: 15px">
                {{selectedValue | selectedValueFilter}}
              </div>
              <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="handlePagination" layout="prev, pager, next, sizes" background="false"/>
              <div align="center" style="float: right;margin-right: 5px;margin-top: 12px;font-size: 15px">
                {{total | totalFilter(limit)}}
              </div>
            </div>

          </div>
        </div>
      </el-col>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogClick">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog class="user-dialog-container" title="用户列表" :visible.sync="userDialogVisible" width="70%" >
        <el-divider></el-divider>
        <el-input v-model="userListInputValue" placeholder="搜索关键字" style="width: 200px"/>
        <el-button class="search-button-container" type="primary" size="small" @click="searchUserList">查询</el-button>
        <el-table :data="dialogTableData" highlight-current-row @selection-change="handleDialogSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="用户名" prop="userName"></el-table-column>
          <el-table-column label="登录名" prop="loginName"></el-table-column>
          <el-table-column label="手机号码" prop="mobileNumber"></el-table-column>
          <el-table-column label="邮箱地址" prop="emailAddress"></el-table-column>
          <el-table-column label="用户状态" prop="state"></el-table-column>
        </el-table>
        <div style="height: 45px;margin-top: 5px">
          <div style="width: 120px;float: left;margin-left: 20px;margin-top: 12px;font-size: 15px">
            {{selectedValue | selectedValueFilter}}
          </div>
          <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="handlePagination" layout="prev, pager, next, sizes" background="false"/>
          <div align="center" style="float: right;margin-right: 5px;margin-top: 12px;font-size: 15px">
            {{total | totalFilter(limit)}}
          </div>
        </div>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
    <el-button @click="userDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="userDialogClick">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
  import { getTree, getRoleUserList, deleteRoleList, updateRole, addRole, getUserList, saveRoleUser, deleteRoleUser} from "@/api/userManger";
  import pagination from '@/components/Pagination'

    export default {
        name: "roleInfo",
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
      data() {
        const validateUsername = (rule, value, callback) => {
          if (validateUsername == null) {
            callback(new Error('请输入正确的管理员用户名'))
          } else if (value.length < 6) {
            callback(new Error('The password can not be less than 6 digits'))
          } else {
            callback()
          }
        }
        return {

          treeData: null,
          defaultProps: {
            children: 'Subdirectory',
            label: 'name'
          },
          formData:{
            name:'',
            type:'1',
            code:980,
            desc:''
          },
          rules:{
            name: [{ required: true, trigger: 'blur', validator: validateUsername }],
            desc: [{ required: true, trigger: 'blur', validator: validateUsername }]
          },
          tableData:[],
          total:0,
          page:0,
          limit:20,
          selectedValue:0,
          deleteButtonShow:false,
          treeLoading:true,
          tableLoading:false,
          buttonLoading:false,
          userButtonShow:false,
          treeClickData:null,
          isAdd:false,
          isTreeClick:false,
          dialogVisible: false,
          userDialogVisible:false,
          dialogTableData:null,
          userListInputValue:'',
          dialogSelectArray:[],
          isRole:true
        };
      },
      created() {
        this.getTreeData()
      },

      methods: {
          handleAddRole(){
            if (this.treeClickData === null){
              this.$message({
                message:'请选择节点',
                type:'warning'
              })
            }else if(!this.treeClickData.roleLeaf){
              this.isAdd = true
              this.setFormData('',this.treeClickData.roleLeaf,this.treeClickData.sort,'')
            }else {
              this.$message({
                message:'角色节点不能再添加角色',
                type:'warning'
              })
            }
          },
        dialogClick(){
            if (this.isRole){
              deleteRoleList(this.treeClickData.id).then(response => {
                this.dialogVisible = false
                this.$message({
                  message:response.result,
                  type:'warning'
                })
                getTree()
              }).catch(err => {
                this.$message({
                  message:err.message,
                  type:'warning'
                })
              })
            }else {
              let  arr = []
              this.dialogSelectArray.forEach(item =>arr.push(item.id))
              deleteRoleUser(this.treeClickData.id,arr).then(response => {
                this.userDialogVisible = false
                this.dialogSelectArray = []
                this.getRoleUserList()
              }).catch(err => {
                this.userDialogVisible = false
                this.dialogSelectArray = []
                this.$message({
                  message:'删除用户失败',
                  type:'warning'
                })
              })
            }

        },
        handleRefreshRole(){
          this.treeClickData = null
          this.isTreeClick = false
          this.isAdd = false
          this.getTreeData()
        },
        handleOprateRole(){
            if (!this.isTreeClick){
              this.$message({
                message:'请选择角色',
                type:'warning'
              })
                return
            }
          this.$refs.form.validate(valid => {
            if (valid){
              if (this.isAdd){
                  addRole(this.treeClickData.id,this.treeClickData.parentId,this.formData).then(response => {
                    this.getTreeData()
                  }).catch(err => {
                    this.$message({
                      message:err.message,
                      type:'warning'
                    })
                  })
              }else {
                updateRole(this.treeClickData.id,this.treeClickData.parentId,this.formData).then(reponse => {
                  this.getTreeData()
                }).catch(err => {
                  this.$message({
                    message:err.message,
                    type:'warning'
                  })
                })
              }
            }else {
              return false
            }
          })
        },
        handlePagination(){
          this.getRoleUserList(this.treeClickData.id,this.limit,this.page)
        },
        handleSelectionChange(val){
            this.dialogSelectArray = val
        },
        handleDeleteRole(){
          this.dialogVisible=true
          this.isRole = true
        },
        handleAddUser(){
            this.userDialogVisible = true
          getUserList().then(response => {
            this.dialogTableData = response.result.data
          })
        },
        handleDeleteUser(){
            if (this.dialogSelectArray.length>0){
              this.isRole = false
              this.dialogVisible=true
            }
        },
        handleRefreshUser(){
          this.getRoleUserList(this.treeClickData.id,this.limit,this.page)
        },
        userDialogClick(){
          if (this.dialogSelectArray.length === 0){
            this.$message({
              message:'请选择用户',
              type:'warning'
            })
            return
          }
          let  arr = []
          this.dialogSelectArray.forEach(item =>arr.push(item.id))
          saveRoleUser(this.treeClickData.id,arr).then(response => {
            this.userDialogVisible = false
            this.dialogSelectArray = []
            this.getRoleUserList(this.treeClickData.id,this.limit,this.page)
          }).catch(err => {
            this.userDialogVisible = false
            this.dialogSelectArray = []
            this.$message({
              message:'添加用户失败',
              type:'warning'
            })
          })
        },
        searchUserList(){
          if (this.userListInputValue === ''){
            return
          }
          getUserList(this.userListInputValue).then(response => {
            this.dialogTableData = response.result.data
          })
        },
        handleDialogSelectionChange(val){
           this.dialogSelectArray = val
        },
        setFormData(name,type,sort,description){
          this.formData.name = name
          if (type){
            this.formData.type = '0'
          }else {
            this.formData.type = '1'
          }
          this.formData.code = sort
          this.formData.desc = description
        },
        handleNodeClick(data){
            this.treeClickData = data
          this.isTreeClick = true
          let {parentId} = data
          if (parentId === '0'){
            if (this.deleteButtonShow){
              this.deleteButtonShow = false
            }
            if (this.userButtonShow){
              this.userButtonShow = false
            }

          }else {
            if (!this.deleteButtonShow){
              this.deleteButtonShow = true
            }
            if (!this.userButtonShow){
              this.userButtonShow = true
            }
          }
          this.setFormData(data.name,data.roleLeaf,data.sort,data.description)
          getRoleUserList(data.id).then(response => {
            let { result } = response
            if (result !== null){
              this.total = result.totalCount
              this.pageSize = result.currPage
              this.limit = result.pageSize
              this.tableData = result.data
            }
          }).catch(err =>{
            if (this.userButtonShow){
              this.userButtonShow = false
            }
          })
        },
        getTreeData(){
          getTree().then(response => {
            this.treeLoading = false
            let data = JSON.parse(response.result)
            this.treeData = data
          })
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
  .form-container{
    .el-form-item{
      margin:15px;
      .el-button{
        margin-left: 70px;
      }
    }
  }
  .user-dialog-container{
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
.search-button-container{
  margin-left: 20px;
}
</style>
<style scoped>
  .role-container{
    margin-left: 10px;
    margin-bottom: 10px;
    position: relative;
    background-color:rgba(240,242,245,1);
  }
  .left-container{
    width: 100%;
    height: 100%;
    min-width: 200px;
    background-color: white;
    float: left;
  }
  .right-container{
    width: calc(100% - 20px);
    height: 100%;
    margin-left: 20px;
    background-color: white;
    float: right;
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
  .form-container{
    height: 320px;
    padding: 20px;
    background-color: white;
    border-bottom: 0.5px #b4bccc solid;
  }
</style>
