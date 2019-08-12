<template>
  <div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree"
      @node-contextmenu="contextmenu">
    </el-tree>

    <el-dialog :title="formEntity.tableName" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formEntity" label-width="200px" size="mini">
        <el-button type="primary" @click="toAdd()" icon="el-icon-plus" plain circle></el-button>
        <el-button type="primary" @click="toUpdate()" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" @click="toDelete()" icon="el-icon-delete" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <el-divider></el-divider>

        <el-form-item label="当前菜单等级：">
          {{formEntity.leval}}
        </el-form-item>
        <el-form-item label="当前菜单名称：">
          {{formEntity.menuName}}
        </el-form-item>
        <el-form-item label="当前菜单ID：">
          {{formEntity.id}}
        </el-form-item>

          <el-form-item :hidden="addHidden" v-if="formEntity.leval!==4" label="新添加子菜单名称">
            <el-input v-model="formEntity.menuNameadd"></el-input>
          </el-form-item>
        <el-form-item :hidden="addHidden" label="菜单访问URL">
          <el-input  v-model="formEntity.urladd"></el-input> b
        </el-form-item>
          <el-form-item :hidden="updateHidden" label="修改菜单名称">
            <el-input v-model="form.menuName"></el-input>
          </el-form-item>
          <el-form-item :hidden="updateHidden" label="菜单访问URL">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item :hidden="deleteHidden" label="">
            你确定删除此条数据吗？
          </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "menuManager",
    data() {
      return {
        filterText: "",
        data: [],
        defaultProps: {
          children: 'menuInfoList',
          label: 'menuName'
        },
        form:{},
        formEntity:{},
        dialogFormVisible:false,
        addHidden:false,
        updateHidden:true,
        deleteHidden:true
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      this.findTreeData();
    },
    methods: {
      save(){
        //点击保存按钮时
        let uurl = "";
        if(this.addHidden==false){
          uurl = this.domain.serverpath + "addMenu"
          this.form.menuName=this.formEntity.menuNameadd;
          this.form.url=this.formEntity.urladd;
        }
        if(this.updateHidden==false){
          uurl = this.domain.serverpath + "updateMenu"
        }
        if(this.deleteHidden==false){
          uurl = this.domain.serverpath + "deleteMenu"
        }
        console.log(this.form)
        this.dialogFormVisible=false
        this.$axios.post(uurl,this.form).then((response) => {
          if(response.data.code==200){
            this.findTreeData();
            this.$message({
              message: response.data.success,
              type: 'success'
            });
          }else {
            this.$message.error(response.data.error);
          }
        }).catch((err) => {
          this.$message.error('您无此操作权限！');
        })
      },
      close(){
        //点击关闭按钮时
        this.form={};
        this.dialogFormVisible=false;
      },
      toDelete(){
        //点击删除图标时
        this.updateHidden=true;
        this.deleteHidden=false;
        this.addHidden=true;
      },
      toUpdate(){
        //点击修改图标时
        this.form.menuName=this.formEntity.menuName;
        this.form.url=this.formEntity.url;
        this.updateHidden=false;
        this.deleteHidden=true;
        this.addHidden=true;
      },
      toAdd(){
        //点击添加图标时
        this.initCRUD();
      },
      initCRUD(){
        //初始化菜单权限显示
        this.form={}
        if(this.formEntity.leval==4){
          this.updateHidden=false;
          this.deleteHidden=true;
          this.addHidden=true;
          this.toUpdate();
        }else {
          this.updateHidden=true;
          this.deleteHidden=true;
          this.addHidden=false;
        }
      },
      findTreeData() {
        //树形图列表展示
        this.$axios.post(this.domain.serverpath + "findMenuList").then((response) => {
          this.data = response.data;
        }).catch((err) => {
          this.$message.error('您无此操作权限！');
        })
      },
      filterNode(value, data) {
        //根据关键字过滤
        if (!value) return true;
        return data.menuName.indexOf(value) !== -1;
      },
      contextmenu(event,data,node,self){
        this.formEntity=data;
        this.formEntity.tableName="当前操作的菜单名称-"+this.formEntity.menuName
        console.log(data)
        this.initCRUD();
        this.form.id=this.formEntity.id;
        this.form.leval=this.formEntity.leval;
        this.dialogFormVisible=true
      }
    }
  }
</script>

<style scoped>

</style>
