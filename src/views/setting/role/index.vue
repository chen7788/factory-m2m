<template>
  <div class="role-container">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="用户管理">
                <keep-alive>
                    <component :is="tab1Component"/>
                </keep-alive>
      </a-tab-pane>
      <a-tab-pane key="2" tab="配置管理" force-render>
                    <keep-alive>
                    <component :is="tab2Component"/>
                    </keep-alive>
      </a-tab-pane>
      <a-tab-pane key="3" tab="角色管理">
        Content of Tab Pane 3
      </a-tab-pane>
    </a-tabs>
<!--    <el-tabs v-model="tabsModel" @tab-click="handleClick">-->
<!--      <el-tab-pane label="用户管理" name="first">-->


<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="配置管理" name="second">-->




<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>-->
<!--    </el-tabs>-->
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
        if (this.tabsModel == '1'){
          return RoleInfo
        }else if (this.tabsModel == 'second'){
         return  PCPermission
        }
      },
      tab1Component(){
        return RoleInfo
      },
      tab2Component(){
        return PCPermission
      }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      },
    }
    }
</script>

<style lang="scss" scoped>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity 9s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
</style>
