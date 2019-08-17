<template>
    <div style="background-color: antiquewhite;width: 100%;height: 100%">

      <h1 style="margin-bottom: 30px">Jason平台安全中心</h1>

      <el-steps :active="2" align-center style="margin-top: 100px">
        <el-step title="第一步" description="填写账号"></el-step>
        <el-step title="第二步" description="填写密码"></el-step>
        <el-step title="第三步" description="完成"></el-step>
      </el-steps>

      <div style="width: 500px;margin: 100px auto">
        <label style="font-size: 20px;color: orangered;display: block;margin-bottom: 20px">修改密码，您所填入的新密码将作为您新的登录密码</label>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" placeholder="请输入确认密码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
</template>

<script>
    export default {
        name: "reset_pwd",

      data(){
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
          return{
            ruleForm: {
              pass: '',
              checkPass: '',
              age: ''
            },
            rules: {
              pass: [
                { validator: validatePass, trigger: 'blur' }
              ],
              checkPass: [
                { validator: validatePass2, trigger: 'blur' }
              ]
            }
          }
      },
      methods:{
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let code = localStorage.getItem("code");
              console.log(code)
              if (code == "500"){
                this.$notify.error({
                  title: '错误',
                  message: '请先登录邮箱进行验证！'
                });
              } else {
                let map = {
                  "code":code,
                  "password":this.ruleForm.pass
                }
                this.$axios.post(this.domain.ssoserverpath+"resetPwd",map).then((response)=>{
                  let sts = response.data.code;
                  if(sts==200){
                    this.$router.push("/reset_success");
                  } else {
                    this.$notify.error({
                      title: '错误',
                      message: '验证码已过期，请重新申请！'
                    });
                  }
                })
              }
            } else {
              this.$notify.error({
                title: '错误',
                message: '您的输入有误，请按要求填写！'
              });
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      },
      mounted() {
        if(typeof(this.$route.query.code) == "undefined"){
          window.localStorage.setItem("code","500");
        }else {
          window.localStorage.setItem("code",this.$route.query.code);
        }
      }
    }
</script>

<style scoped>

</style>
