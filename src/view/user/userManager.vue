<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin: 10px 0">
      <el-form-item label="用户名">
        <el-input v-model="formInline.user" placeholder="用户名"></el-input>
      </el-form-item>
      <span class="demonstration">创建时间</span>
      <el-date-picker
        v-model="formInline.start"
        type="date"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      --
      <el-date-picker
        v-model="formInline.end"
        type="date"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-form-item label="性别">
        <el-select v-model="formInline.sex" placeholder="全部">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- +++++++++++上面是查询，下面是列表展示+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <el-button @click="handleAdd" type="primary" icon="el-icon-plus" style="float: left">添加新用户</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="登录名"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p><el-image :src="scope.row.imgUrl" style="height: 50px;width: 50px;line-height: 50px"></el-image></p>
            <p>姓名: {{ scope.row.userName }}</p>
            <p>登录名: {{ scope.row.loginName }}</p>
            <p>性别: {{ scope.row.sex }}</p>
            <p>电话: {{ scope.row.tel }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.loginName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="tel"
        label="电话"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="createTimeFormat"
        label="创建时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="roleInfo.roleName"
        label="角色"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="用户头像"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image :src="scope.row.imgUrl" style="height: 50px;width: 50px"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit( scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="EditRoleOpen(scope.row.id)">角色绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- +++++++++++++分页+++++++++++++ -->
    <el-pagination
      background
      layout="sizes, prev, pager, next, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="formInline.page"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="formInline.pageSize"
      :total="total">
    </el-pagination>

    <!-- ++++++++++++增加修改弹窗++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="formEntity" status-icon :rules="rules" ref="formEntity" label-width="100px" class="demo-ruleForm">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:10000/api/manger/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="formEntity.imgUrl" :src="formEntity.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="formEntity.userName"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="formEntity.loginName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formEntity.sex" size="small">
            <el-radio-button label="男">男</el-radio-button>
            <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="formEntity.tel"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="formEntity.password"></el-input>
        </el-form-item>
        <el-form-item label="确认登录密码" prop="cpassword">
          <el-input type="password" v-model="formEntity.cpassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="resetForm('formEntity')">重置</el-button>
      </div>
    </el-dialog>

    <!-- ++++++++绑定角色弹窗+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <el-dialog title="绑定角色" :visible.sync="dialogFormVisibleRole">
      <el-select v-model="roleId" filterable>
        <el-option
          v-for="item in options"
          :key="item.roleName"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRole">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "userManager",
      data(){
          //校验规则
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.formEntity.cpassword !== '') {
              this.$refs.formEntity.validateField('cpassword');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.formEntity.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
          return{
            formInline: {
              user: '',
              sex: '全部',
              start:"",
              end:"",
              page:1,
              pageSize:3
            },
            tableData: [],
            multipleSelection: [],
            total:0,
            formEntity:{
              userName:"",
              loginName:"",
              sex:"",
              tel:"",
              password:"",
              cpassword:"",
              imgUrl:""
            },
            rules:{//谁用规则
              userName: [
                { required: true, message: '请输入用户名', trigger: 'change' }
              ],
              loginName: [
                { required: true, message: '请输入登录名', trigger: 'change' }
              ],
              sex: [
                { required: true, message: '请选择性别', trigger: 'change' }
              ],
              tel: [
                { required: true, message: '请输入电话号码', trigger: 'change' }
              ],
              password: [
                { required: true, validator: validatePass, trigger: 'blur' }
              ],
              cpassword: [
                { validator: validatePass2, trigger: 'blur' }
              ],
            },
            dialogFormVisible:false,
            dialogFormVisibleRole:false,
            options:[],
            uid:"",
            roleId:""
          }
      },
      mounted(){
        this.options = JSON.parse(window.sessionStorage.getItem("userInfo")).roleInfoList;
        this.getList();
      },
      methods: {
        EditRoleOpen(uid){
          //打开绑定角色弹窗
          this.roleId="";
          this.uid=uid;
          this.dialogFormVisibleRole = true;
        },
        handleEditRole(){
          //绑定角色
          this.dialogFormVisibleRole = true;
          let map = {
          "uid":this.uid,
          "rid":this.roleId
          };
          this.dialogFormVisibleRole = false;
          this.formEntity={};
          this.$axios.post(this.domain.serverpath+"editRole",map).then((response)=> {
            if(response.data.code==200){
              this.getList()
              this.$message({
                message: response.data.success,
                type: 'success'
              });
            }
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
        },
        save(){
          //保存
          let url = "addUser";
          if (this.formEntity.id>0){
            url = "updateUser"
          }
          this.$axios.post(this.domain.serverpath+url,this.formEntity).then((response)=> {
            if(response.data.code==200){
              this.dialogFormVisible = false;
              this.formEntity={};
              this.getList()
              this.$message({
                message: response.data.success,
                type: 'success'
              });
            }
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
        },
        handleAvatarSuccess(res, file) {
          //上传图片成功后回调函数
          this.imageUrl = URL.createObjectURL(file.raw);
          this.formEntity.imgUrl="http://localhost:8090/"+file.name;
        },
        close(){
          //关闭添加修改的弹窗
          this.dialogFormVisible = false;
          this.formEntity={};
        },
        resetForm(formEntity) {
          //重置按钮
          this.$refs[formEntity].resetFields();
        },
        handleAdd(){
          //用户添加
          this.formEntity.id=0;
          this.dialogFormVisible = true;
        },
        handleEdit(mod){
          //编辑
          this.formEntity=mod;
          this.formEntity.password="";
          this.dialogFormVisible = true;
        },
        handleDelete(id){
          //删除
          if (confirm("确认删除吗？")) {
            this.$axios.post(this.domain.serverpath+"deleteUser",id).then((response)=> {
              this.getList();
              if(response.data.code==200){
                this.$message({
                  message: response.data.success,
                  type: 'success'
                });
              }
            }).catch((err)=>{
              this.$message.error('您无此操作权限！');
            })
          }
        },
          getList(){
          //查询
            this.$axios.post(this.domain.serverpath+"findUser",this.formInline).then((response)=> {
              console.log(response.data)
              this.tableData=response.data.list;
              this.total=response.data.total;
              this.formInline.page=response.data.pageNum;
            }).catch((err)=>{
              this.$message.error('您无此操作权限！');
            })
          },
          onSubmit() {
            //查询按钮
            this.getList();
          },
          handleSelectionChange(val) {
            //点击多选框后
            this.multipleSelection = val;
          },
          handleSizeChange(val) {
            //选择每页多少条后
            this.formInline.pageSize=val;
            this.getList();
          },
          handleCurrentChange(val) {
            //点击指定页后
            this.formInline.page=val;
            this.getList();
          }
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
