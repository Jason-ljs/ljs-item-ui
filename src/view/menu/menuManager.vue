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

    <el-dialog title="form.tableName" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
        <el-divider></el-divider>
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
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
        form:{
          tableName:"测试，后期再改"
        },
        dialogFormVisible:false
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
        console.log(data)
        this.dialogFormVisible=true
      }
    }
  }
</script>

<style scoped>

</style>
