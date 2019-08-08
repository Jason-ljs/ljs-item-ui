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
              @click="handleEdit( scope.row)">编辑绑定权限</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
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
    </div>
</template>

<script>
    export default {
        name: "roleManager",
      data(){
          return{
            formInline:{
              role:"",
              page:1,
              pageSize:3
            },
            tableData:[],
            total:0,
            formEntity:{},
            dialogFormVisible:false
          }
      },
      mounted() {
          this.getList();
      },
      methods:{
        handleDelete(id){
          //删除权限
          this.$axios.post(this.domain.serverpath+"deleteRole",id).then((response)=> {
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
        getList(){
          //查询角色
          this.$axios.post(this.domain.serverpath+"findRole",this.formInline).then((response)=> {
            console.log(response.data)
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
          this.formEntity={};
        },
        handleSizeChange(){
          //每页条数更改
        },
        handleAdd(){
          //点击添加角色按钮
        },
        handleEdit(){
          //点击编辑绑定权限按钮
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
