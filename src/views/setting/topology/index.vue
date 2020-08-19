<template>
    <div class="potology-container">

      <el-col :span="9">
        <el-card shadow="never" >
          <div slot="header">
            <span>物业管理</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
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
      <context-menu class="right-menu"
                    :target="contextMenuTarget"
                    :show="contextMenuVisible"
                    @update:show="(show) => contextMenuVisible = show">
        <span>
          <i class="el-icon-plus"  style="color: #20a0ff"/>
          dddddd
        </span>
        <span>
          <i class="el-icon-edit"  style="color: #20a0ff"/>
          dddddd
        </span>
        <span>
          <i class="el-icon-delete"  style="color: #20a0ff"/>
          dddddd
        </span>
      </context-menu>
    </div>
</template>

<script>
  import { leftTreeData, deviceTreeData, allBinds, bindNode, unbindNode} from '@/api/topology'
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
          leftClickData:null,
          rightClickData:null,
          defaultExpandAll:true,
          icon:'el-icon-menu',
          contextMenuVisible:false,
          contextMenuTarget:null
        }
      },
      computed:{
        iconClass(){
          if (this.isExpand){
            return'el-icon-minus'
          }
          return 'el-icon-plus'
        },
        contextMenuTarget(){
          return this.$refs.headerButton
        }
      },
      created() {
        this.getAllBinds()
      },
      // mounted() {
      //   this.$nextTick(() => {
      //     // vue-context-menu 需要传入一个触发右键事件的元素，等页面 dom 渲染完毕后才可获取
      //     this.contextMenuTarget = document.querySelector('.')
      //     // 获取所有的 treeitem，循环监听右键事件
      //     const tree = document.querySelectorAll('#el-tree [role="treeitem"]')
      //     tree.forEach(i => {
      //       i.addEventListener('contextmenu',event => {
      //         // 如果右键了，则模拟点击这个treeitem
      //         event.target.click()
      //       })
      //     })
      //   })
      // },
      methods:{
        handleLeftNodeContextmenu(event,data,node,obj){
          this.contextMenuVisible = true
        },
        handleLeftNodeClick(data,node,obj){
          this.leftClickData  = Object.assign({},data)
         this.changeUnbindStatus(data)
        },
        handleRightNodeClick(data,node,obj){
          this.rightClickData  = Object.assign({},data)
          if (!data.hasOwnProperty("orgId")){
            if (this.leftClickData !== null){
              if (this.bindStatus){
                this.bindStatus = false
              }
            }
          }
          if (this.leftClickData === null){
            if (!this.bindStatus){
              this.bindStatus = true
            }
          }
        },
        handleBind(){
          //let orgIds = new Array()
          //this.findBindData(this.rightClickData,orgIds)
          bindNode(this.leftClickData.uuid,this.rightClickData.id).then(response => {
            this.getAllBinds()
            alert(response)
          }).catch(err => {
            alert(err)
          })
        },
        // findBindData(data,orgIds){
        //   if (Array.isArray(data)&&data.length>0){
        //     data.forEach(item => {
        //       if (item.icon !== 'el-icon-video-play'){
        //         orgIds.push(item.id)
        //       }
        //       if (item.hasOwnProperty("children") && item.children.length > 0) {
        //         this.findBindData(item.children,orgIds)
        //       }
        //     })
        //   }else {
        //     orgIds.push(data.id)
        //     if (data.hasOwnProperty("children") && data.children.length > 0) {
        //       this.findBindData(data.children,orgIds)
        //     }
        //   }
        //
        // },
        handleUnbind(){
         let item = this.findUnbindData(this.data2,this.leftClickData.deviceNodeId)
          debugger
          unbindNode(this.leftClickData.orgId,item.id).then(response => {
            alert(response)
            this.getAllBinds()
          }).catch(err => {
            alert(err)
          })
        },
        findUnbindData(data,id){
          for (let item of data) {
            if (item.id === id){
              return item
            }
            if (item.hasOwnProperty("children") && item.children.length > 0) {
              let model =  this.findUnbindData(item.children,id)
              if (typeof(model) !== "undefined"){
                return model
              }
            }
          }
        },
        handleProperty(){

        },
        handleDevice(){

        },
        //设置解绑按钮状态
        changeUnbindStatus(data){
          if (data.hasOwnProperty('orgId')){
            if (this.unBindStatus){
              this.unBindStatus = !this.unBindStatus
            }
            if (!this.bindStatus){
              this.bindStatus = true
            }
            this.rightClickData = []
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
            if (this.rightClickData !== null){
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
              // if (typeof(model) !== "undefined" && model !== null){
              //   return model
              // }
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
                if (item.hasOwnProperty("Subdirectory") && item.Subdirectory.length > 0){
                  item.Subdirectory.push(dd)
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
                    item='el-icon-date'
                  }
                }
              }
              if (item.hasOwnProperty("Subdirectory") && item.Subdirectory.length > 0){
                let sub = item.Subdirectory[0]
                if (!sub.hasOwnProperty('orgId')){
                  let model = this.traverseLeftTreeData(item.Subdirectory,bind,false)
                  if (typeof(model) !== "undefined" && model !== null){
                    return model
                  }
                }
              }
            }
          }
      }
    }
</script>

<style lang="scss" scoped>
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
</style>
