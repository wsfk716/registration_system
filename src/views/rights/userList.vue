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
            v-model="searchValue.userName"
            style="width: 240px"
            placeholder="请输入用户名"
            :suffix-icon="Search"
          />
          <el-input
            v-model="searchValue.roleName"
            style="width: 240px; padding-left: 10px"
            placeholder="请输入角色名"
            :suffix-icon="Search"
          />
          <el-button type="primary" @click="handleSearch">
            <el-icon style="padding-right: 5px"> <Search /></el-icon>
            搜索</el-button
          >
          <el-button type="success" @click="handleExport">
            导出
            <el-icon><Download /></el-icon>
          </el-button>
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
        <el-table-column prop="userName" label="用户名" width="120" sortable />
        <el-table-column
          prop="role.roleName"
          label="角色类型"
          width="120"
          sortable
        />
        <el-table-column prop="description" label="备注" width="auto" />
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
                <el-button type="danger"> 删除</el-button>
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
  <el-dialog v-model="addDialogVisible" title="新增用户" width="45%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="addForm.userName" />
      </el-form-item>
      <el-form-item label="角色类型" prop="roleName">
        <el-select
          v-model="addForm.roleID"
          placeholder="请选择角色"
          style="width: 240px"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="description">
        <el-input v-model="addForm.description" />
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
  <el-dialog v-model="EditDialogVisible" title="编辑用户单信息" width="45%">
    <el-form
      ref="EditFormRef"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="EditForm.userName" />
      </el-form-item>
      <el-form-item label="角色类型" prop="roleName">
        <el-select
          v-model="EditForm.roleID"
          placeholder="请选择角色"
          style="width: 240px"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="EditForm.description" />
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { Edit, Search } from "@element-plus/icons-vue";
import fileDownload from "js-file-download";
onMounted(() => {
  getUserList();
  getCountNumber();
  getRoleList();
});
// 获取角色列表
const roleList = ref([]);
const getRoleList = async () => {
  try {
    const res = await axios.get("/adminapi/role/allRole");
    roleList.value = res.data.data;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
  }
};

// 搜索
const searchValue = ref({
  roleName: "",
  userName: "",
  pageSize: 5,
  pageNum: 1,
});
const handleSearch = () => {
  console.log(searchValue.value);
  getUserList();
};
// 分页
const pageSizes = ref([5, 10, 15, 20]);
const countNumber = ref(0);
const handleSizeChange = (val) => {
  searchValue.value.pageSize = val;
  getUserList();
};
const handleCurrentChange = (val) => {
  searchValue.value.pageNum = val;
  getUserList();
};
// 计算总数
const getCountNumber = async () => {
  try {
    const res = await axios.get("/adminapi/user/count");
    countNumber.value = res.data.data;
  } catch (error) {
    ElMessage.error("获取总数失败");
  }
};

// 表格内容
const tableData = ref([]);
const getUserList = async () => {
  try {
    const res = await axios.get(
      `/adminapi/user?pageNum=${searchValue.value.pageNum}&pageSize=${searchValue.value.pageSize}&userName=${searchValue.value.userName}&roleName=${searchValue.value.roleName}`
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
  userName: "",
  roleID: "",
  description: "",
});
const addFormRef = ref(null);
const rules = {
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  roleName: [{ required: true, message: "请输入角色类型", trigger: "blur" }],
  description: [{ required: true, message: "请输入备注", trigger: "blur" }],
};

const cancelAddForm = () => {
  addDialogVisible.value = false;
  addForm.value = {
    userName: "",
    roleID: "",
    description: "",
  };
};
const submitAddForm = async () => {
  if (addFormRef.value.validate()) {
    try {
      await axios.post("/adminapi/user", addForm.value);
      ElMessage.success("新增成功");
      addDialogVisible.value = false;
      getUserList();
      getCountNumber();
    } catch (error) {
      ElMessage.error("新增失败");
    }
  }
};

// 编辑相关内容
const EditDialogVisible = ref(false);
const EditForm = ref({
  userName: "",
  roleID: "",
  description: "",
});
const EditFormRef = ref(null);
const handleEdit = (row) => {
  EditDialogVisible.value = true;
  EditForm.value = { ...row };
  currentItem.value = row;
};

const currentItem = ref(null);
const submitEditForm = async () => {
  if (EditFormRef.value.validate()) {
    try {
      await axios.put(`/adminapi/user/${currentItem.value.id}`, EditForm.value);
      ElMessage.success("编辑成功");
      EditDialogVisible.value = false;
      getUserList();
    } catch (error) {
      ElMessage.error("编辑失败");
    }
  }
};

// 删除相关内容
// 单个删除
const handleDelete = async (row) => {
  try {
    await axios.delete(`/adminapi/user`, {
      data: [row.id],
    });
    ElMessage.success("删除成功");
    getUserList();
    getCountNumber();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 批量删除
const tableRef = ref(null);
const handleAllDelete = () => {
  const res = tableRef.value.getSelectionRows();
  console.log(res);
  if (res.length === 0) {
    ElMessage.warning("请选择要删除的数据");
  } else {
    // 获取选中数据的id,组成数组
    const ids = res.map((item) => item.id);
    axios.delete("/adminapi/user", { data: ids }).then((res) => {
      // console.log(res);
      getUserList();
      getCountNumber();
      ElMessage.success("删除成功");
    });
  }
};

// 导出
const handleExport = async () => {
  try {
    const res = await axios.get(
      `/adminapi/user/export?userName=${searchValue.value.userName}&roleName=${searchValue.value.roleName}`,
      {
        responseType: "blob",
      }
    );
    console.log(res);
    fileDownload(
      res.data,
      "注册用户列表" + new Date().toLocaleString() + ".xlsx"
    );
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
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
