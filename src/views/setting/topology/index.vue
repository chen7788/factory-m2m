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
            @node-click="handleNodeClick"
            style="width: 100%;"/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div align="center" style="margin-top: 100px">
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
    export default {
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
          }
        }
      },
      created() {
        this.getLeftTreeData(),
          this.getRightTreeData()
      },
      methods:{
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
            this.data = this.treeData
          })
        },
          findNode(data,bind){
          let  arr = []
            for (let item of data){
              if (item.uuid === bind.orgId){
                let dd = Object.assign({},bind)
                dd['propertytyName'] = dd.deviceMacAddress
                arr.push(dd)
                item['Subdirectory'] = arr
                break
              }else {
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
  .potology-container{
    .el-card{
      margin-top: 5px;
      height: 100%;
    }
  }

</style>
