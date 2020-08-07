<template>
  <div class="role-container">
    <el-tabs v-model="tabsModel" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <el-col :span="6">
          <div class="left-container">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"/>
          </div>
        </el-col>
       <el-col :span="18">
         <div class="right-container">
           dddd
         </div>
       </el-col>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    </el-tabs>

    </div>
</template>

<script>
  import { getTree, getTreeList} from "@/api/userManger";

  export default {
      data() {
        return {
          tabsModel: 'first',
          treeData: null,
          defaultProps: {
            children: 'Subdirectory',
            label: 'name'
          }
        };
      },
      created() {
          this.getTreeData()
      },
      methods: {
        handleClick(tab, event) {
          console.log(tab, event);
        },
        handleNodeClick(data){
          alert(data.id)
        },
        getTreeData(){
          getTree().then(response => {
            debugger
            let act = JSON.parse(response.result);
            this.treeData = act
          })
        }
      }
    }
</script>
<style lang="scss" scoped>
  .role-container{
    .el-col{
      height: calc(100vh - 104px);
    }
  }
</style>
<style scoped>
.role-container{
  margin: 10px;
  width: calc(100% - 20px);
  height: calc(100vh - 104px);
  overflow: hidden;
  position: relative;
  background-color:rgba(240,242,245,1);
}
.left-container{
  width: 100%;
  height: 100%;
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
</style>
