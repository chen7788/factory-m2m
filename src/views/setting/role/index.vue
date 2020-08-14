<template>
  <div class="role-container">
    <el-tabs v-model="tabsModel" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <keep-alive>
          <component :is="currentTabComponent"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <keep-alive>
          <component :is="currentTabComponent"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    </el-tabs>

    </div>
</template>

<script>
  import RoleInfo from './roleInfo'
  import PCPermission from "./PCPermission";
  export default {
    components:{
      RoleInfo,
      PCPermission
    },
    data(){
      return {
        tabsModel: 'first',
      }
    },
    computed:{
      currentTabComponent(){
        if (this.tabsModel == 'first'){
          return RoleInfo
        }else if (this.tabsModel == 'second'){
         return  PCPermission
        }
      }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      },
    }
    }
</script>

<style scoped>

</style>
