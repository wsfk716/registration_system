<template>
  <vue-particles
    id="tsparticles"
    @particles-loaded="particlesLoaded"
    :options="tsOption"
  />

  <div class="box">
    <div class="login">
      <div class="left"></div>
      <!-- -------------默认是登录表单---------------- -->
      <div class="right" v-if="flag">
        <div class="title">在线报名系统</div>
        <el-form
          ref="loginFormRef"
          style="width: 450px"
          :model="loginForm"
          status-icon
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="userName" style="font-size: 24px">
            <el-input v-model="loginForm.userName" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item class="handleForm">
            <el-button
              type="primary"
              style="width: 40%; border-radius: 20px"
              @click="submitLoginForm(loginFormRef)"
            >
              登录
            </el-button>
            <el-button
              type="primary"
              style="width: 40%; border-radius: 20px"
              @click="submitRegisterForm()"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        <div class="copyright">
          <div>页面设计：我是浮夸 后台开发：我是浮夸</div>
          <div>© 2024-2025 版权所有 联系方式：1830994325@qq.com</div>
        </div>
      </div>
      <!-- ----------- 注册的内容 ---------------------->
      <div class="right" v-else>
        <div class="title-re">在线报名系统</div>
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addRules"
          label-width="auto"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="角色类型" prop="roleId">
            <el-input
              v-model="addForm.roleName"
              :disabled="true"
              placeholder="默认为普通用户，如需变更请联系管理员"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="addForm.password"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="RPassword">
            <el-input
              v-model="addForm.RPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="description"
            placeholder="简单介绍一下自己吧~"
          >
            <el-input v-model="addForm.description" />
          </el-form-item>
        </el-form>

        <div class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="submitAddForm"> 确定 </el-button>
          <el-button @click="cancelAddForm">取消</el-button>
        </div>

        <div class="copyright">
          <div>页面设计：我是浮夸 后台开发：我是浮夸</div>
          <div>© 2024-2025 版权所有 联系方式：1830994325@qq.com</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/userStore";
import path from "@/router";
import tsOption from "@/utils/tspartice.js";

const flag = ref(true);
const { user, changeUser } = useUserStore();
const loginForm = ref({
  userName: "",
  password: "",
});
const loginFormRef = ref(null);
const submitLoginForm = () => {
  // console.log(loginForm.value);
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await axios.post("/adminapi/user/login", loginForm.value);
      if (res.data.code === 1) {
        ElMessage.success("登录成功");
        // 保存用户信息
        changeUser(res.data.data);
        // 重定向到mainbox
        path.push("/home");
      } else {
        ElMessage.error(res.data.msg);
        return false;
      }
    } else {
      ELMessage.error("校验失败，请检查输入!");
      return false;
    }
  });
};
const rules = {
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
// 粒子效果
const particlesLoaded = async (container) => {
  console.log("Particles container loaded", container);
};

// ----------------------注册相关内容--------------------------------------------

// 获取角色列表
const addForm = ref({
  userName: "",
  roleID: "2",
  password: "",
  RPassword: "",
});
const addFormRef = ref(null);
const addRules = ref({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  RPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === addForm.value.password) {
          callback();
        } else {
          callback(new Error("两次输入密码不一致"));
        }
      },
      trigger: "blur",
    },
  ],
});
// 注册
const submitRegisterForm = () => {
  flag.value = false;
};

// 取消注册
const cancelAddForm = () => {
  flag.value = true;
  addForm.value = {
    userName: "",
    roleID: "2",
    password: "",
    RPassword: "",
  };
};

// 提交注册
const submitAddForm = async () => {
  if (addFormRef.value.validate()) {
    try {
      const res = await axios.post("/adminapi/user/login/register", {
        userName: addForm.value.userName,
        password: addForm.value.password,
        roleID: addForm.value.roleID,
      });
      if (res.data.code === 1) {
        ElMessage.success("注册成功");
        flag.value = true;
      } else {
        ElMessage.error(res.data.data);
      }
    } catch (error) {
      ElMessage.error("注册失败");
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .login {
    display: flex;
    height: 500px;
    width: 800px;
    border-radius: 15px;
    border: 5px solid #ccc;
    align-items: center;
    padding: 20px;
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 0.5s ease; /* 添加过渡效果 */
    .left {
      height: 90%;
      width: 350px;
      border-radius: 10px;
      background-image: url("./login-left.jpg");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .right {
      width: 450px;
      height: 90%;
      display: block;
      padding-left: 20px;
      align-items: center;
      justify-content: center;
      position: relative;
      .title {
        width: 100%;
        font-size: 36px;
        font-weight: bold;
        text-align: center;
        padding: 20px;
        color: #000;
        padding-top: 100px;
      }
      .title-re {
        width: 100%;
        font-size: 36px;
        font-weight: bold;
        text-align: center;
        padding: 20px;
        color: #000;
        padding-top: 50px;
      }
      .handleForm {
        margin-left: 25%;
        padding: 25px;
        align-items: center;
      }
      .copyright {
        position: absolute;
        bottom: 0;
        width: 100%;
        font-size: 12px;
        color: #000;

        text-align: center;
      }
    }
  }
  .login:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }
}
</style>
