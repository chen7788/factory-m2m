<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor" >
      <context-menu />
      <!--toolbar-->
      <toolbar />
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel  :list-arr="listArr"/>
        <!--detailpannel-->
        <detail-panel />
        <!--miniMap-->
        <minimap />
        <!--page-->
        <page :height="height" :width="width"  :data="data" />
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from "../Toolbar";
import ItemPanel from "../ItemPanel";
import DetailPanel from "../DetailPanel";
import Minimap from "../Minimap";
import Page from "../Page";
import Flow from "../Flow"
import ContextMenu from "../ContextMenu";
import Editor from "@/editor/components/Base/Editor";
import command from "@/editor/command";
export default {
  name: "G6Editor",
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    Page,
    ContextMenu,
    Flow
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {}
    },
      listArr:{
        type:Array,
        default: new Array()
      }
  },
  created() {
    this.init();
  },
  data() {
    return {
      editor: {},
      command: null
    };
  },
  mounted() {
    window.onresize = function windowResize () {
      // 通过捕获系统的onresize事件触发我们需要执行的事件
      this.width = (window.innerWidth - 500)
    }
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    }
  }
};
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.bottom-container {
  position: relative;
}
</style>
