<template>
    <div>

    <h1>assadsadsadsad</h1>

    </div>
</template>

<script>
    export default {
        name: "reset_pwd",
      data(){
          return{
            password:""
          }
      },
      methods:{
        resetPwd(){
          let code = window.localStorage.getItem("code");
          if (code != null || code != ""){
            let map = {
              "code":code,
              "password":this.password
            }
            this.$axios.post(this.domain.ssoserverpath+"resetPwd",map).then((response)=>{
              if(sts==200){
                window.sessionStorage.setItem("code","");
                let pp = 5;
                var timer=setInterval(()=>{
                  pp = pp - 1;
                  if(pp == 0){
                    clearInterval(timer);
                    this.$router.push({path:'/'});
                  }
                },1000);
                alert("密码更改成功，5秒后跳转到登录页面！")
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '验证码已过期，请重新申请！'
                });
              }
            })
          } else {
            alert("请先登录邮箱进行验证")
          }
        }
      },
      mounted() {
       console.log(this.$route.query.code)
        console.log(window.localStorage.getItem("code"))
        window.localStorage.setItem("code",this.$route.query.code);
      }
    }
</script>

<style scoped>

</style>
