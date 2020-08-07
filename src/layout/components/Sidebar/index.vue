<template>
  <div :class="{'has-logo':showLogo}" @mouseover="hover = true" @mouseleave="hover = false">
    <div v-if="hover"  class="left-container" @click="handleOpenMenu">
      <el-button>
        <i v-if="isCollapse" class="el-icon-d-arrow-right"/>
        <i v-else class="el-icon-d-arrow-left"/>
      </el-button>

    </div>
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="scrollbar-container">
      <el-scrollbar wrap-class="scrollbar-wrapper" >
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </el-scrollbar>
    </div>
    <div v-if="!isCollapse" class="footer-container">
      系统版本：2.9.7.1-SNAPSHOT
    </div>
    <div v-if="!isCollapse" class="footer-container">
      版权所有：物联微电子有限公司
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  data(){
    return{
      hover:false,
    }
  },
  methods:{
    handleOpenMenu(){
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .left-container{
    width: 14px;
    height: calc(100% - 61px);
    background-color: #97a8be;
    position: absolute;
    left: #{$sideBarWidth};
    margin-left: -14px;
    z-index: 100;
    cursor: pointer;
    opacity: 0.5;

    .el-button{
      background-color: transparent;
      border-color: transparent;
      margin-left: -3px;
      padding-left: 0;
      color: white;
      margin-top:400px ;
    }
  }
  .scrollbar-container{
    height: calc(100% - 181px);
  }
  .footer-container{
    color: white;
    font-size: 13px;
    text-align: center;
    line-height: 20px;
  }

</style>
