# 校园监控综合管理平台

## 项目结构

```
├─client               # frontend source folder
│  ├─build             # frontend dev scripts
│  ├─src               # frontend src
│  │  ├─assets
│  │  │  ├─css
│  │  │  ├─fonts
│  │  │  └─images
│  │  ├─components     # vue components
│  │  ├─http           # vue-resource configuration
│  │  ├─locale         # vue-i18n configuration
│  │  ├─router         # vue-router configuration
│  │  ├─socket         # socket.io configuration
│  │  ├─storage        # web storage api
│  │  ├─store          # vuex store
│  │  │  └─modules
│  │  └─view           # app pages
│  │     └─auth
│  └─static            # static folder
└─server               # backend server folder
    ├─api              # backend api list
    │  └─user
    ├─auth             # user auth logical
    │  └─local
    ├─components       # server components
    │  └─errors
    ├─config           # server configs, contains express socket.io, etc.
    └─views            # server servered pages
```

## 环境约定

- 统一使用 Visual Studio Code
- 必备插件：ESLint / Vetur / vscode-icons / Prettier / DotENV / SVN
- 依赖包通一使用 yarn 命令来管理
- 环境变量统一在 .env 文件中设置

## 运行命令

- 安装依赖 yarn
- 本地调试项目：yarn dev:client
- 本地调试 Server：yarn dev:server
- 打包客户端：yarn build
- 客户端语法检测和修复：yarn lint-client-fix
- 服务端语法检测和修复：yarn lint-server-fix
- <font color=red>生产环境</font>
  启动 Server：yarn daemon 或 npm run daemon
- <font color=red>生产环境</font>
  停止 Server：yarn stop 或 npm run stop


 
 
 
    