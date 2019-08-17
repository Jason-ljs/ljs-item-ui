<template>
  <div style="background-color: antiquewhite;width: 100%;height: 100%">

    <h1>Jason平台安全中心</h1>

    <el-steps :active="3" align-center style="margin: 100px auto">
      <el-step title="第一步" description="填写账号"></el-step>
      <el-step title="第二步" description="填写密码"></el-step>
      <el-step title="第三步" description="完成"></el-step>
    </el-steps>

      <label style="font-size: 20px;color: orangered;">{{textContent}}</label>

  </div>
</template>

<script>
    export default {
        name: "reset_success",
      data(){
          return{
            textContent:"",
          }
      },
      mounted() {
        let pp = 5;
        var timer=setInterval(()=>{
          this.textContent = "密码更改成功，"+pp+"秒后跳转到登录页面！"
          pp = pp - 1;
          if(pp == -1){
            clearInterval(timer);
            window.localStorage.removeItem("code");
            this.$router.push({path:'/'});
          }
        },1000);
      }
    }
</script>

<style scoped>

</style>
