import { browser } from "wxt/browser"
import { showNotification } from "@/lib/showNotification"

// 辅助函数：检查URL是否可以注入脚本
function isInjectableUrl(url?: string): boolean {
  if (!url) return false

  const restrictedProtocols = [
    "chrome:",
    "chrome-extension:",
    "moz-extension:",
    "edge-extension:",
    "about:",
    "data:",
    "javascript:",
    "moz-extension:",
    "chrome-search:",
    "chrome-devtools:",
  ]

  const restrictedUrls = [
    "chrome://newtab/",
    "edge://newtab/",
    "about:newtab",
    "about:blank",
  ]

  // 检查URL是否以任何受限协议开头
  if (restrictedProtocols.some((protocol) => url.startsWith(protocol))) {
    return false
  }

  // 检查URL是否在受限URL列表中
  if (restrictedUrls.some((restrictedUrl) => url.startsWith(restrictedUrl))) {
    return false
  }

  return true
}

// background.ts - 用户点击扩展图标或使用快捷键
export default defineBackground(() => {
  browser.action.onClicked.addListener(() => {
    copyCurrentPageAsMarkdown()
  })

  browser.commands.onCommand.addListener((command) => {
    if (command === "copy-as-markdown") {
      copyCurrentPageAsMarkdown()
    } else {
      console.log("未知命令:", command)
    }
  })

  // 监听来自内容脚本的消息，以打开Raycast庆祝效果，而不触发页面级提示
  browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === "OPEN_CONFETTI") {
      // 捕获当前活动标签页，以便焦点可以保持在那里
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(([_currentTab]) => {
          // 在后台打开庆祝效果重定向标签页
          browser.tabs
            .create({ url: "https://raycast.com/confetti", active: false })
            .then((confettiTab) => {
              if (!confettiTab.id) return

              // 短暂延迟后自动关闭庆祝效果标签页
              setTimeout(() => {
                browser.tabs.remove(confettiTab.id!).catch(() => {
                  /* 标签页已关闭 */
                })
              }, 2000) // 2秒足够重定向和执行Raycast
            })
            .catch((err) => {
              console.error("打开庆祝效果标签页失败:", err)
            })
        })
    } else if (msg.type === "COPY_TEXT") {
      // 处理来自popup的复制请求
      copyCurrentPageAsMarkdown()
    }
  })

  async function copyCurrentPageAsMarkdown() {
    try {
      // 获取当前活动标签页
      const [activeTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!activeTab.id) {
        console.error("活动标签页没有ID")
        showNotification("错误：无法识别当前标签页", "error")
        return
      }

      const url = activeTab.url

      // 检查URL是否可以注入
      if (!isInjectableUrl(url)) {
        console.log("无法向受限URL注入脚本:", url)
        showNotification(
          "无法从此页面复制内容。这是一个受限页面（浏览器内部页面、扩展页面等）",
          "warning",
        )
        return
      }

      const isYoutube = url?.includes("youtube.com")

      if (url && isYoutube) {
        const { searchParams } = new URL(url)

        const videoId = searchParams.get("v")

        if (!videoId) {
          throw new Error("未找到视频ID")
        }

        browser.tabs.sendMessage(activeTab.id!, {
          type: "COPY_YOUTUBE_SUBTITLE",
          payload: videoId,
        })

        return
      }

      // 在标签页中执行脚本以获取body内容
      const results = await browser.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          return document.body.outerHTML
        },
      })

      // 结果是一个执行结果数组
      if (results && results.length > 0 && results[0].result) {
        const bodyContent = results[0].result
        console.log("页面内容:", bodyContent)

        browser.tabs.query({ active: true, currentWindow: true }, () => {
          browser.tabs.sendMessage(activeTab.id!, {
            type: "COPY_TEXT",
            payload: bodyContent,
          })
        })
      }
    } catch (error) {
      console.error("获取页面内容时出错:", error)

      // 处理特定错误类型
      if (error instanceof Error) {
        if (error.message.includes("Cannot access contents of the page")) {
          showNotification(
            "无法访问此页面。页面可能受限、仍在加载中，或者您可能需要刷新页面后重试。",
            "error",
          )
        } else if (error.message.includes("Extension context invalidated")) {
          showNotification(
            "扩展已重新加载。请刷新页面后重试。",
            "warning",
          )
        } else {
          showNotification(
            `复制页面内容失败: ${error.message}`,
            "error",
          )
        }
      } else {
        showNotification(
          "复制页面内容时发生意外错误",
          "error",
        )
      }
    }
  }
})
