# 部署说明

## 当前交付物

这是一个无需编译的静态 Web 原型。发布目录是 dist，构建检查命令是 npm run build。项目不依赖数据库、服务器接口、第三方登录或环境变量；页面中的体验身份、课程进度、人员导入与配置仅保存在访问者自己的浏览器 localStorage / sessionStorage 中。

因此部署后每位访问者都会从各自独立的示例数据开始。它适合演示、作品集和原型评审，不应录入真实员工名单、学习记录或其他个人信息。

## 上线前检查

1. 安装 Node.js 24 或更高版本。
2. 在项目根目录运行 npm run build。成功时会确认页面入口与所有本地资源齐全。
3. 可选地运行 npm run preview，然后访问 http://localhost:4173。
4. 在浏览器中分别体验员工端与 HR 管理端，尤其检查课程、导入文件和数据导出流程。

## 推送到 GitHub

建议先创建私有 GitHub 仓库；原型内含示例员工与培训数据，确认可以公开展示后再改为公开。

    git init
    git add .
    git commit -m "Prepare learning platform prototype for deployment"
    git branch -M main
    git remote add origin https://github.com/<OWNER>/<REPOSITORY>.git
    git push -u origin main

不要提交 .env、平台访问令牌、真实员工资料或导出的表格。.gitignore 已默认排除本地环境变量与平台配置目录。

## 部署到 Vercel

1. 在 Vercel 中选择 Add New → Project，导入刚推送的 GitHub 仓库。
2. Framework Preset 选择 Other；项目会读取仓库内的 vercel.json。
3. 核对：Build Command 为 npm run build，Output Directory 为 dist，Node.js 为 24 或更高。
4. 当前版本不需要填写环境变量；保持为空。
5. 点击 Deploy。之后向 main 分支推送会自动产生新的部署。

## 部署到 Cloudflare Pages

1. 在 Cloudflare Dashboard 中选择 Workers & Pages → Create → Pages → Connect to Git，授权并选择该 GitHub 仓库。
2. Production branch 选择 main。
3. Build command 填 npm run build，Build output directory 填 dist；Node.js 选择 24 或更高。
4. 当前版本不需要环境变量，点击 Save and Deploy。

仓库里的 wrangler.toml 同时声明了同一静态输出目录，供使用 Wrangler CLI 或 Cloudflare 的配置识别使用。若 Cloudflare Pages 项目名不同，可在第一次创建项目时使用该名称或改写 name，不要复制任何账户令牌到该文件。

## 何时需要后端

若要把原型变成真实培训系统，至少应补充：企业身份认证与角色权限、受保护的服务端 API、数据库、课程文件/视频存储、考试与成绩校验、审计日志、个人信息保留与删除规则。届时需要为 Vercel Functions / Cloudflare Workers 及相应数据库单独设计架构；不能把这些能力建立在浏览器 localStorage 上。

