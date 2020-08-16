<template>
    <div class="potology-container">
      <el-col :span="9">
        <el-card shadow="never" >
          <div slot="header">
            <span>物业管理</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <el-tree class="el-tree-container"
            v-loading="leftLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.001)"
            node-key="id"
            ref="tree"
            :empty-text="dataText"
            :data="data"
            :props="defaultProps"
            default-expand-all
            highlight-current=true
            :expand-on-click-node="false"
                   :icon-class="iconClass"
            @node-click="handleNodeClick"
                   @node-expand="handleNodeExpand"
                   @node-collapse="handleNodeCollapse"
                   @check-change="handleCheckChange"
            style="width: 100%;">
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
                <i :class="data.icon"></i>{{ node.label }}
            </span>
        </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div align="center" style="margin-top: 200px">
          <el-button type="primary">绑定</el-button>
        </div>
        <div align="center" style="margin-top: 100px">
          <el-button type="primary">解绑</el-button>
        </div>
        <div align="center" style="margin-top: 100px">
          <el-button type="primary">物业关联</el-button>
        </div>
        <div align="center" style="margin-top: 100px">
          <el-button type="primary">设备关联</el-button>
        </div>
      </el-col>
      <el-col :span="9">
        <el-card shadow="never">
          <div slot="header">
            <span>设备管理</span>
          </div>
          <el-tree class="el-tree-container"
            v-loading="rightLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.001)"
            :empty-text="dataText"
            :data="data2"
            :props="defaultProps2"
            default-expand-all
            highlight-current=true
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            style="width: 100%;">
          </el-tree>
        </el-card>
      </el-col>
    </div>
</template>

<script>
  import { leftTreeData, deviceTreeData, allBinds } from '@/api/topology'
  import ScrollPane from "@/layout/components/TagsView/ScrollPane";
    export default {
      components: {ScrollPane},
      data(){
        return{
          leftLoading:true,
          rightLoading:true,
          data:null,
          data2:null,
          treeData:[],
          defaultProps: {
            children: 'Subdirectory',
            label: 'propertytyName'
          },
          defaultProps2: {
            children: 'children',
            label: 'macAddress'
          },
          isExpand:true
        }
      },
      computed:{
        iconClass(){
          if (this.isExpand){
            return'el-icon-circle-plus-outline'
          }
          return 'el-icon-remove-outline'
        }
      },
      created() {
        this.getLeftTreeData(),
          this.getRightTreeData()
      },
      methods:{
        handleCheckChange(data, checked, node){
          alert(checked)
        },
        handleNodeClick(){

        },
        handleNodeExpand(){
          this.isExpand = true
        },
        handleNodeCollapse(){
          this.isExpand = false
        },
        getLeftTreeData(){
          leftTreeData().then(response => {
            this.leftLoading = false
            let result = JSON.parse(response.result)
            this.treeData = result
            this.getAllBinds()
          })
        },
        getRightTreeData(){
          deviceTreeData().then(response => {
            this.rightLoading = false
            this.data2 = response.result
          })
        },
        getAllBinds(){
          allBinds().then(response => {
              let result = response.result
            result.forEach(item => {
              this.findNode(this.treeData,item)
            })
            console.log(this.treeData)
            this.data = this.treeData
          })
        },
          findNode(data,bind){

            for (let item of data){
              let  arr = []
              if (item.uuid === bind.orgId){
                let dd = Object.assign({},bind)
                dd['propertytyName'] = dd.deviceMacAddress
                dd['icon']='el-icon-caret-right'
                arr.push(dd)
                item['Subdirectory'] = arr
              }else {
                item['icon']='el-icon-s-operation'
                if (item.hasOwnProperty("Subdirectory") && item.Subdirectory.length > 0){
                  let model = this.findNode(item.Subdirectory,bind)
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
  .el-tree-container{
    height: calc(100vh - 190px);
    overflow-y: scroll;
  }
  .custom-tree-node{
    padding-left: 10px;
    padding-top: 2px;
    .span{
      font-size: 15px;
    }
  }
  .el-icon-reading{
    padding-right: 10px;
  }
  /*::v-deep {*/
  /*  .el-tree-node__expand-icon.expanded {*/
  /*    // 动画取消*/
  /*    -webkit-transform: rotate(0deg);*/
  /*    transform: rotate(0deg);*/
  /*  }*/

  /*  .el-icon-caret-right:before {*/
  /*    // 收起*/
  /*    content: '+';*/
  /*    padding-left: 1px;*/
  /*    display: inline-block;*/
  /*    margin-right: 3px;*/
  /*    width: 16px;*/
  /*    height: 16px;*/
  /*    line-height: 12px;*/
  /*    font-size: 16px;*/
  /*    //border: 1px solid #999999;*/
  /*  }*/

  /*  .el-tree-node__expand-icon.expanded:before {*/
  /*    // 展开*/
  /*    content: '-';*/
  /*    padding-left: 3px;*/
  /*    display: inline-block;*/
  /*    width: 16px;*/
  /*    height: 16px;*/
  /*    margin-right: 3px;*/
  /*    line-height: 10px;*/
  /*    font-size: 18px;*/
  /*    //border: 1px solid #999999;*/
  /*  }*/
  /*}*/
  .potology-container{
    .el-card{
      margin-top: 5px;
      height: 100%;
    }
  }

</style>
