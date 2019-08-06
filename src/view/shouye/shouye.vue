<template>
  <div style="width:100%;height: 100%;">
    <el-container style="height: 100%" direction="vertical">
      <el-header style="font-size: 12px;text-align: left">
        <span style="font-size:25px;margin-right:60%;">
            信息平台
            <el-tooltip ref="tip" class="item" effect="dark"  placement="top-start" v-bind:content="mycontent">
              <i class="el-icon-menu" @click="openParentClose()"></i>
            </el-tooltip>

          <!-- 提示音 -->
            <audio id="yiliuyan" src="../../static/tishi/yiliuyan.mp3"> </audio>
            <audio id="en" src="../../static/tishi/en.mp3"> </audio>
            <audio id="tishiyin" src="../../static/tishi/tishiyin.mp3"> </audio>
            <audio id="aiya" src="../../static/tishi/aiya.mp3"> </audio>
            <audio id="dahuaxiyou" src="../../static/tishi/dahuaxiyou.mp3"> </audio>


        </span>

        <el-avatar src="http://127.0.0.1:8090/icon.png" style="float: right;margin-top: 10px;margin-left: 5px"></el-avatar>
        <div style="float:right">
          <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">首页</el-dropdown-item>
              <el-dropdown-item command="a">查看</el-dropdown-item>
              <el-dropdown-item command="b">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span ref="userinfo_username">{{userInfo.userName}}</span>
          <input ref="userinfo_userid" type="hidden" v-model="userInfo.id">

        </div>
      </el-header>

      <el-container>
        <!-- 左侧的菜单 -->
        <mymenu  ref="iiii" v-on:ee="updatePro"></mymenu>
        <!-- 右侧的主显示区域 -->
        <mymain style="padding:0px"></mymain>

      </el-container>
    </el-container>

    <el-dialog
      title="当前用户信息"
      :visible.sync="dialog1Visible"
      width="40%"
    >
      <img src="http://127.0.0.1:8090/icon.png" width="150px">
      <el-form  :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="用户名:">{{userInfo.userName}}</el-form-item><br>
        <el-form-item label="登录名:">{{userInfo.loginName}}</el-form-item><br>
        <el-form-item label="性别:" v-if="userInfo.sex===1">男</el-form-item>
        <el-form-item label="性别:" v-if="userInfo.sex===2">女</el-form-item>
        <br>
        <el-form-item label="电话:">{{userInfo.tel}}</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import mymenu from './datamenu.vue'
  import mymain from './datamain.vue'

  const userinfo={};

  export default {

    data(){
      return{
        mycontent:"点击打开菜单",
        dialogVisible: false,
        dialog1Visible: false,
        userInfo:{}
      }
    },
    components:{mymenu,mymain},
    name: "shouye",
    methods:{
      openParentClose(){
        //调用子组件menu中的openClose()
        this.$refs.iiii.openClose();
      },
      updatePro(uu){
        if(uu){
          this.$data.content="点击打开菜单";
        }else{
          this.$data.content="点击关闭菜单";
        }
      },
      handleCommand(command){

        if(command=="b"){//退出操作

          if(confirm("确定登出？")){
            this.$axios.post(this.domain.ssoserverpath+"loginout",this.userInfo.id).then((response)=>{
              let sts=response.data.success;
              if(sts=="ok"){
                //清除session中的所有值
                window.sessionStorage.clear();
                this.$router.push({path:'/'});
              }
            })
          }

        }else if(command=="a"){
          console.log(this.userInfo)
          this.dialog1Visible=true;
        }else if(command=="c"){
          this.$router.push({path:"/system"})
          this.playAudio("dahuaxiyou","dahuaxiyou");
        }
      }
    },
    mounted(){

      this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));


      //登录之后提示
      this.playAudio("yiliuyan","yiliuyan");

    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height:60px;

  }

  .el-aside {
    color: #333;
    height: 100%;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
