<template>
    <div class="craft-container">
      <div style="margin-top: 10px;height: 60px;margin-bottom: 30px">
        <div style="padding-top: 20px;padding-left: 20px">ddddd</div>
        <el-divider style="margin-bottom10px: 0;padding-top: 0"/>
      </div>
      <el-form :model="form" ref="form" label-width="100px" label-position="right" inline>
        <el-form-item label="工艺代码：">
          <el-input v-model="form.code" size="small" placeholder="请输入工艺代码"/>
        </el-form-item>
        <el-form-item label="工艺名称：">
          <el-input v-model="form.name" size="small" placeholder="请输入工艺代码"/>
        </el-form-item>
        <el-form-item label="投入站：">
          <span>下方工序流程图右键设置</span>
        </el-form-item>
        <el-form-item label="产出站：">
          <span>下方工序流程图右键设置</span>
        </el-form-item>
        <el-form-item class="desc-container" label="描述：">
          <el-input v-model="form.desc" :rows="2" type="textarea" placeholder="请输入描述(200字以内)"/>
        </el-form-item>
        <el-form-item class="desc-container"  label="有效：">
          <el-radio v-model="form.enable" label="1">是</el-radio>
          <el-radio v-model="form.enable" label="2">否</el-radio>
        </el-form-item>
        <el-form-item class="edit-container">
            <G6Editor mode="edit" width=800 :list-arr="list"/>
        </el-form-item>
        <el-form-item class="button-container">
          <el-button type="primary">确定</el-button>
          <el-button >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import G6Editor from '@/editor/components/G6Editor'
  import {baseProcess} from "@/api/craft";

  export default {
    comments:{G6Editor},
        data(){
          return {
            form:{
              code:'',
              name:'',
              desc:'',
              enable:1
            },
            editorWidth:window.innerWidth-500,
            list:[]
          }
        },
    created() {
      this.getList()
    },
    methods:{
      getList(){
        baseProcess().then(response => {
          let  arr = []
          response.result.data.forEach(item => {
            arr.push(item.processName)
          })
          this.list = arr
        })
      }
      }
    }
</script>

<style lang="scss" scoped>
.craft-container{
  padding-left: 30px;
  padding-right: 30px;
  background-color:rgba(240,242,245,1);
  .el-form-item{
    width: calc(100% / 2 - 20px);
    .el-input{
      min-width: 400px;
      display: inline-block;
    }
  }
  .desc-container{
    width: 100%;
    .el-textarea{
      min-width: 900px;
      display: inline-block;
    }
  }
  .edit-container{
    margin-left: 100px;
    min-height: 400px;
    width: 90%;
    border: #5a5e66 solid 0.5px;
  }
  .button-container{
    margin-left: 100px;
  }
}
</style>
