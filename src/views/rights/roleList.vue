<template>
  <div class="itemType">
    <div class="header">
      <div class="left">
        <el-button type="primary" @click="handleAdd">
          新增
          <el-icon><CirclePlus /></el-icon>
        </el-button>
        <div class="search">
          <el-input
            v-model="searchValue.roleName"
            style="width: 240px"
            placeholder="请输入角色名称"
            :suffix-icon="Search"
          />
          <el-button type="primary" @click="handleSearch">
            <el-icon style="padding-right: 5px"> <Search /></el-icon>
            搜索</el-button
          >
        </div>
      </div>
      <div class="right">
        <el-button type="danger" @click="handleAllDelete"
          >批量删除
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>
    <div class="main">
      <!-- 表格主体 -->
      <el-table :data="tableData" style="width: 100%" ref="tableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="120"
          sortable
        />
        <el-table-column prop="description" label="角色描述" width="auto" />
        <el-table-column label="操作" min-width="120">
          <template v-slot="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>

            <el-popconfirm
              title="确定要删除吗?"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <el-pagination
        v-model:current-page="searchValue.pageNum"
        v-model:page-size="searchValue.pageSize"
        :page-sizes="pageSizes"
        :background="true"
        layout=" prev, pager, next, jumper, sizes, total"
        :total="countNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="新增角色" width="45%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="addForm.description" />
      </el-form-item>
      <el-form-item label="权限分配">
        <el-tree
          ref="AddTreeRef"
          :data="menuList"
          show-checkbox
          node-key="path"
          :props="{ label: 'name', children: 'children' }"
          :default-expand-all="true"
          check-strictly
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAddForm">取消</el-button>
        <el-button type="primary" @click="submitAddForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="EditDialogVisible" title="编辑黑名单信息" width="45%">
    <el-form
      ref="EditFormRef"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="EditForm.roleName" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="EditForm.description" />
      </el-form-item>
      <el-form-item label="权限分配">
        <el-tree
          ref="treeRef"
          :data="menuList"
          show-checkbox
          node-key="path"
          :props="{ label: 'name', children: 'children' }"
          :default-expand-all="true"
          check-strictly
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { Search } from "@element-plus/icons-vue";

onMounted(() => {
  getRoleList();
  getCountNumber();
  getMenulist();
});

// 权限分配
const menuList = ref([]);
const getMenulist = async () => {
  const res = await axios.get("/adminapi/menu");
  menuList.value = res.data.data;
  // console.log(menuList.value);
};

// 搜索
const searchValue = ref({
  roleName: "",
  pageSize: 5,
  pageNum: 1,
});
const handleSearch = () => {
  // console.log(searchValue.value);
  getRoleList();
};
// 分页
const pageSizes = ref([5, 10, 15, 20]);
const countNumber = ref(0);
const handleSizeChange = (val) => {
  searchValue.value.pageSize = val;
  getRoleList();
};
const handleCurrentChange = (val) => {
  searchValue.value.pageNum = val;
  getRoleList();
};
// 计算总数
const getCountNumber = async () => {
  try {
    const res = await axios.get("/adminapi/role/count");
    countNumber.value = res.data.data;
  } catch (error) {
    ElMessage.error("获取总数失败");
  }
};

// 表格内容
const tableData = ref([]);
const getRoleList = async () => {
  try {
    const res = await axios.get(
      `/adminapi/role?pageNum=${searchValue.value.pageNum}&pageSize=${searchValue.value.pageSize}&roleName=${searchValue.value.roleName}`
    );
    tableData.value = res.data.data.list;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 新增相关内容
const handleAdd = () => {
  addDialogVisible.value = true;
};

const addDialogVisible = ref(false);
const addForm = ref({
  roleName: "",
  description: "",
  rights: "",
});
const addFormRef = ref(null);
const AddTreeRef = ref(null);
const rules = {
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入备注", trigger: "blur" }],
};

const cancelAddForm = () => {
  addDialogVisible.value = false;
  addForm.value = {
    roleName: "",
    description: "",
    rights: "",
  };
};

const submitAddForm = async () => {
  if (addFormRef.value.validate()) {
    try {
      // 处理权限数据
      // console.log(AddTreeRef.value.getCheckedKeys());
      addForm.value.rights = JSON.stringify(AddTreeRef.value.getCheckedKeys());
      await axios.post("/adminapi/role", addForm.value);
      ElMessage.success("新增成功");
      addDialogVisible.value = false;
      getRoleList();
      getCountNumber();
    } catch (error) {
      ElMessage.error("新增失败");
    }
  }
};

// 编辑相关内容
const EditDialogVisible = ref(false);
const EditForm = ref({
  roleName: "",
  description: "",
  rights: "",
});
const treeRef = ref(null);
const EditFormRef = ref(null);
const currentItem = ref(null);
const handleEdit = async (row) => {
  EditDialogVisible.value = true;
  EditForm.value = { ...row };
  // 处理初始化的权限下拉列表
  try {
    EditForm.value.rights = JSON.parse(row.rights);
    console.log(EditForm.value.rights);
    await nextTick(); // 确保 DOM 更新完成
    treeRef.value.setCheckedKeys(EditForm.value.rights);
  } catch (error) {
    console.error("JSON 解析错误:", error);
    EditForm.value.rights = [];
  }
  currentItem.value = row;
};

const submitEditForm = async () => {
  if (EditFormRef.value.validate()) {
    try {
      await axios.put(`/adminapi/role/${currentItem.value.id}`, {
        roleName: EditForm.value.roleName,
        description: EditForm.value.description,
        rights: JSON.stringify(treeRef.value.getCheckedKeys()),
      });
      ElMessage.success("编辑成功");
      EditDialogVisible.value = false;
      getRoleList();
    } catch (error) {
      ElMessage.error("编辑失败");
    }
  }
};

// 删除相关内容
// 单个删除
const handleDelete = async (row) => {
  try {
    await axios.delete(`/adminapi/role`, {
      data: [row.id],
    });
    ElMessage.success("删除成功");
    getRoleList();
    getCountNumber();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 批量删除
const tableRef = ref(null);
const handleAllDelete = () => {
  const res = tableRef.value.getSelectionRows(); // 这个element-plus的方法获取选中的数据
  console.log(res);
  if (res.length === 0) {
    ElMessage.warning("请选择要删除的数据");
  } else {
    // 获取选中数据的id,组成数组
    const ids = res.map((item) => item.id);
    axios.delete("/adminapi/role", { data: ids }).then((res) => {
      // console.log(res);
      getRoleList();
      getCountNumber();
      ElMessage.success("删除成功");
    });
  }
};
</script>
<style lang="scss" scoped>
.itemType {
  display: block;
  padding-top: 20px;
  width: 100%;
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .left {
      display: flex;
      .search {
        display: flex;
        padding: 0 20px;
      }
      .el-button {
        margin-left: 10px;
        width: 80px;
      }
    }
    .right {
      display: flex;
      padding-right: 20px;
      .el-button {
        padding: 10px;
        width: 90px;
      }
    }
    .el-icon {
      padding-left: 3px;
    }
  }
}
</style>
