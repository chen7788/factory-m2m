<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '95px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({expectedData, actualData} = {}) {
      this.chart.setOption({
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          show: false
        },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            radius:'100%',
            detail: {formatter: '{value}%',offsetCenter:[0,'70%'],color:'auto',fontSize: 14},
            data: [{value: 50, name: '完成率'}],
            axisLine:{
              show:false
            },
            splitLine:{
              show:false
            },
            axisTick:{
              show:true,
              length:'8',
              lineStyle:{
                color:'#edf'
              }
            },
            splitNumber:5,
            axisLabel:{
              show:false
            },
            pointer:{
              show:true,
              length:'70%',
              width:'8'
            },
            itemStyle:{
              show:false,
            },
            title:{
              offsetCenter:[0,'-40%'],
              color:'#333',
              fontStyle:'normal',
              fontSize:12
            }
          }
        ]
      })
    }
  }
}
</script>
