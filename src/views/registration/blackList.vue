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
            v-model="searchValue.userId"
            style="width: 240px"
            placeholder="请输入用户编号"
            :suffix-icon="Search"
          />
          <el-input
            v-model="searchValue.name"
            style="width: 240px; padding-left: 10px"
            placeholder="请输入姓名"
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
        <el-table-column prop="userId" label="用户编号" width="120" sortable />
        <el-table-column prop="name" label="姓名" width="120" sortable />
        <el-table-column prop="school" label="学校" width="120" />
        <el-table-column prop="grade" label="年级" width="80" sortable />
        <el-table-column prop="professional" label="专业" width="120" />
        <el-table-column prop="addTime" label="添加时间" width="200" sortable />
        <el-table-column prop="description" label="备注" width="240" />
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
  <el-dialog v-model="addDialogVisible" title="新增黑名单信息" width="45%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户编号" prop="userId">
        <el-input v-model="addForm.userId" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="addForm.school" />
      </el-form-item>
      <el-form-item label="年级" prop="grades">
        <el-input v-model="addForm.grade" />
      </el-form-item>
      <el-form-item label="专业" prop="professional">
        <el-input v-model="addForm.professional" />
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
  <el-dialog v-model="EditDialogVisible" title="编辑黑名单信息" width="45%">
    <el-form
      ref="EditFormRef"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户编号" prop="userId">
        <el-input v-model="EditForm.userId" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="EditForm.name" />
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="EditForm.school" />
      </el-form-item>
      <el-form-item label="年级" prop="grades">
        <el-input v-model="EditForm.grade" />
      </el-form-item>
      <el-form-item label="专业" prop="professional">
        <el-input v-model="EditForm.professional" />
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
import { Search } from "@element-plus/icons-vue";
import fileDownload from "js-file-download";
onMounted(() => {
  getBlackList();
  getCountNumber();
});
// 搜索
const searchValue = ref({
  userId: "",
  name: "",
  pageSize: 5,
  pageNum: 1,
});
const handleSearch = () => {
  console.log(searchValue.value);
  getBlackList();
};
// 分页
const pageSizes = ref([5, 10, 15, 20]);
const countNumber = ref(0);
const handleSizeChange = (val) => {
  searchValue.value.pageSize = val;
  getBlackList();
};
const handleCurrentChange = (val) => {
  searchValue.value.pageNum = val;
  getBlackList();
};
// 计算总数
const getCountNumber = async () => {
  try {
    const res = await axios.get("/adminapi/blackList/count");
    countNumber.value = res.data.data;
  } catch (error) {
    ElMessage.error("获取总数失败");
  }
};

// 表格内容
const tableData = ref([]);
const getBlackList = async () => {
  try {
    const res = await axios.get(
      `/adminapi/blackList?pageNum=${searchValue.value.pageNum}&pageSize=${searchValue.value.pageSize}&name=${searchValue.value.name}&userId=${searchValue.value.userId}`
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
  userId: "",
  name: "",
  school: "",
  grade: "",
  professional: "",
  description: "",
});
const addFormRef = ref(null);
const rules = {
  userId: [{ required: true, message: "请输入用户编号", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  school: [{ required: true, message: "请输入学校", trigger: "blur" }],
  grade: [{ required: true, message: "请输入年级", trigger: "blur" }],
  professional: [{ required: true, message: "请输入专业", trigger: "blur" }],
};

const cancelAddForm = () => {
  addDialogVisible.value = false;
  addForm.value = {
    userId: "",
    name: "",
    school: "",
    grade: "",
    professional: "",
    description: "",
  };
};
const submitAddForm = async () => {
  if (addFormRef.value.validate()) {
    try {
      await axios.post("/adminapi/blackList", addForm.value);
      ElMessage.success("新增成功");
      addDialogVisible.value = false;
      getBlackList();
      getCountNumber();
    } catch (error) {
      ElMessage.error("新增失败");
    }
  }
};

// 编辑相关内容
const EditDialogVisible = ref(false);
const EditForm = ref({
  userId: "",
  name: "",
  school: "",
  grade: "",
  professional: "",
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
      await axios.put(
        `/adminapi/blackList/${currentItem.value.id}`,
        EditForm.value
      );
      ElMessage.success("编辑成功");
      EditDialogVisible.value = false;
      getBlackList();
    } catch (error) {
      ElMessage.error("编辑失败");
    }
  }
};

// 删除相关内容
// 单个删除
const handleDelete = async (row) => {
  try {
    await axios.delete(`/adminapi/blackList`, {
      data: [row.id],
    });
    ElMessage.success("删除成功");
    getBlackList();
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
    axios.delete("/adminapi/blackList", { data: ids }).then((res) => {
      // console.log(res);
      getBlackList();
      getCountNumber();
      ElMessage.success("删除成功");
    });
  }
};

// 导出
const handleExport = async () => {
  try {
    const res = await axios.get(
      `/adminapi/blackList/export?name=${searchValue.value.name}&userId=${searchValue.value.userId}`,
      {
        responseType: "blob",
      }
    );
    console.log(res);
    fileDownload(res.data, "黑名单" + new Date().toLocaleString() + ".xlsx");
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
