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
          mac: "Ctrl+T",
        },
        description: "复制当前页面内容",
      },
    },
    permissions: ["activeTab", "clipboardWrite", "scripting", "storage"],
    host_permissions: ["<all_urls>"],
    web_accessible_resources: [
      {
        resources: ["youtube-main-world.js"],
        matches: ["*://*.youtube.com/*"],
      },
    ],
  },
  vite: () => ({
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
    ],
  }),
})
