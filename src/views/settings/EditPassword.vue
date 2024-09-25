<template>
  <div class="edit-password-container">
    <div class="edit-password-form">
      <div class="header">用户名：{{ user.userName }}</div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="当前密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" />
        </el-form-item>
        <el-form-item label="确认密码" prop="exactPassword">
          <el-input v-model="ruleForm.exactPassword" />
        </el-form-item>
        <el-form-item class="button-container">
          <el-button
            style="margin-left: 35%"
            type="primary"
            @click="submitForm()"
          >
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const { user, changeUser } = useUserStore();
const ruleFormRef = ref(null);
const ruleForm = ref({
  password: "",
  newPassword: "",
  exactPassword: "",
});

onMounted(() => {
  console.log(user);
});

const validatePassword = async (rule, value, callback) => {
  try {
    if (value === user.password) {
      callback();
    } else {
      callback(new Error("当前密码不正确"));
    }
  } catch (error) {
    callback(new Error("验证密码失败"));
  }
};

const rules = ref({
  password: [
    { required: true, message: "请输入当前密码", trigger: "blur" },
    { validator: validatePassword, trigger: "blur" },
  ],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  exactPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== ruleForm.value.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

const submitForm = async () => {
  if (ruleFormRef.value.validate()) {
    axios
      .put(`/adminapi/user/${user.id}`, {
        password: ruleForm.value.newPassword,
      })
      .then((res) => {
        console.log(res);
        ElMessage.success("修改成功");
        router.push("/login");
        ruleFormRef.value.resetFields();
      });
  }
};
</script>

<style lang="scss" scoped>
.edit-password-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 50px; /* 添加顶部内边距，使内容向下移动 */
}

.edit-password-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdfe6;
  width: 400px;
  text-align: center;
}

.header {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px; /* 按钮之间的间距 */
}
</style>
