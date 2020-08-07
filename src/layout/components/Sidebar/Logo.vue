<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div class="logo-container">
        <img src="@/assets/images/logo.png" alt="logo" :width="imgWidth+'%'">
      </div>
    </transition>
    <div v-if="!collapse" class="title-container">
      智能工厂系统
    </div>
  </div>
</template>

<script>

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed:{
    imgWidth(){
      if (this.collapse){
        return 70
      }
      return 100
    }
  },
  data() {
    return {
      title: 'Vue Admin Template',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 120px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  .logo-container{
    margin: 16px 16px 0;
    height: 54px;
  }
  .title-container{
    color: #1482f0;
    font-size: 24px;
    text-align: center;
    font-weight: bold;
  }

  &.collapse {
.logo-container{
  margin: 0;
}
  }

}
</style>
