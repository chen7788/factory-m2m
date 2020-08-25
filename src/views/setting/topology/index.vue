<template>
    <div v-cloak class="potology-container">

      <el-col :span="9">
        <el-card shadow="never" >
          <div class="header-container" slot="header">
            <span>物业管理</span>
            <el-button type="text" @click="addRootLeaf" icon="el-icon-plus">添加节点</el-button>
          </div>
<!--          <a-tree v-if="data.length>0" :treeData = data  showIcon showLine :replaceFields="replaceFields"  style="height: 100vh" defaultExpandAll>-->
<!--&lt;!&ndash;            <a-icon slot="leaf" type="caret-right"/>&ndash;&gt;-->
<!--            <a-icon slot="leaf" type="unordered-list" />-->
<!--            <i slot="subLeaf" class="el-icon-date"/>-->
<!--&lt;!&ndash;            <a-icon slot="switcherIcon" type="step-forward" />&ndash;&gt;-->
<!--            <i slot="children" class="el-icon-video-play"/>-->
<!--          </a-tree>-->
          <div class="left-tree-container">
              <el-tree rel="leftTree"
                v-loading="leftLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.001)"
                :empty-text="leftLoadingText"
                node-key="uuid"
                ref="leftTree"
                :data="data"
                :props="defaultProps"
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleLeftNodeClick"
                @node-expand="handleLeftNodeExpand"
                @node-collapse="handleLeftNodeCollapse"
                @node-contextmenu="handleLeftNodeContextmenu"
                style="width: 100%;">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i v-if="!data.Subdirectory" class="el-icon-tickets" ></i>
            </span>
            <span>
                <i :class="data.icon"></i>{{ node.label }}
            </span>
        </span>
              </el-tree>
            <div  class=rightClickMenu v-show="isRightClick"  ref="rightClick"  transiton="fade" v-clickoutside="handleClose">
              <ul style="list-style: none">
                <li @click="addNode"><i class="el-icon-plus"></i> 添加子节点</li>
                <li @click="editNode"><i class="el-icon-edit"></i> 修改节点</li>
                <li v-show="isShowDeleteNode" @click="deleteNode"><i class="el-icon-delete"></i> 删除节点</li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div align="center" style="margin-top: 200px">
          <el-button type="primary" :disabled="bindStatus" @click="handleBind">绑定</el-button>
        </div>
        <div align="center"  style="margin-top: 100px">
          <el-button type="primary" :disabled="unBindStatus" @click="handleUnbind">解绑</el-button>
        </div>
        <div align="center" style="margin-top: 100px" @click="handleProperty">
          <el-button type="primary">物业关联</el-button>
        </div>
        <div align="center" style="margin-top: 100px">
          <el-button type="primary" @click="handleDevice">设备关联</el-button>
        </div>
      </el-col>
      <el-col :span="9">
        <el-card shadow="never">
          <div slot="header">
            <span>设备管理</span>
          </div>
          <div class="right-tree-container">
            <el-tree ref="rightTree"
                     v-loading="rightLoading"
                     element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.001)"
                     :empty-text="rightLoadingText"
                     :data="data2"
                     :props="defaultProps2"
                     node-key="id"
                     default-expand-all
                     highlight-current
                     :expand-on-click-node="false"
                     :icon-class="iconClass"
                     @node-click="handleRightNodeClick"
                     @node-expand="handleRightNodeExpand"
                     @node-collapse="handleRightNodeCollapse"
                     style="width: 100%;">
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
                <i :class="data.icon" class="right-icon-container"></i>{{ node.label }}
            </span>
            </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
<!--      添加子节点-->
      <el-dialog class="add-leaf-dialog" :title="addDialogTitle" :visible.sync="addDialogVisible" width="50%">
        <el-divider></el-divider>
        <el-form :rules="addRules" :model="addForm" label-position="left">
          <el-form-item label="父节点：">
            <el-input v-model="addForm.leaf" :disabled="inputDisabled" placeholder="请输入模块名称"/>
          </el-form-item>
          <el-form-item label="节点名称：" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入模块名称"/>
          </el-form-item>
          <el-form-item label="备注：" prop="desc">
            <el-input type="textarea" v-model="addForm.desc" placeholder="请输入模块名称"/>
          </el-form-item>
          <el-form-item label="显示顺序：" prop="sort">
            <el-input-number v-model="addForm.sort" controls-position="right" :min="0" :max="9000" @change="handleChange"/>
          </el-form-item>

        </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogClick">确 定</el-button>
        </span>
      </el-dialog>
      <!--      设备关联-->
      <el-dialog class="connect-dialog" :title="connectDialogTitle" :visible.sync="connectDialogVisible" width="50%">
        <el-divider></el-divider>
        <el-table height="400px" ref="multipleTable"
                  :data="tableData"
                  style="width: 100%;margin-bottom: 20px;"
                  row-key="id"
                  border>
          <el-table-column align="center"
                           prop="deviceMacAddress"
                           :label="leftTitle">
          </el-table-column>
          <el-table-column align="center"
                           prop="node"
                           :label="rightTitle">
          </el-table-column>

        </el-table>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="connectDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="connectDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import { leftTreeData, deviceTreeData, allBinds, bindNode, unbindNode, addNode, upDateNode, deleteNode} from '@/api/topology'
  import ScrollPane from "@/layout/components/TagsView/ScrollPane";
    export default {
      components: {ScrollPane},
      data(){
        return{
          leftLoading:true,
          rightLoading:true,
          data:null,
          data2:null,
          allBinds:null,
          defaultProps: {
            children: 'Subdirectory',
            label: 'propertytyName'
          },
          replaceFields:{
            children: 'Subdirectory',
            title: 'propertytyName',
          },
          defaultProps2: {
            children: 'children',
            label: 'macAddress',

          },
          isExpand:true,
          isRightExpand:true,
          bindStatus:true,
          unBindStatus:true,
          leftLoadingText:'',
          rightLoadingText:'',
          isRightClick:false,
          isShowDeleteNode:true,
          addDialogVisible:false,
          leftClickData:null,
          addDialogTitle:'',
          tableData:[],
          addForm:{
            leaf:'',
            name:'',
            desc:'',
            sort:999
          },
          inputDisabled:true,
          connectDialogVisible:false,
          connectDialogTitle:'物业节点设备关联',
          leftTitle:'物业节点名称',
          rightTitle:'关联设备',
          addRules:{
            name:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
            ],
            sort:[{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          }
        }
      },
      //    自定义指令clickoutside绑定了一个函数handleClose用来关闭菜单
      directives:{
        clickoutside:{
          bind:function(el,binding,vnode){
            function documentHandler(e){
              if(el.contains(e.target)){
                return false;
              }
              if(binding.expression){
                binding.value(e)
              }
            }
            el._vueClickOutside_ = documentHandler;
            document.addEventListener('click',documentHandler);
          },
          unbind:function(el,binding){
            document.removeEventListener('click',el._vueClickOutside_);
            delete el._vueClickOutside_;
          }
        }
      },
      computed:{
        iconClass(){
          if (this.isExpand){
            return'el-icon-minus'
          }
          return 'el-icon-plus'
        },
      },
      created() {
        this.getAllBinds()
      },
      methods:{
        addRootLeaf(){
          this.addForm.leaf = ''
          this.addForm.name = ''
          this.addForm.desc = ''
          this.addDialogVisible = true
          this.isRightClick = false
        },
        handleDevice(){
          this.leftTitle='设备名称'
          this.rightTitle = '关联物业节点'
          this.connectDialogTitle = '设备关联物业节点'
          let map = new Map()
          let data = [...this.allBinds]
          data.forEach(item => {
            if (map.get(item.deviceMacAddress)){
              let  temp = map.get(item.deviceMacAddress)
              if (!temp.node.includes(item.node)){
                temp.node = temp.node+'   |    '+item.node
              }
            }else {
              map.set(item.deviceMacAddress,item)
            }
          })
          let arr =[]
          for (let value of map.values()) {
            arr.push(value)
          }
          this.tableData = arr
          this.connectDialogVisible = true
        },
        addNode(){
          this.addDialogTitle = '添加物业节点'
          this.addDialogVisible = true
          this.isRightClick = false
          this.addForm.leaf = this.leftClickData.propertytyName
        },
        addDialogClick(){
          if (this.addForm.leaf === '' || this.addForm.leaf === this.leftClickData.propertytyName){
            let node = ''
            if (this.addForm.leaf !== ''){
              node = this.leftClickData.parentNode
            }
            addNode(this.addForm.name,this.addForm.desc,this.addForm.sort,node).then(response => {
              this.addDialogVisible = false
              this.$message({
                message:'添加节点成功',
                type:'success'
              })
              this.getAllBinds()
            }).catch(err => {
              this.$message({
                message:err.message,
                type:'error'
              })
            })
          }else {
            upDateNode(this.addForm.name,this.addForm.desc,this.addForm.sort,this.leftClickData.id,this.leftClickData.parentNode).then(response => {
              this.addDialogVisible = false
              this.$message({
                message:'修改节点成功',
                type:'success'
              })
              this.getAllBinds()
            }).catch(err => {
              this.$message({
                message:err.message,
                type:'error'
              })
            })
          }

        },
        editNode(){
          this.addDialogTitle = '修改物业节点'
          this.addDialogVisible = true
          this.isRightClick = false
          this.addForm.name = this.leftClickData.propertytyName
          this.addForm.desc = this.leftClickData.remarks
          this.addForm.sort = this.leftClickData.sortNumber
        },
        deleteNode(){
          this.$confirm('确定删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteNode(this.leftClickData.uuid).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getAllBinds()
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        // 下拉菜单
        handleClose(){
          this.isRightClick = false;
        },
        handleLeftNodeContextmenu(event,data,node,obj){
          if (data.deviceMacAddress){
            return
          }
          this.isShowDeleteNode = true
          if (data.Subdirectory && data.Subdirectory.length === 1){
            let item = data.Subdirectory[0]
            if (item.uuid){
              this.isShowDeleteNode = false
            }
          }
          this.isRightClick = true
          this.$refs.rightClick.style.left = event.x +'px'
          this.$refs.rightClick.style.top = event.y-80 +'px'
          const boxPosition = this.$refs.rightClick.getBoundingClientRect();
          const boxPositionTop = boxPosition.bottom;
          this.getScreenSize(event,boxPositionTop);
          this.leftClickData = data
          this.addForm.leaf = node.parent.data.propertytyName
        },
        handleLeftNodeClick(data,node,obj){
         this.changeUnbindStatus(data)
        },
        //获取body高度以及设置元素在页面中的位置
        getScreenSize(val,boxPositionTop) {
          var count= document.body.offsetHeight;
          var countY = count - boxPositionTop;
          if (countY <20){
            this.$refs.rightClick.style.top = val.y - 150 +'px';
          }
        },
        handleRightNodeClick(data,node,obj){
          let leftData = this.$refs.leftTree.getCurrentNode()
          if (!data.hasOwnProperty("orgId")){
            if (leftData !== null){
              if (this.bindStatus){
                this.bindStatus = false
              }
            }
          }
          if (leftData === null){
            if (!this.bindStatus){
              this.bindStatus = true
            }
          }
        },
        handleBind(){
          let leftData = this.$refs.leftTree.getCurrentNode()
          let rightData = this.$refs.rightTree.getCurrentNode()
          bindNode(leftData.uuid,rightData.id).then(response => {
            this.$message({
              message:'绑定成功',
              type:'success'
            })
            this.getAllBinds()
          }).catch(err => {
            this.$message({
              message:err.message,
              type:'error'
            })
          })
        },

        handleUnbind(){
          let leftData = this.$refs.leftTree.getCurrentNode()
          let uuid = null
          if (leftData.uuid){
            uuid = leftData.uuid
          }else {
            uuid = leftData.orgId
          }
          unbindNode(uuid,leftData.deviceNodeId).then(response => {
            this.$message({
              message:'解绑成功',
              type:'success'
            })
            this.getAllBinds()
          }).catch(err => {
            this.$message({
              message:err.message,
              type:'error'
            })
          })
        },
        handleProperty(){
          let data = this.data.slice()
          let arr = []
          this.findDialogData(data,arr)
          this.tableData = arr
          this.connectDialogVisible = true
        },
        findDialogData(data,arr){

          for (let item of data) {
            let model = new  Object()
            if (item.uuid){
              model.deviceMacAddress = item.propertytyName
              if (item.Subdirectory && item.Subdirectory.length>0){
                let sub = item.Subdirectory[0]
                if (sub.deviceMacAddress){
                  model.node = sub.deviceMacAddress
                }
              }
            }else {
              model.name = '',
                model.node = item.deviceMacAddress
            }
            arr.push(model)
            if (item.hasOwnProperty("Subdirectory") && item.Subdirectory.length > 0){
                this.findDialogData(item.Subdirectory, arr)
            }
          }
        },
        //设置解绑按钮状态
        changeUnbindStatus(data){
          if (data == null){
            this.unBindStatus = true
            this.bindStatus = true
            return
          }
          if (data.hasOwnProperty('orgId')){
            if (this.unBindStatus){
              this.unBindStatus = !this.unBindStatus
            }
            if (!this.bindStatus){
              this.bindStatus = true
            }
              this.$refs.rightTree.setCurrentKey(data.deviceNodeId)
          }else {
            if (data.hasOwnProperty("Subdirectory") && data.Subdirectory.length > 0){
              let sub = data.Subdirectory[0]
              if (sub.hasOwnProperty('orgId')){
                if (this.unBindStatus){
                  this.unBindStatus = !this.unBindStatus
                }
              }else {
                if (!this.unBindStatus){
                  this.unBindStatus = !this.unBindStatus
                }
              }
            }else {
              if (!this.unBindStatus){
                this.unBindStatus = !this.unBindStatus
              }
            }
            let rightData = this.$refs.rightTree.getCurrentNode()
            if (rightData !== null){
              this.bindStatus = false
            }
          }
        },

        handleLeftNodeExpand(){
          this.isExpand = true
        },
        handleLeftNodeCollapse(){
          this.isExpand = false
        },
        handleRightNodeExpand(){
          this.isRightExpand = true
        },
        handleRightNodeCollapse(){
          this.isRightExpand = false
        },
        getLeftTreeData(){
          leftTreeData().then(response => {
            this.leftLoading = false
            let result = JSON.parse(response.result)
            if (result.length===0){
              this.leftLoadingText = '暂无数据'
              this.data = null
              return
            }
            this.allBinds.forEach(item => {
              this.traverseLeftTreeData(result,item,true)
            })
            this.data = result
          })
        },
        getRightTreeData(){
          deviceTreeData().then(response => {
            this.rightLoading = false
            if (response.result.length === 0){
              this.rightLoading = '暂无数据'
              this.data2 = null
              return
            }
            let  model = Object.assign({},response.result)
            this.allBinds.forEach(item => {
              this.traverseRightTreeData(response.result,item)
            })
            console.log(response.result)
            this.data2 = response.result
          })
        },

        getAllBinds(){
          allBinds().then(response => {
            this.allBinds = response.result
            this.getLeftTreeData()
            this.getRightTreeData()
          })
        },
        traverseRightTreeData(data,bind){
          for (let item of data){
            if (item.id === bind.deviceNodeId){
              item.icon='el-icon-video-play'
            }else {
              if (!item.hasOwnProperty("icon")){
                item.icon='el-icon-menu'
              }
            }
            if (item.hasOwnProperty("children") && item.children.length > 0){
              let model = this.traverseRightTreeData(item.children,bind)
            }
          }
        },
          traverseLeftTreeData(data,bind,isLeaf){
            for (let item of data){
              let slot = Object()
              if (item.uuid === bind.orgId){

                let  arr = []
                let dd = Object.assign({},bind)
                dd.propertytyName = dd.deviceMacAddress
                slot.icon='children'
                dd.slots = slot
                dd.icon='el-icon-video-play'
                if (bind.node){
                  bind.node = bind.node+'|'+item.propertytyName
                }else {
                  bind.node = item.propertytyName
                }
                if (item.hasOwnProperty("Subdirectory") && item.Subdirectory.length > 0){
                  item.Subdirectory.unshift(dd)
                }else {
                  arr.push(dd)
                  item.Subdirectory = arr
                }
              }else {
                if (isLeaf){
                  slot.icon='leaf'
                  item.slots = slot
                  item.icon='el-icon-tickets'
                }else {
                  if (!item.hasOwnProperty("slots")){
                    slot.icon='subLeaf'
                    item.slots = slot
                    item.icon='el-icon-date'
                  }
                }
              }
              if (item.hasOwnProperty("Subdirectory") && item.Subdirectory.length > 0){
                //let sub = item.Subdirectory[0]
                //if (!sub.hasOwnProperty('orgId')){
                  let model = this.traverseLeftTreeData(item.Subdirectory,bind,false)
                  if (typeof(model) !== "undefined" && model !== null){
                    return model
                 // }
                }
              }
            }
          }
      }
    }
</script>

<style lang="scss" scoped>
  .header-container{
    height: 30px;
    .el-button{
      color: #5a5e66;
      float: right;
      padding-top: 7px;
      height: 30px;
      width: 100px;
      border: #5a5e66 solid 1px;
      border-radius: 2px;
    }
  }
  .potology-container{
    height: 100%;
    position: relative;
    background-color:rgba(240,242,245,1);
  }
  .left-tree-container{
    height: calc(100vh - 190px);
    overflow-y: scroll;
  }
  .right-tree-container{
    height: calc(100vh - 190px);
  }
  .custom-tree-node{
    padding-left: 8px;
    padding-top: 2px;
    .span{
      font-size: 15px;
      padding-left: 5px;
    }
  }
  .el-icon-reading{
    padding-right: 10px;
  }
  .left-tree-container{
    ::v-deep {
      /*/ /默认图旋转90度 动画取消*/
      .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      /*取消无孩子的节点展开折叠图标显示*/
      .el-tree-node__expand-icon.is-leaf:before{
        margin-right: 5px;
        content:"";
        /*content:url("../../images/fileicon.png");*/
      }
      /*/ / 收起*/
      .el-tree-node__expand-icon:before {
        content:url("../../../assets/images/opentree.png") ; /*具体的图标*/
        margin-right: 5px;
        padding-top: 3px;
      }
      /*/ / 展开*/
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        content: url("../../../assets/images/closetree.png");
        margin-right: 5px;
        margin-top: 3px;
      }
    }
  }


.el-icon-video-play{
  color: #20a0ff;
  margin-right: 5px;
}
.el-icon-tickets{
  padding-right: 5px;
}
.right-icon-container{
  margin-right: 5px;
}
  .potology-container{
    .el-card{
      margin-top: 5px;
      height: 100%;
    }
  }
  .rightClickMenu{
    width: 120px;
    height: 100px;
    top: 100px;
    box-shadow: 2px 1px 5px 1px rgb(149, 149, 149);
    border-radius: 5px;
    position: absolute;

    background-color: #fff;
    z-index: 0;
    ul{
      padding-left: 15px;
      padding-top: 10px;
    }
    li{
      cursor: pointer;
      line-height: 26px;
    }
    li:hover{
      background-color: rgba(61,131,255,0.17);
    }
  }
  .add-leaf-dialog{
    .el-form-item{
      .el-input{
        width: 70%;
      }
      .el-textarea{
        width: 70%;
      }
    }

    ::v-deep{
      .el-form{
        margin-left: 0px;
        .el-form-item__label{
          text-align: right;
          width: 120px;
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
  .connect-dialog{
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
</style>
