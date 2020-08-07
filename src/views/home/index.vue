<template>
        <el-card>
            <el-col class="home-left-container">
                <el-row class="left-pieChart-container">
                    <el-col :span="12">
                        <div class="pieChart-wrapper">
                        <pie-chart/>
                        <el-button type="text">详情  》</el-button>
                    </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="raddarChart-wrapper">
                        <raddar-chart/>
                    </div>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="lineChart-container">
                        <line-chart/>
                    </div>
                </el-row>
                <el-row>
                    <div class="lineChart-container">
                        <line-chart/>
                    </div>
                </el-row>
            </el-col>
            <el-col class="right-container">
                <el-row class="right-guageChart-container">
                  <el-col :span="3" class="utilization-title-container">
                      <div class="utilization-title">设备利用率</div>
                  </el-col>
                    <el-col :span="5">
                            <guage-chart/>
                    </el-col>
                  <el-col :span="5">
                      <guage-chart/>
                  </el-col>
                  <el-col :span="5">
                      <guage-chart/>
                  </el-col>
                  <el-col :span="5" class="qualified-container">
                    <el-row>
                      合格率(%)
                    </el-row>
                    <el-row class="qualified-value">
                      0
                    </el-row>
                  </el-col>
                </el-row>
              <el-row class="right-title-container">
                <el-col :span="4">
                  <el-row class="right-title-value">
                    15
                  </el-row>
                  <el-row class="right-title">
                    生产预警
                  </el-row>
                </el-col>

                <el-col class="divider-container"></el-col>

                <el-col :span="4">
                  <el-row class="right-title-value">
                    15
                  </el-row>
                  <el-row class="right-title">
                    生产预警
                  </el-row>
                </el-col>
                <el-col class="divider-container"></el-col>
                <el-col :span="4">
                  <el-row class="right-title-value">
                    15
                  </el-row>
                  <el-row class="right-title">
                    生产预警
                  </el-row>
                </el-col>
                <el-col class="divider-container"></el-col>
                <el-col :span="4">
                  <el-row class="right-title-value">
                    15
                  </el-row>
                  <el-row class="right-title">
                    生产预警
                  </el-row>
                </el-col>
                <el-col class="divider-container"></el-col>
                <el-col :span="4">
                  <el-row class="right-title-value">
                    15
                  </el-row>
                  <el-row class="right-title">
                    生产预警
                  </el-row>
                </el-col>
              </el-row>
              <div class="divider-horizontal"></div>
              <el-table :data="tableData" style="height: 275px;width: 90%;margin-left: 10px;position: relative;margin-top: 10px" class="right-table-container">
                <el-table-column>
                  <template #default="scope">
                    <i class="el-icon-info"/>
                    <span style="margin-left: 10px">{{ scope.row.value}}</span>
                  </template>
                </el-table-column>

              </el-table>
              <el-row>
                <div class="right-lineChart-container">
                  <line-chart/>
                </div>
              </el-row>
            </el-col>
        </el-card>
</template>
<script>
import PieChart from './components/PieChart'
import RaddarChart from './components/RaddarChart'
import LineChart from './components/LineChart'
import GuageChart from './components/GuageChart'

export default {
    components:{PieChart, RaddarChart, LineChart, GuageChart},
  data(){
      return{
        tableData:[
          {
          value:'4444'
        },
          {
            value:'4444'
          },
          {
            value:'4444'
          },
          {
            value:'4444'
          },{
            value:'4444'
          },
          {
            value:'4444'
          }
        ]
      }
  }
}
</script>
<style lang="scss">
.el-card{
    width: 100%;
    height: 100%;
    position: relative;
    .el-card__body{
        padding: 20px;
        height: 100%;
    }
    .el-button{
        color: crimson;
        padding: 0;
        margin: 0;
    }
  .right-table-container{
    .el-table__header-wrapper{
      height: 0;
    }
    .el-table__body-wrapper{
      height: 275px;
      overflow-y: scroll;
    }

  }
}
</style>
<style scope>
.home-left-container{
    width: 50%;
    height: 100%;
    position: relative;
}
.right-container{
    height: 100%;
    width: 50%;
    padding-left: 20px;
    float: right;
    position: relative;
}
.right-guageChart-container{
  height: 98px;
  margin: 20px 0;
}
.pieChart-wrapper{
    height: 250px;
    width: 100%;
    position: relative;
    float: left;
    text-align: center;
}
.raddarChart-wrapper{
    height: 240px;
    width: 100%;
    position: relative;
    float: right;
    text-align: center;
}
.lineChart-container{
    margin-top: 10px;
}
.utilization-title-container{
  text-align: center;
}
  .utilization-title{
    width: 20px;
    height: 100%;
    margin: 0 auto;
    line-height: 18px;
    overflow: hidden;
    font-size: 15px;
  }
  .qualified-container{
    height: 100%;
    padding-top: 15px;
    text-align: center;
  }
  .qualified-value{
    margin-top: 20px;
    font-size: 20px;
    color: blueviolet;
  }
  .right-title-container{
    height: 78px;
    text-align: center;
  }
  .right-title-value{
    margin-top: 10px;
    font-size: 22px;
    color: blueviolet;
  }
  .right-title{
    font-size: 15px;
    margin-top: 20px;
    margin-left: 5px;
  }
  .divider-container{
    width: 1px;
    height: 100%;
    background-color: #5a5e66;
    margin-left: 10px;
    margin-right: 1px;
  }
  .divider-horizontal{
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    width: 85%;
    height: 1px;
    background-color: #5a5e66;
  }
.right-lineChart-container{
  margin-top: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}
</style>
