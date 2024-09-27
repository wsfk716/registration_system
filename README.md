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

各表设计如下：

```sql
-- 报名列表
-- auto-generated definition
create table apply
(
  id          int auto_increment
  primary key,
  type_id     int           not null,
  typename    varchar(32)   not null,
  is_delete   int default 0 not null,
  description varchar(128)  null,
  is_show     int default 0 not null,
  begin_time  datetime      not null,
  end_time    datetime      not null
)
    comment '报名列表';

    -- 黑名单
-- auto-generated definition
create table blacklist
(
  id           int auto_increment
  primary key,
  user_id      int           not null,
  is_delete    int default 0 not null,
  name         varchar(24)   not null comment '用户名',
  grade        int           not null,
  professional varchar(32)   not null comment '专业',
  description  varchar(128)  null comment '描述',
  add_time     datetime      not null,
  school       varchar(64)   not null comment '学校'
)
    comment '黑名单';

    -- 报名信息表
-- auto-generated definition
create table information
(
  id            int auto_increment
  primary key,
  user_id       int                        not null comment '用户id',
  name          varchar(32)                not null,
  apply_id      int                        not null,
  is_delete     int         default 0      not null,
  user_add_time datetime                   not null,
  school        varchar(32)                not null,
  professional  varchar(32) default '其他' not null comment '专业',
  grades        int                        not null comment '年级',
  phone         varchar(32)                not null,
  email         varchar(128)               not null,
  sex           varchar(24)                not null
)
    comment '报名信息表';

    -- 权限列表
-- auto-generated definition
create table menu
(
  id   int auto_increment comment '主键id'
  primary key,
  name varchar(32)   not null comment '菜单名称',
  path varchar(64)   not null comment '路径',
  icon varchar(32)   not null comment '菜单的图标',
  pid  int default 0 not null
)
    comment '权限列表';

    -- 用户角色列表
-- auto-generated definition
create table role
(
  id          int auto_increment comment '主键id'
  primary key,
  role_name   varchar(32)                         not null comment '角色名称',
  is_delete   int          default 0              not null comment '0 启用， 1 禁用',
  description varchar(128) default '暂无具体描述' not null comment '描述',
  rights      json                                null comment '角色所拥有的权限'
)
    comment '用户角色列表';


-- 用户列表
-- auto-generated definition
create table user
(
  id          int auto_increment comment '主键id'
  primary key,
  user_name   varchar(32)                            not null comment '用户名',
  password    varchar(32) default '123'              not null comment '密码',
  role_id     int                                    not null comment '角色ID',
  description varchar(64) default '暂无具体描述信息' not null comment '描述',
  is_delete   int         default 0                  not null comment '是否已经被删除，0 : 启用， 1：已经被删除'
)
    comment '用户列表';
```

​

### 三、后端

#### 3.1 项目资源一览：

![review](G:\Mark_text\Mynote\项目实战\在线报名系统.assets\QQ_1727423615527-1727423650702-2.png)

#### 3.2 Jwt 的使用

配置 Jwt 的主要过程如下：

##### 3.2.1 引入依赖/ 配置参数

```xml
<!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.1</version>
        </dependency>
        <dependency>
            <groupId>com.auth0</groupId>
            <artifactId>java-jwt</artifactId>
            <version>3.19.2</version>
        </dependency>
        <!--jdk大于8时需要添加-->
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
        </dependency>
```

在 application.yaml 中配置：

```yaml
config:
  jwt:
    secret: 123456 # 密钥
    expire: 36000 # 过期时间
    header: token # 请求头名称
```

##### 3.2.2 创建 JwtConfig 配置类

```java
package com.registration.registration_system.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;

@ConfigurationProperties(prefix = "config.jwt", ignoreUnknownFields = true)
@Component
@Data
public class JwtConfig {
    private String secret;
    private long expire;
    private String header;

    // 生成token
    public String createToken(String subject) {
        // 当前时间与过期时间
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + expire*1000);
        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setSubject(subject) // 设置主题
                .setIssuedAt(now)  // 设置签发时间
                .setExpiration(expireDate)  // 设置过期时间
                .signWith(SignatureAlgorithm.HS512, secret)  // 设置签名
                .compact();
    }
    // 解析token
    public Claims getTokenClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 获取token中的用户名
    public String getUsernameFromToken(String token) {
        Claims claims = getTokenClaims(token);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
    }
}

```

##### 3.2.3 创建一个拦截器 TokenInterceptor，添加 JwtConfig 配置类

```java
package com.registration.registration_system.config;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@AllArgsConstructor
public class TokenInterceptor extends HandlerInterceptorAdapter {
    private final JwtConfig jwtConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
       // 获取请求头中的token
        String token = request.getHeader(jwtConfig.getHeader());

        // 如果token为空
        if(StringUtils.isEmpty(token)) {
            sendError(response, "token为空");
            return false;
        }
        // 解析token
        try {
            jwtConfig.getTokenClaims(token);
        } catch (Exception e) {
            sendError(response, "token过期或不正确，请重新登录");
            return false;
        }
        return true;
    }
    // 返回错误信息
    private void sendError(HttpServletResponse response, String message) {
        response.setStatus(401);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().write(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

##### 3.2.4 添加自定义的拦截器到 webConfig 配置类中

```java
package com.registration.registration_system.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
@AllArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final TokenInterceptor tokenInterceptor;

    /**
     * 拦截器配置
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(tokenInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/adminapi/user/login/**");
    }

    /**
     * 跨域配置
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        WebMvcConfigurer.super.addCorsMappings(registry);
    }
}

```

到此，就已经配置好了 jwt，使用示例如下，我们希望在调用登录接口的时候生成 token 并返回，主要代码可以在 serviceImpl 中实现：

```java
/**
* 登录
* @param user
* @return
*/
@Transactional
@Override
public UserVo login(User user) {
  User new_user = userMapper.selectUser(user);
  if (new_user == null) {
    return null;
  } else {
    // 创建vo
    UserVo vo = new UserVo();
    BeanUtils.copyProperties(new_user, vo);
    // 生成token
    String token = jwtConfig.createToken(new_user.getUserName());
    vo.setToken(token);
    // 查询role
    Role role = new Role();
    role.setId(new_user.getRoleID());
    List<Role> roleList = roleMapper.selectRoleList(role);
    // 设置role为roleList的第一个
    vo.setRole(roleList.get(0));
    return vo;
  }
}
```

#### 3.3 PageHelper 分页插件

##### 3.3.1 引入依赖

```xml
<!--分页插件-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.4.6</version>
        </dependency>
        <dependency>
            <groupId>com.github.jsqlparser</groupId>
            <artifactId>jsqlparser</artifactId>
            <version>4.2</version>
        </dependency>
```

##### 3.3.2 使用

```java
		/**
     * 获取报名列表
     * @return
     */
    @Override
    public PageInfo<Apply> getApplyList(ApplyDto applyDto) {
        PageHelper.startPage(applyDto.getPageNum(), applyDto.getPageSize());
        Apply apply = new Apply();
        BeanUtils.copyProperties(applyDto, apply);
        List<Apply> applyList = applyMapper.selectApplyList(apply);
      return new PageInfo<>(applyList);
    }

```

分页插件的使用实际上非常简单，

首先，从前端接收到 pageNum 和 PageSize 之后，我们在 serviceImpl 层调用 mapper 接口之前，调用 PageHelper.startPage 来设置查询的数量和当前页。

然后我们正常进去查询，代码中所示是因为要有符合 mapper 接口的参数传入所以重新 new 了一个 apply。

最后，返回一个 PageInfo<>类型的对象。

#### 3.4 实现数据表导出成 excel 格式

```java
		/**
     * 导出信息
     * @param informationDto
     * @param response
     * @throws IOException
     */
    @Override
    public void exportInformation(InformationDto informationDto, HttpServletResponse response) throws IOException {
        // 创建一个 InformationVo 对象，并将 informationDto 的属性复制到该对象中
        InformationVo vo = new InformationVo();
        BeanUtils.copyProperties(informationDto, vo);

        // 创建一个空的列表，用于存储导出的数据
        List<Map<String, Object>> list = CollUtil.newArrayList();
        // 从数据库中查询信息列表
        List<InformationVo> infoList = informationMapper.selectInfoList(vo);

        // 遍历查询到的信息列表，将每条信息转换为 Map 并添加到 list 中
        for (InformationVo info : infoList) {
            Map<String, Object> row1 = new LinkedHashMap<>();
            row1.put("用户编号", info.getUserId());
            row1.put("姓名", info.getName());
            row1.put("性别", info.getSex());
            row1.put("参报项目", info.getTypeName());
            row1.put("报名时间", info.getUserAddTime());
            row1.put("学校", info.getSchool());
            row1.put("年级", info.getGrades());
            row1.put("专业", info.getProfessional());
            row1.put("手机号码", info.getPhone());
            row1.put("邮箱", info.getEmail());

            // 将每条信息的 Map 添加到 list 中
            list.add(row1);
        }

        // 创建一个 ExcelWriter 对象，用于写入 Excel 文件
        ExcelWriter writer = ExcelUtil.getWriter(true);
        // 一次性写出内容，强制输出标题
        writer.write(list, true);

        // 设置响应头，指定内容类型和文件名
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8");
        String fileName = URLEncoder.encode("下载信息", "UTF-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");

        // 获取响应的输出流
        ServletOutputStream out = response.getOutputStream();
        // 将 ExcelWriter 中的数据刷新到输出流中
        writer.flush(out, true);
        // 关闭 ExcelWriter，释放内存
        writer.close();
        // 关闭输出流
        IoUtil.close(System.out);
    }
```

Controller 层接收一个额外参数 response，然后我们在 Service 实现类中，先查询需要导入的数据，然后生成表头，最后写入 Excel 文件。

### 四、前端

本节主要记录在进行前端开发时所用到的一些插件

#### 4.1 js-file-download

`js-file-download` 是一个用于在浏览器中触发文件下载的 JavaScript 库。它可以方便地将数据（如文本、JSON、二进制数据等）下载为文件，而无需服务器端的支持。这个库非常适合用于前端应用程序中需要生成和下载文件的场景。

##### 4.1.1 安装

```
npm install js-file-download
# 或者
yarn add js-file-download
```

##### 4.2.2 使用

```vue
<template>
  <div>
    <el-button type="success" @click="handleExport">
      导出
      <el-icon><Download /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import fileDownload from "js-file-download";

const handleExport = async () => {
  try {
    const res = await axios.get(
      `/adminapi/user/export?userName=${searchValue.value.userName}&roleName=${searchValue.value.roleName}`,
      {
        responseType: "blob",
      }
    );
    // console.log(res);
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

<style scoped>
/* 添加你的样式 */
</style>
```

这段代码使用 [`axios`](vscode-file://vscode-app/f:/Microsoft VS Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) 发送 GET 请求以获取用户列表的 Excel 文件，并使用 `js-file-download` 库在浏览器中触发文件下载，同时显示导出成功或失败的消息。

#### 4.2 tsparticles

`tsparticles` 是一个用于创建和管理粒子动画效果的 JavaScript 库。它可以在网页上生成各种粒子效果，如雪花、星空、气泡等，适用于背景动画、交互效果等场景。这个库非常灵活，支持多种配置和自定义效果。

##### 4.2.1 安装

```
npm install tsparticles
# 或者
yarn add tsparticles
```

##### 4.2.2 使用

```vue
<template>
  <vue-particles
    id="tsparticles"
    @particles-loaded="particlesLoaded"
    :options="tsOption"
  />
</template>

<script setup>
import tsOption from "@/utils/tspartice.js";

// 粒子效果
const particlesLoaded = async (container) => {
  console.log("Particles container loaded", container);
};
</script>

<style scoped></style>
```

其中，tspartice.js 文件 (由于内容过多显示部分)：

```javascript
const option = {
  autoPlay: true,
  background: {
    color: {
      value: "#043564",
    },
    image: "url('./bg.png')",
    position: "0 50%",
    repeat: "no-repeat",
    size: "100%",
    opacity: 1,
  },
  backgroundMask: {
    composite: "destination-out",
    cover: {
      color: {
        value: "#fff",
      },
      opacity: 1,
    },
    enable: false,
  },
  clear: true,
  defaultThemes: {},
  delay: 0,
  fullScreen: {
    enable: true,
    zIndex: 0,
  },
  ...
};

export default option;

```

#### 4.3 dayjs

`dayjs` 是一个轻量级的 JavaScript 日期库，具有与 `Moment.js` 类似的 API，但体积更小，性能更高。它用于解析、验证、操作和显示日期和时间。

1. **解析日期**：支持多种日期格式的解析。
2. **格式化日期**：可以将日期格式化为各种字符串格式。
3. **操作日期**：支持日期的加减操作。
4. **本地化**：支持多种语言的本地化。
5. **插件系统**：通过插件扩展功能，如相对时间、UTC、时区等。

##### 4.3.1 安装

```
npm install dayjs
# 或者
yarn add dayjs
```

##### 4.3.2 使用

```javascript
import dayjs from "dayjs";

// 解析日期
const now = dayjs();
console.log(now.format()); // 当前日期和时间

// 格式化日期
const formattedDate = now.format("YYYY-MM-DD");
console.log(formattedDate); // 例如：2023-10-01

// 操作日期
const nextWeek = now.add(7, "day");
console.log(nextWeek.format("YYYY-MM-DD")); // 例如：2023-10-08

// 本地化
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
console.log(now.format("MMMM D, YYYY")); // 例如：十月 1, 2023
```

#### 4.4 其他插件

##### 4.4.1 ECharts

**主要功能**: ECharts 是一个基于 JavaScript 的图表库，支持多种图表类型（如折线图、柱状图、饼图等），并提供丰富的交互功能。适合用于可视化数据展示。

**安装方法**:

```
npm install echarts --save
```

##### 4.4.2 Element Plus 和 @element-plus/icons-vue

**主要功能**:

- **Element Plus**: 一个基于 Vue 3 的 UI 组件库，提供了一系列高质量的组件，帮助开发者快速构建用户界面。
- **@element-plus/icons-vue**: 提供 Element Plus 组件库的图标集，方便在项目中使用。

**安装方法**:

```
npm install element-plus --save
npm install @element-plus/icons-vue --save
```

##### 4.4.3 Vue Router

**主要功能**: Vue Router 是 Vue.js 官方的路由管理器，允许开发者创建单页应用程序（SPA）时实现页面导航。支持动态路由匹配、嵌套路由等功能。

**安装方法**:

```
npm install vue-router@4 --save
```

##### 4.4.4 Pinia 和 pinia-plugin-persistedstate

**主要功能**:

- **Pinia**: Vue 3 的状态管理库，提供了简单易用的 API 和类型支持，成为 Vuex 的替代品。
- **pinia-plugin-persistedstate**: Pinia 的一个插件，用于将状态持久化存储到本地存储或其他存储方案，以便在页面刷新后保持状态。

**安装方法**:

```
npm install pinia --save
npm install pinia-plugin-persistedstate --save
```

##### 4.4.5 @amap/amap-jsapi-loader

**主要功能**: AMap JavaScript API Loader 是一个加载高德地图 JavaScript API 的工具，简化了 API 的引入和使用，使得开发者能够方便地在 Vue 项目中集成高德地图服务。

**安装方法**:

```
npm install @amap/amap-jsapi-loader --save
```
