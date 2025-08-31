import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "wxt"

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "CardTo",
    action: {
      default_popup: "./entrypoints/popup/index.html",
    },
    description: "卡兔截取当前网页内容，快速生产博客等网页进行短链接分享",
    commands: {
      "copy-as-markdown": {
        suggested_key: {
          default: "Ctrl+Shift+T",
          mac: "Command+W",
        },
        description: "复制当前页面内容为 Markdown",
      },
    },
    permissions: [
      "activeTab",
      "clipboardWrite",
      "scripting",
      "storage",
      "commands",
    ],
    host_permissions: ["<all_urls>"],
    web_accessible_resources: [
      {
        resources: ["youtube-main-world.js"],
        matches: ["*://*.youtube.com/*"],
      },
    ],
  },
  vite: () => ({
    plugins: [tailwindcss(), tsconfigPaths()],
  }),
  // 开发时的浏览器配置
  runner: {
    // 开发时自动打开的网站
    startUrls: ["https://juejin.cn/"],
    chromiumArgs: ["--auto-open-devtools-for-tabs"],
    // 自动打开开发者工具
    openDevtools: true,
    // 自动打开浏览器后台控制台
    openConsole: true,
  },
})
