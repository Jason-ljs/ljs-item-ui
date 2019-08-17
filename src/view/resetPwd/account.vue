<template>
  <div style="background-color: antiquewhite;width: 100%;height: 100%">

    <h1>Jason平台安全中心</h1>

    <el-steps :active="1" align-center style="margin-top: 100px">
      <el-step title="第一步" description="填写账号"></el-step>
      <el-step title="第二步" description="填写密码"></el-step>
      <el-step title="第三步" description="完成"></el-step>
    </el-steps>

    <div style="width: 500px;margin: 100px auto">
      <label style="font-size: 20px;color: orangered;display: block;margin-bottom: 20px">填写账号后会给您绑定的邮箱发一封验证邮件<br>请您确保绑定的邮箱正常可用！</label>
      <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="填写账号">
          <el-input v-model="account" placeholder="登录名/手机号/邮箱号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">确定</el-button>
          <el-button @click="account=''">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  export default {
    name: "account",
    data() {
      return {
        account: ""
      }
    },
    methods: {
      submitForm() {
        let map = {"account": this.account};
        this.$axios.post(this.domain.ssoserverpath + "sendMail", map).then((response) => {
          let sts = response.data.code;
          if (sts == 200) {
            window.sessionStorage.setItem("account", this.account)
            this.$router.push({path: '/reset_pwd'});
          } else {
            this.$notify.error({
              title: '错误',
              message: '此账号未在Jason平台注册！'
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
