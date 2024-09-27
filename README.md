## 在线报名系统

### 一、项目介绍

#### 1.1 项目介绍

本项目为一个报名系统，实现了基本的报名流程，功能完善。

#### 1.2 技术架构

主要技术栈： SpringBoot2 + Vue3 + MySQL8.0

#### 1.3 主要功能

角色设计： 管理员/普通用户(报名者)

首页

数据信息

​ 报名详情 / 报名表 / 黑名单 / 信息列表

权限设置

​ 角色管理 / 用户管理

系统设置

​ 修改密码

管理员默认拥有所有权限，而普通用户则只拥有 首页/ 数据信息（报名详情、报名表）/ 系统设置（修改密码）

1.4 运行项目

前端：

```
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

高德地图密钥配置：在 MapContrainer.vue 中配置高德地图的密钥 ，如果没有请先去高德地图开发者平台注册

```vue
window._AMapSecurityConfig = { securityJsCode: "你的安全密钥", };
AMapLoader.load({ key: "Web端开发者Key", // 申请好的Web端开发者Key，首次调用
load 时必填 version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
plugins: ["AMap.Geolocation"], // 只使用 Geolocation 插件 })
```

启动，访问 http://localhost:5173/

后端：

要启动你的项目，其他开发者需要按照以下步骤操作：

1. **配置环境**：
   确保安装了以下环境和工具：

   - JDK 8 或更高版本
   - Maven
   - MySQL 数据库

2. **配置数据库**：

   - 创建一个新的 MySQL 数据库。

   - 在 `src/main/resources/application.yaml 文件中配置数据库连接信息：

     ```properties
       datasource:
         driver-class-name: com.mysql.cj.jdbc.Driver
         url: jdbc:mysql://localhost:3306/registration_system?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=UTF-8
         username: # 账号
         password: # 密码
     ```

3. **安装依赖**：
   使用 Maven 安装项目依赖：

   ```sh
   mvn clean install
   ```

4. 运行项目，打开浏览器，访问 http://localhost:8085。

通过以上步骤，其他开发者应该能够成功启动并运行你的项目。

### 二、数据库设计

此项目共包含 6 张表； apply 报名表、 blacklist 黑名单、 information 报名信息表、menu 权限菜单表、 role 角色表、 user 用户表。
