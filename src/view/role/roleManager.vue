<template>
    <div>
      <!-- +++++++模糊查询+++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin: 10px 0">
        <el-form-item label="角色名称">
          <el-input v-model="formInline.role" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- +++++++列表展示++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
      <el-button @click="handleAdd" type="primary" icon="el-icon-plus" style="float: left">添加角色</el-button>
      <el-button @click="downloadExcel" type="success" icon="el-icon-plus" style="float: left">导出数据</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="角色名称"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>角色名称: {{ scope.row.roleName }}</p>
              <p>角色描述: {{ scope.row.miaoShu }}</p>
              <p>捆绑用户: {{ scope.row.userNames }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="miaoShu"
          label="角色描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit( scope.row)" v-if="userInfo.roleInfo.leval < scope.row.leval">编辑绑定权限</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)" v-if="userInfo.roleInfo.leval < scope.row.leval">删除</el-button>
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
      <!-- ++++++++++++增加弹窗++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
      <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.miaoShu"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary">重 置</el-button>
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save()">保 存</el-button>
        </div>
      </el-dialog>
      <!-- ++++++++++++权限绑定弹窗++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
      <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleTree">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="formTree.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="formTree.miaoShu"></el-input>
          </el-form-item>
        </el-form>
        <el-tree
          :data="treeData"
          show-checkbox
          ref="tree"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="saveTree()">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roleManager",
      data(){
          return{
            userInfo:{},
            formInline:{
              leval:"",
              role:"",
              page:1,
              pageSize:3
            },
            tableData:[],
            total:0,
            formEntity:{},
            dialogFormVisible:false,
            formLabelWidth:"120px",
            form:{},
            formTree:{},
            dialogFormVisibleTree:false,
            treeData:[],
            defaultProps: {
              children: 'menuInfoList',
              label: 'menuName'
            },
            ids:""
          }
      },
      mounted() {
          this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
          this.formInline.leval=this.userInfo.roleInfo.leval;
          this.getList();
          this.findTreeData();
      },
      methods:{
        //列表下载
        downloadExcel() {
          this.$confirm('确定下载列表文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.excelData = this.tableData //要导出的数据list。
            this.export2Excel()
          }).catch(() => {

          });
        },
        //数据写入excel
        export2Excel() {
          var that = this;
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/excel/export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径
            const tHeader = ['序号','角色名称','角色描述','绑定用户']; // 导出的表头名信息
            const filterVal = ['id','roleName', 'miaoShu', 'userNames']; // 导出的表头字段名，需要导出表格字段名
            const list = that.excelData;
            const data = that.formatJson(filterVal, list);

            export_json_to_excel(tHeader, data, 'role下载数据excel');// 导出的表格名称，根据需要自己命名
          })
        },
        //格式转换，直接复制即可
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
        findTreeData(){
          let map = {"roleId":this.userInfo.roleInfo.id};
          this.$axios.post(this.domain.serverpath+"findMenuList",map).then((response)=> {
            this.treeData=response.data;
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
        },
        saveTree(){
          //点击编辑绑定权限的保存按钮
          let ids = this.$refs.tree.getHalfCheckedKeys()+","+this.$refs.tree.getCheckedKeys();
          if(ids.indexOf(",") == 0){
            ids = ids.substring(1);
          }
          let map ={
            "ids":ids,
            "role":this.formTree
          }
          this.$axios.post(this.domain.serverpath+"updateRole",map).then((response)=> {
            if(response.data.code==200){
              this.getList()
              this.dialogFormVisibleTree=false;
              this.$message({
                message: response.data.success,
                type: 'success'
              });
            }else {
              this.$message.error(response.data.error);
            }
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
        },
        handleDelete(id){
          let map = {"id":id}
          //删除权限
          this.$axios.post(this.domain.serverpath+"deleteRole",map).then((response)=> {
            if(response.data.code==200){
              this.getList()
              this.$message({
                message: response.data.success,
                type: 'success'
              });
            }else {
              this.$message.error(response.data.error);
            }
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
        },
        getList(){
          //查询角色
          this.$axios.post(this.domain.serverpath+"findRole",this.formInline).then((response)=> {
            this.tableData=response.data.list;
            this.total=response.data.total;
            this.formInline.page=response.data.pageNum;
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
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
        },
        close(){
          //关闭添加的弹窗
          this.dialogFormVisible = false;
          this.dialogFormVisibleTree = false;
          this.form={};
        },
        handleAdd(){
          //点击添加角色按钮
          this.form={};
          this.dialogFormVisible=true;
        },
        save(){
          this.$axios.post(this.domain.serverpath+"addRole",this.form).then((response)=> {
            if (response.data.code==200){
              this.getList();
              this.dialogFormVisible=false;
              this.$message({
                message: response.data.success,
                type: 'success'
              })
            }else {
              this.$message.error(response.data.error);
            }
          }).catch((err)=>{
            this.$message.error('您无此操作权限！');
          })
        },
        handleEdit(row){
          //点击编辑绑定权限按钮
          this.dialogFormVisibleTree=true;
          this.formTree=row;
          setTimeout(()=>{
            this.$refs.tree.setCheckedKeys(row.menuList,true),0;
          })
        },
        onSubmit(){
          //模糊查询
          this.getList();
        }
      }
    }
</script>

<style scoped>

</style>
