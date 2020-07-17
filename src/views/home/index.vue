<template>
        <el-card>
            <el-col class="left-container">
                <el-row class="left-pieChart-container">
                    <el-col :span="12">
                        <div class="pieChart-wrapper">
                        <pie-chart/>
                        <el-button type="text">详情  》</el-button>
                    </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="raddarChart-wrapper">
                        <raddarChart/>
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
                <el-row>
                    <el-col>
                        <div class="guageChart-container">
                            <guage-chart/>
                        </div>
                    </el-col>
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
    components:{PieChart, RaddarChart, LineChart, GuageChart}
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
}
</style>
<style scope>
.left-container{
    width: 50%;
    height: 100%;
    position: relative;
}
.right-container{
    height: 100%;
    width: 50%;
    padding-left: 45px;
    float: right;
    position: relative;
}
.pieChart-wrapper{
    height: 250px;
    width: 100%;
    position: relative;
    float: left;
    text-align: center;
}
.pieChart-title{
   font-size: 16px;
   font-weight: bold;
}
.raddarChart-wrapper{
    height: 250px;
    width: 100%;
    position: relative;
    float: right;
    text-align: center;
}
.lineChart-container{
    margin-top: 10px;
}
.guageChart-container{
    height: 100px;
    width: 98px;
    background-color: antiquewhite;
}
</style>