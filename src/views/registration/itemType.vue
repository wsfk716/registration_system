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
            v-model="searchValue.typeId"
            style="width: 240px"
            placeholder="请输入编号"
            :suffix-icon="Search"
          />
          <el-input
            v-model="searchValue.typename"
            style="width: 240px; padding-left: 10px"
            placeholder="请输入标题"
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
        <el-button type="warning" @click="closeAll"
          >关闭所有
          <el-icon><Finished /></el-icon>
        </el-button>
      </div>
    </div>
    <div class="main">
      <!-- 表格主体 -->
      <el-table :data="tableData" style="width: 100%" ref="tableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="typeId" label="编号" width="120" />
        <el-table-column prop="typename" label="标题" width="240" />
        <el-table-column prop="isShow" label="启用状态" width="120">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.isShow"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
              @change="changeShow(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" width="240" />
        <el-table-column prop="endTime" label="结束时间" width="240" />
        <el-table-column prop="description" label="描述" width="240" />
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
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
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
  <el-dialog v-model="addDialogVisible" title="添加项目" width="45%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="编号" prop="typeId">
        <el-input v-model="addForm.typeId" />
      </el-form-item>
      <el-form-item label="标题" prop="typename">
        <el-input v-model="addForm.typename" />
      </el-form-item>
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="addForm.beginTime"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        --
        <el-date-picker
          v-model="addForm.endTime"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
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
  <el-dialog v-model="editDialogVisible" title="编辑项目" width="45%">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="id" prop="id">
        <el-input v-model="editForm.id" disabled="true" />
      </el-form-item>
      <el-form-item label="编号" prop="typeId">
        <el-input v-model="editForm.typeId" />
      </el-form-item>
      <el-form-item label="标题" prop="typename">
        <el-input v-model="editForm.typename" />
      </el-form-item>
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="editForm.beginTime"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="MMM DD, YYYY"
          time-format="HH:mm"
        />
        --
        <el-date-picker
          v-model="editForm.endTime"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="MMM DD, YYYY"
          time-format="HH:mm"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="editForm.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
const tableData = ref([]);
onMounted(() => {
  getItemTypeList();
  getCountNumber();
});

const getItemTypeList = async () => {
  const res = await axios.get(
    `/adminapi/apply?pageSize=${pageSize.value}&pageNum=${currentPage.value}`
  );
  tableData.value = res.data.data.list;
};

const searchValue = ref({
  typeId: "",
  typename: "",
});

const handleSearch = async () => {
  console.log(searchValue.value);
  const res = await axios.get("/adminapi/apply", { params: searchValue.value });
  tableData.value = res.data.data;
};

// 新增相关内容
const addFormRef = ref(null);
const addDialogVisible = ref(false);
const addForm = ref({
  typeId: null,
  typename: "",
  beginTime: "",
  endTime: "",
  description: "",
});
// 新增按钮的点击事件
const handleAdd = () => {
  addDialogVisible.value = true;
};
const rules = {
  typeId: [{ required: true, message: "请输入编号", trigger: "blur" }],
  typename: [{ required: true, message: "请输入标题", trigger: "blur" }],
  beginTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
};

const cancelAddForm = () => {
  addDialogVisible.value = false;
  // 清楚表单内容
  addForm.value = {
    typeId: "",
    typename: "",
    beginTime: "",
    endTime: "",
    description: "",
  };
};
// 提交添加表单
const submitAddForm = () => {
  if (addFormRef.value.validate()) {
    console.log(addForm.value);

    addDialogVisible.value = false;
    axios.post("/adminapi/apply", addForm.value).then((res) => {
      // console.log(res);
      getItemTypeList();
      ElMessage.success("添加成功");
    });
  }
};

// 编辑相关内容
const editDialogVisible = ref(false);
const editForm = ref({
  id: "",
  typeId: "",
  typename: "",
  beginTime: "",
  endTime: "",
  description: "",
});
const editFormRef = ref(null);
const handleEdit = (row) => {
  editDialogVisible.value = true;
  editForm.value = { ...row };
};
// 提交编辑表单
const submitEditForm = () => {
  if (editFormRef.value.validate()) {
    console.log(editForm.value);
    editForm.value.beginTime = dayjs(editForm.value.beginTime).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    editForm.value.endTime = dayjs(editForm.value.endTime).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    editDialogVisible.value = false;
    axios.put("/adminapi/apply", editForm.value).then((res) => {
      // console.log(res);
      getItemTypeList();
      ElMessage.success("编辑成功");
    });
  }
};

// 启用状态的切换, 也属于编辑的一种, 1为启用, 0为禁用
const changeShow = (row) => {
  console.log(row);
  axios.put("/adminapi/apply", row).then((res) => {
    // console.log(res);
    getItemTypeList();
    ElMessage.success("修改成功");
  });
};

// 关闭所有
const closeAll = () => {
  axios.put("/adminapi/apply/closeAll").then((res) => {
    // console.log(res);
    getItemTypeList();
    ElMessage.success("关闭成功");
  });
};

// 删除相关内容，单个删除与批量删除
// 单个删除
const handleDelete = (row) => {
  console.log(row);
  // 删除操作
  axios.delete("/adminapi/apply", { data: [row.id] }).then((res) => {
    // console.log(res);
    getItemTypeList();
    ElMessage.success("删除成功");
  });
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
    axios.delete("/adminapi/apply", { data: ids }).then((res) => {
      // console.log(res);
      getItemTypeList();
      ElMessage.success("删除成功");
    });
  }
};

// 分页相关内容
const currentPage = ref(1);
const pageSize = ref(5);
const pageSizes = ref([5, 10, 15, 20]);

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  currentPage.value = val;
  // 重新获取数据
  getItemTypeList();
};

const handleSizeChange = async (val) => {
  console.log(`每页 ${val} 条`);
  pageSize.value = val;
  // 重新获取数据
  getItemTypeList();
};

// 获取总数
const countNumber = ref(0);
const getCountNumber = () => {
  axios.get("/adminapi/apply/count").then((res) => {
    // console.log(res);
    countNumber.value = res.data.data;
  });
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
