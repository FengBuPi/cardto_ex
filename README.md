# CardTo - 浏览器扩展项目
卡兔截取当前网页内容，快速生产博客等网页进行短链接分享
这是一个基于 WXT (Web Extension Tools) 和 React 19 构建的现代浏览器扩展项目。

## 🚀 技术栈

### 核心框架
- **WXT** - 现代化的浏览器扩展开发工具
- **React 19** - 最新的 React 框架
- **TypeScript** - 类型安全的 JavaScript

### UI 组件库
- **Radix UI** - 无样式的可访问组件库
  - `@radix-ui/react-switch` - 开关组件
- **Lucide React** - 精美的图标库
- **Sonner** - 优雅的 Toast 通知组件

### 样式和动画
- **Tailwind CSS 4** - 实用优先的 CSS 框架
  - `@tailwindcss/vite` - Vite 集成
  - `tailwind-merge` - Tailwind 类名合并工具
  - `tw-animate-css` - Tailwind 动画扩展
- **Class Variance Authority** - 组件变体管理
- **clsx** - 条件类名工具

### 工具库
- **@fxts/core** - 函数式编程工具
- **ofetch** - 现代化的 fetch 封装
- **defuddle** - 代码混淆/反混淆工具
- **js-tiktoken** - OpenAI 的 tiktoken 分词器
- **srt-parser-2** - SRT 字幕文件解析器
- **turndown** - HTML 转 Markdown 工具

### 内容处理
- **@mozilla/readability** - Mozilla 的可读性解析器

### 开发工具
- **Biome** - 快速的 JavaScript/TypeScript 工具链
- **Taze** - 依赖更新工具
- **Vite TSConfig Paths** - Vite 路径别名支持

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── entrypoints/     # 扩展入口点
│   ├── popup/      # 弹出窗口
│   ├── background.ts # 后台脚本
│   └── content.ts  # 内容脚本
├── components/      # 可复用组件
├── utils/          # 工具函数
└── hooks/          # React Hooks
```

## 🛠️ 开发命令

```bash
# 开发模式
pnpm run dev

# 构建生产版本
pnpm run build

# Firefox 开发模式
pnpm run dev:firefox

# Firefox 构建
pnpm run build:firefox

# 打包扩展
pnpm run zip

# 类型检查
pnpm run compile
```

## 🎨 Tailwind CSS 配置

项目使用 Tailwind CSS 4，配置了以下特性：
- 响应式设计
- 暗色模式支持
- 自定义动画
- 组件变体系统

## 🔧 配置说明

### WXT 配置
- 使用 `src/` 目录结构
- 集成 React 模块
- 支持 TypeScript

### 开发工具
- Biome 用于代码格式化和检查
- TypeScript 严格模式
- Vite 作为构建工具

## 📦 依赖管理

项目使用 npm 作为包管理器，主要依赖包括：

### 生产依赖
- React 生态系统
- UI 组件库
- 内容处理工具
- 实用工具函数

### 开发依赖
- 类型定义
- 构建工具
- 代码质量工具
- 开发体验增强

## 🚀 快速开始

1. 克隆项目
2. 安装依赖：`pnpm install`
3. 启动开发服务器：`pnpm run dev`
4. 自动在浏览器中加载扩展

## 📝 注意事项

- 确保 Node.js 版本 >= 20
- 使用 pnpm 
- 遵循 WXT 的目录结构约定
- 使用 TypeScript 进行类型安全开发
