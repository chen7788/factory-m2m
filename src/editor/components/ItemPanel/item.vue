<template>
  <ul>
    <li
      v-for="(item,index) in list"
      :key="index"
      class="getItem"
      :data-shape="item.shape"
      :data-type="item.type"
      :data-size="item.size"
      draggable
      @dragstart="handleDragstart"
      @dragend="handleDragEnd($event,item)"
    >
      <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
      {{item.name}}
    </li>
  </ul>
</template>

<script>
import eventBus from "@/editor/utils/eventBus";
import okSvg from "@/editor/assets/icons/ok.svg";
import bgImg from "@/editor/assets/bg.jpg";
export default {
  props:{
    listArr:{
      type:Array,
      default: new Array()
    }
  },
  computed:{
    list(){
      let count = 3
      let arr = []
      if (this.listArr.length>0){
        this.listArr.forEach(item => {
          let obj = new Object()
          obj.name = item
          obj.label = item
          obj.size = "170*34"
          obj.type = 'node'
          obj.x = 0
          obj.y = 0
          obj.shape = 'customNode'
          obj.color = '#1890f'
          obj.image = 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg'
          obj.stateImage = okSvg
          obj.inPoints = [[0, 0.5]]
          obj.outPoints = [[1, 0.5]]
          arr.push(obj)
        })
      }else {
        for (let i = 0; i < count; i++) {
          let obj = new Object()
          obj.name = '测试节点'
          obj.label = '测试节点'
          obj.size = "170*34"
          obj.type = 'node'
          obj.x = 0
          obj.y = 0
          obj.shape = 'customNode'
          obj.color = '#1890f'
          obj.image = 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg'
          obj.stateImage = okSvg
          obj.inPoints = [[0, 0.5],[1, 0.4], [1, 0.6]]
          obj.outPoints = [[1, 0.4], [1, 0.6],[0, 0.5]]
          obj.isDoingStart = true
          arr.push(obj)
        }
      }
      console.log(arr)
      return arr
    }
  },
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
    };
  },
  created() {
    this.bindEvent();
    console.log(this.list)
  },
  methods: {
    handleDragstart(e) {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    handleDragEnd(e, item) {
      let data = {};
      Object.assign(data, item);
      data.offsetX = this.offsetX;
      data.offsetY = this.offsetY;
      if (this.page) {
        const graph = this.page.graph;
        // const size = e.target.dataset.size.split("*");
        const xy = graph.getPointByClient(e.x, e.y);
        data.x = xy.x;
        data.y = xy.y;
        data.size = item.size.split("*");
        data.type = "node";
        this.command.executeCommand("add", [data]);
      }
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
        this.command = page.command;
      });
    }
  }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
.itempannel ul {
  padding: 0px;
  padding-left: 16px;
}
.itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 160px;
  height: 28px;
  line-height: 26px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
