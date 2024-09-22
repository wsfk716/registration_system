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
            v-model="searchValue.name"
            style="width: 240px"
            placeholder="请输入姓名"
            :suffix-icon="Search"
          />
          <el-input
            v-model="searchValue.typeName"
            style="width: 240px; padding-left: 10px"
            placeholder="请输入项目名称"
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
        <el-table-column prop="userId" label="人员编号" width="120" sortable />
        <el-table-column prop="name" label="姓名" width="120" sortable />
        <el-table-column prop="sex" label="性别" width="120" />
        <el-table-column
          prop="typeName"
          label="参报项目"
          width="200"
          sortable
        />
        <el-table-column
          prop="userAddTime"
          label="报名时间"
          width="200"
          sortable
        />
        <el-table-column prop="school" label="学校" width="200" />
        <el-table-column prop="grades" label="年级" width="80" sortable />
        <el-table-column prop="professional" label="专业" width="120" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
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
  <el-dialog v-model="addDialogVisible" title="新增报名人员" width="45%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="人员编号" prop="userId">
        <el-input v-model="addForm.userId" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="addForm.sex">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参报项目" prop="typeName">
        <el-select
          v-model="addForm.applyId"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in TypeList"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="addForm.school" />
      </el-form-item>
      <el-form-item label="年级" prop="grades">
        <el-input v-model="addForm.grades" />
      </el-form-item>
      <el-form-item label="专业" prop="professional">
        <el-input v-model="addForm.professional" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="addForm.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAddForm">取消</el-button>
        <el-button type="primary" @click="submitAddForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改对话框 -->
  <el-dialog v-model="EditDialogVisible" title="新增报名人员" width="45%">
    <el-form
      ref="EditFormRef"
      :model="EditForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="人员编号" prop="userId">
        <el-input v-model="EditForm.userId" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="EditForm.name" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="EditForm.sex">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参报项目" prop="typeName">
        <el-select
          v-model="EditForm.applyId"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in TypeList"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="EditForm.school" />
      </el-form-item>
      <el-form-item label="年级" prop="grades">
        <el-input v-model="EditForm.grades" />
      </el-form-item>
      <el-form-item label="专业" prop="professional">
        <el-input v-model="EditForm.professional" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="EditForm.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="EditForm.email" />
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

onMounted(() => {
  getItemShowList();
  getCountNumber();
});
// 搜索
const searchValue = ref({
  name: "",
  typeName: "",
  pageSize: 5,
  pageNum: 1,
});
const handleSearch = () => {
  console.log(searchValue.value);
  getItemShowList();
};
// 分页
const pageSizes = ref([5, 10, 15, 20]);
const countNumber = ref(0);
const handleSizeChange = (val) => {
  searchValue.value.pageSize = val;
  getItemShowList();
};
const handleCurrentChange = (val) => {
  searchValue.value.pageNum = val;
  getItemShowList();
};
// 计算总数
const getCountNumber = async () => {
  try {
    const res = await axios.get("/adminapi/information/count");
    countNumber.value = res.data.data;
  } catch (error) {
    ElMessage.error("获取总数失败");
  }
};

// 表格内容
const tableData = ref([]);
const getItemShowList = async () => {
  try {
    const res = await axios.get(
      `/adminapi/information?pageNum=${searchValue.value.pageNum}&pageSize=${searchValue.value.pageSize}&name=${searchValue.value.name}&typeName=${searchValue.value.typeName}`
    );
    tableData.value = res.data.data.list;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 新增相关内容
const handleAdd = () => {
  addDialogVisible.value = true;
  getAllTypeList();
};
// 获取所有项目名称
const TypeList = ref([]);
const getAllTypeList = async () => {
  try {
    const res = await axios.get("/adminapi/apply/all");
    TypeList.value = res.data.data;
  } catch (error) {
    ElMessage.error("获取项目名称失败");
  }
};

const addDialogVisible = ref(false);
const addForm = ref({
  userId: "",
  name: "",
  sex: "",
  applyId: "",
  school: "",
  grades: "",
  professional: "",
  phone: "",
  email: "",
});
const addFormRef = ref(null);
const rules = {
  userId: [{ required: true, message: "请输入人员编号", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  typeName: [{ required: true, message: "请选择参报项目", trigger: "blur" }],
  school: [{ required: true, message: "请输入学校", trigger: "blur" }],
  grades: [{ required: true, message: "请输入年级", trigger: "blur" }],
  professional: [{ required: true, message: "请输入专业", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
};

const cancelAddForm = () => {
  addDialogVisible.value = false;
  addForm.value = {
    userId: "",
    name: "",
    sex: "",
    applyId: "",
    school: "",
    grades: "",
    professional: "",
    phone: "",
    email: "",
  };
};
const submitAddForm = async () => {
  if (addFormRef.value.validate()) {
    try {
      await axios.post("/adminapi/information", addForm.value);
      ElMessage.success("新增成功");
      addDialogVisible.value = false;
      getItemShowList();
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
  sex: "",
  applyId: "",
  school: "",
  grades: "",
  professional: "",
  phone: "",
  email: "",
});
const EditFormRef = ref(null);
const handleEdit = (row) => {
  EditDialogVisible.value = true;
  EditForm.value = { ...row };
  currentItem.value = row;
  getAllTypeList();
};

const currentItem = ref(null);
const submitEditForm = async () => {
  if (EditFormRef.value.validate()) {
    try {
      await axios.put(
        `/adminapi/information/${currentItem.value.id}`,
        EditForm.value
      );
      ElMessage.success("编辑成功");
      EditDialogVisible.value = false;
      getItemShowList();
    } catch (error) {
      ElMessage.error("编辑失败");
    }
  }
};

// 删除相关内容
// 单个删除
const handleDelete = async (row) => {
  try {
    await axios.delete(`/adminapi/information`, {
      data: [row.id],
    });
    ElMessage.success("删除成功");
    getItemShowList();
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
    axios.delete("/adminapi/information", { data: ids }).then((res) => {
      // console.log(res);
      getItemShowList();
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
