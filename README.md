# 打卡系统

一个基于 Node.js 的简单打卡系统，帮助用户设定目标并进行每日打卡。

## 功能特点

- 用户系统：简单的用户名注册和登录
- 目标管理：添加、查看和删除目标
- 打卡功能：每天对目标进行打卡，记录进度
- 数据统计：展示打卡趋势、统计信息和完成率
- 设置页面：修改用户基本信息

## 技术栈

- 后端：Node.js + Express
- 数据库：MongoDB
- 前端：原生 HTML + CSS + JavaScript
- 图表：Chart.js

## 安装说明

1. 克隆项目：
```bash
git clone <repository-url>
cd checkin-system
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
创建 `.env` 文件并设置以下变量：
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/checkin-system
SESSION_SECRET=your-secret-key-here
```

4. 启动服务器：
```bash
npm start
```

5. 访问应用：
打开浏览器访问 `http://localhost:3000`

## 项目结构

```
checkin-system/
├── server/
│   ├── models/         # 数据模型
│   ├── routes/         # 路由处理
│   ├── public/         # 静态文件
│   └── app.js          # 主应用文件
├── .env               # 环境变量
├── package.json       # 项目配置
└── README.md         # 项目说明
```

## API 接口

### 认证接口

- POST `/api/auth/login` - 用户登录/注册
- POST `/api/auth/logout` - 用户登出
- GET `/api/auth/me` - 获取当前用户信息
- POST `/api/auth/update` - 更新用户信息

### 目标接口

- GET `/api/goals` - 获取所有目标
- POST `/api/goals` - 创建新目标
- DELETE `/api/goals/:id` - 删除目标
- GET `/api/goals/:id/checkin/today` - 检查今日打卡状态
- POST `/api/goals/:id/checkin` - 进行打卡
- GET `/api/goals/stats` - 获取统计数据

## 页面路由

- `/login` - 登录页面
- `/dashboard` - 仪表板
- `/goals` - 目标管理
- `/checkin` - 每日打卡
- `/report` - 数据统计
- `/settings` - 设置页面

## 开发说明

- 开发模式启动：
```bash
npm run dev
```

- 生产模式启动：
```bash
npm start
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 