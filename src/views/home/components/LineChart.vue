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
      default: '300px'
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
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title:{
          text:'设备运行状态',
          left:'center',
          textStyle:{
            color:'#333',
            fontWeight:'bold',
            fontSize:'17'
          }
        },
        xAxis: {
        type: 'category',
        boundaryGap: false,
          nameTextStyle:{
          color:'rgb(51,51,51)'
          },
          splitLine:{
            color:'rgb(51,51,51)'
          },
          splitArea:{
          areaStyle: {
            color:['rgba(236,206,205,0.3)','rgba(200,200,200,0.3)']
          }
          },
          lineStyle:{
            color:'#666'
          },
        data: ['2020-07-14', '2020-07-15', '2020-07-16', '2020-07-17', '2020-07-18', '2020-07-19', '2020-07-20']
    },
        axisLabel:{
          color:'rgb(51,51,51)'
        },
    yAxis: {
        type: 'value',
    },
        grid: {
          left: 40,
          right: 40,
          bottom: 20,
          top: 65,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        toolbox: {
        show: true,
        feature: {
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        },
          iconStyle:{
            borderColor:'rgb(133,133,133)'
          }
    },
        series: [
        {
            name: '平均值',
            type: 'line',
            data: [100, 100, 100, 50, 100, 100, 100],
            areaStyle:{},
            markPoint: {
                data: [
                    {type: 'max', name: ''}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        }
    ]
      })
    }
  }
}
</script>
