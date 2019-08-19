<template>
  <div class="login-wrap" :style="divimg" >

    <div>
      <p class="p-title">Jason我爱编码,欢迎点评</p>
    </div>
    <div class="ms-login">
      <div class="ms-title">
        欢迎使用
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="账密登录">

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input type="password" placeholder="请输入认证密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
              </el-input>
            </el-form-item>

            <el-form-item prop="code">
              <div class="form-inline-input">
                <div class="code-box" id="code-box">
                  <input ref="coderef" type="text" name="code" class="code-input" />
                  <p></p>
                  <span style="color:#909399">
                     拖动验证
                  </span>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="checked"><span style="color: blueviolet">七天内免登录</span></el-checkbox>
            </el-form-item>


            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <a href="https://localhost:8080/account">忘记密码</a>
            </div>
            <!-- 登录进度 -->
            <el-progress ref="jindu" :style="jindustyle"  :text-inside="true"
                         :stroke-width="18"
                         :percentage="percent"
                         status="success"></el-progress>

          </el-form>

        </el-tab-pane>
        <el-tab-pane label="短信登录">

          <el-form :model="ruleForm" :rules="smsForm" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item>
              <el-input v-model="smsForm.phoneNumber" placeholder="手机号">
                <el-button slot="prepend" icon="el-icon-phone"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入短信验证码" v-model="smsForm.code">
                <el-button slot="prepend" @click="getSmsCode" :disabled="ddStatus">{{testContent}}</el-button>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="checked"><span style="color: blueviolet">七天内免登录</span></el-checkbox>
            </el-form-item>


            <div class="login-btn">
              <el-button type="primary" @click="submitSmsForm()">登录</el-button>
            </div>

          </el-form>

        </el-tab-pane>
      </el-tabs>
    </div>



  </div>
</template>

<script>
  import {delCookie, getCookie, setCookie} from "../../utils/util";

  export default {
    name: "login",
    data(){
      return{
        totalTime: 60,
        testContent:"获取验证码",
        ddStatus:false,
        checked:false,
        divimg:{//背景图片的使用
          backgroundImage:"url(" + require('../../assets/timg.jpg') + ")",
          backgroundRepeat: "no-repeat",
          height:"100%",
          width:"100%",
          overflow:"hidden",
          backgroundSize:"cover"
        },
        percent:0,
        jindustyle:{
          display:'none'
        },
        smsForm:{
          phoneNumber:"19833151556",
          code:""
        },
        ruleForm: {
          username:'zhangsan',
          password:'123456'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      submitSmsForm(){
        //短信验证码登录
        let par={
          "phoneNumber":this.smsForm.phoneNumber,
          "code":this.smsForm.code
        };
        if(this.smsForm.phoneNumber==""||this.smsForm.phoneNumber==null){
          this.$notify.info({
            title: '提示',
            message: '请填写手机号'
          });
          return;
        }
        if(this.smsForm.code==""||this.smsForm.code==null){
          this.$notify.info({
            title: '提示',
            message: '请填写验证码'
          });
          return;
        }
        // par.code=this.$refs.coderef.value;
        //转JSON串
        //let canshu=this.toAes.encrypt(JSON.stringify(par));
        // let params={canshu:canshu};
        //let qs=require("qs");
        //打开登陆进度条
        this.$data.jindustyle.display='block';
        //每0.1秒更新一下进度
        var timer=setInterval(()=>{
          let pp=this.$data.percent+10;
          if(pp>=100){
            pp=99;
          }
          this.$data.percent=pp;
        },100)
        //从cookie中取出某一个名称的Cookie的值
        par.codekey=this.Cookies.get("authcode")
        this.$axios.post(this.domain.ssoserverpath+"smsLogin",par).then((response)=>{
          if(response.data.code==200){
            //存储token到vuex中，token
            if(this.checked){
              setCookie("jian","zhi",7);
            }
            window.localStorage.setItem("token",response.data.token);
            window.localStorage.setItem("userInfo",[JSON.stringify(response.data.result)]);
            //关闭加载窗
            this.$data.percent=100
            //隐藏进度条
            this.$data.jindustyle.display='none'
            //关闭定时
            clearInterval(timer)

            //跳转到首页界面
            //将用户ID存入到全局的VUE对象中

            this.$router.push({path:'/view/shouye/shouye',query:{username:response.data.result.userName,userid:response.data.result.id}});

          }else if(respo.data.error!=null){
            //关闭加载窗
            this.$data.percent=100
            //隐藏进度条
            this.$data.jindustyle.display='none'
            //关闭定时
            clearInterval(timer)
            this.$notify.error({
              title: '提示',
              duration:1000,
              message: respo.error
            });
          }

        }).catch((error)=>{
          //关闭加载窗
          this.$data.percent=100;
          //隐藏进度条
          this.$data.jindustyle.display='none';
          //关闭定时
          clearInterval(timer);
          this.$notify.error({
            title: '错误',
            message: '出错了~_~，请联系管理员！'
          });
        })
      },
      getSmsCode(){
        if(this.smsForm.phoneNumber==""||this.smsForm.phoneNumber==null){
          this.$notify.info({
            title: '提示',
            message: '请填写手机号'
          });
          return;
        }
        //获取短信验证码
        var _this = this;
        var code = "";
        let map ={"phoneNumber":this.smsForm.phoneNumber}
        this.$axios.post(this.domain.ssoserverpath+'getSmsCode',map).then((response)=>{
          console.log(response.data.result)
          if(response.data.code==200){
            code=response.data.result;
            //向浏览器写一个Cookie
            document.cookie = 'testCookies' + "=" + response.data.token + "; " + -1;
            _this.moveCode(code,_this);
            //验证码倒计时
            let clock = window.setInterval(() => {
              this.totalTime--;
              this.testContent = this.totalTime + 's后重新发送'
              this.ddStatus = true;
              if (this.totalTime < 0) {     //当倒计时小于0时清除定时器
                window.clearInterval(clock)
                this.testContent = '重新发送验证码'
                this.totalTime = 60
                this.ddStatus = false;
              }
            },1000)
          }else{
            this.$notify.info({
              title: '提示',
              message: response.data.error
            });
          }
        })
      },
      submitForm(ruleid){
        let code=this.$refs.coderef.value;
        if(code==null||code==""){
          const h = this.$createElement;
          this.$notify({
            title: '提示信息：',
            message: h('i', { style: 'font-style:normal'}, '请进行拖动校验！'),
            type: 'warning',
            duration:1500 //延时时间
          });
        }else{
          //登陆操作
          let par={};
          par.loginname=this.ruleForm.username;
          par.password=this.ruleForm.password;
          if(this.ruleForm.username==""||this.ruleForm.username==null){
            this.$notify.info({
              title: '提示',
              message: '请填写用户名'
            });
            return;
          }
          if(this.ruleForm.password==""||this.ruleForm.password==null){
            this.$notify.info({
              title: '提示',
              message: '请填写密码'
            });
            return;
          }
          par.code=this.$refs.coderef.value;
          //转JSON串
          //let canshu=this.toAes.encrypt(JSON.stringify(par));
         // let params={canshu:canshu};
          //let qs=require("qs");
          //打开登陆进度条
          this.$data.jindustyle.display='block';
          //每0.1秒更新一下进度
          var timer=setInterval(()=>{
            let pp=this.$data.percent+10;
            if(pp>=100){
              pp=99;
            }
            this.$data.percent=pp;
          },100)
          //从cookie中取出某一个名称的Cookie的值
          par.codekey=this.Cookies.get("authcode")
          this.$axios.post(this.domain.ssoserverpath+"login",par).then((response)=>{
            if(response.data.code==200){
              //存储token到vuex中，token
              if(this.checked){
                setCookie("jian","zhi",7);
              }
              window.localStorage.setItem("token",response.data.token);
              window.localStorage.setItem("userInfo",[JSON.stringify(response.data.result)]);
              //关闭加载窗
              this.$data.percent=100
              //隐藏进度条
              this.$data.jindustyle.display='none'
              //关闭定时
              clearInterval(timer)

              //跳转到首页界面
              //将用户ID存入到全局的VUE对象中

              this.$router.push({path:'/view/shouye/shouye',query:{username:response.data.result.userName,userid:response.data.result.id}});

            }else if(respo.error!=null){
              //关闭加载窗
              this.$data.percent=100
              //隐藏进度条
              this.$data.jindustyle.display='none'
              //关闭定时
              clearInterval(timer)
              this.$notify.error({
                title: '提示',
                duration:1000,
                message: respo.error
              });
            }

          }).catch((error)=>{
            //关闭加载窗
            this.$data.percent=100;
            //隐藏进度条
            this.$data.jindustyle.display='none';
            //关闭定时
            clearInterval(timer);
            this.$notify.error({
              title: '错误',
              message: '出错了~_~，请联系管理员！'
            });
          })


        }

      },
      //拖动验证start
      getOffset(box,direction){
        var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
        var offset = box[setDirection];
        var parentBox = box.offsetParent;
        while(parentBox){
          offset+=parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      },
      moveCode(code,_this){
        var fn = {codeVluae : code};
        var box = document.querySelector("#code-box"),
          progress = box.querySelector("p"),
          codeInput = box.querySelector('.code-input'),
          evenBox = box.querySelector("span");
        //默认事件
        var boxEven = ['mousedown','mousemove','mouseup'];
        //改变手机端与pc事件类型
        if(typeof document.ontouchstart == 'object'){
          boxEven = ['touchstart','touchmove','touchend'];
        }
        var goX,offsetLeft,deviation,evenWidth,endX;
        function moveFn(e){
          e.preventDefault();
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          endX = e.clientX - goX;
          endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
          if(endX > evenWidth * 0.7){
            progress.innerText = '松开验证';
            progress.style.backgroundColor = "#66CC66";
          }else{
            progress.innerText = '';
            progress.style.backgroundColor = "#FFFF99";
          }
          progress.style.width = endX+deviation+'px';
          evenBox.style.left = endX+'px';
        }
        function removeFn() {
          document.removeEventListener(boxEven['2'],removeFn,false);
          document.removeEventListener(boxEven['1'],moveFn,false);
          if(endX > evenWidth * 0.8){
            progress.innerText = '验证成功';
            progress.style.width = evenWidth+deviation+'px';
            evenBox.style.left = evenWidth+'px'
            codeInput.value = fn.codeVluae;
            evenBox.onmousedown = null;
            _this.ruleForm.verification = true;

            //alert( codeInput.value);

          }else{
            progress.style.width = '0px';
            evenBox.style.left = '0px';
          }
        };
        function getOffset(box,direction){
          var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
          var offset = box[setDirection];
          var parentBox = box.offsetParent;
          while(parentBox){
            offset+=parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        };
        evenBox.addEventListener(boxEven['0'], function(e) {
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          goX = e.clientX,
            offsetLeft = getOffset(box,'left'),
            deviation = this.clientWidth,
            evenWidth = box.clientWidth - deviation,
            endX;
          document.addEventListener(boxEven['1'],moveFn,false);
          document.addEventListener(boxEven['2'],removeFn,false);
        },false);
        fn.setCode = function(code){
          if(code)
            fn.codeVluae = code;
        }
        fn.getCode = function(){
          return fn.codeVluae;
        }
        fn.resetCode = function(){
          alert("====")
          evenBox.removeAttribute('style');
          progress.removeAttribute('style');
          codeInput.value = '';
        };
        return fn;
      }//拖动验证end
    },
    mounted(){
      //七天内免登录
      if(getCookie("jian")){
        this.$router.push({path:'/system'});
      }else{
        var _this = this;
        var code = "";
        //从后台获取滑动验证码
        //参数 url 访问参数
        this.$axios.post(this.domain.ssoserverpath+'getCode').then((response)=>{
          console.log(response.data.result)
          code=response.data.result;
          //向浏览器写一个Cookie
          document.cookie = 'testCookies' + "=" + response.data.token + "; " + -1;
          _this.moveCode(code,_this);
        })
      }
      // window.sessionStorage.clear();
      // window.localStorage.clear();

    }
  }
</script>

<style scoped>

  .ms-title{
    width:100%;
    line-height: 50px;
    text-align: left;
    font-size:20px;
    color: #fff;
    font-style:italic;
    border-bottom: 1px solid #ddd;
  }
  .ms-login{
    position: absolute;
    left:70%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
  }
  .ms-content{
    padding: 30px 30px;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
  }
  .login-tips{
    font-size:12px;
    line-height:30px;
    color:#fff;
  }

  /** 滑动验证start **/
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 290px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 40px;
    background-color:#fff;
    font-size: 16px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 285px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 70px;
    background-color:#fff;
    font-size: 12px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #F5F7FA;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .p-title{
    color: white;
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
    font-style:italic
  }
  /** 滑动验证end **/
</style>
