import { useEffect, useState } from "react"
import { browser } from "wxt/browser"
import { getOptions, type OptionsState, saveOptions } from "@/lib/storage"
import packageJson from "../../package.json"
import { ToggleOption } from "./components/ToggleOption"

export const App = () => {
  const [options, setOptions] = useState<OptionsState | null>(null)

  useEffect(() => {
    const loadOptions = async () => {
      const savedOptions = await getOptions()
      setOptions(savedOptions)
    }

    loadOptions()
  }, [])

  const handleOptionChange = async (
    key: keyof OptionsState,
    value: boolean,
  ) => {
    if (!options) return

    let newOptions = { ...options, [key]: value }

    if (key === "useReadability" && value) {
      newOptions = { ...newOptions, useDeffudle: false }
    } else if (key === "useDeffudle" && value) {
      newOptions = { ...newOptions, useReadability: false }
    }

    setOptions(newOptions)
    await saveOptions(newOptions)
  }

  const handleCopyCurrentPage = async () => {
    try {
      // 发送消息给 background script 来复制当前页面
      const response = await browser.runtime.sendMessage({ type: "COPY_TEXT" })
      console.log("Copy response:", response)
    } catch (error) {
      console.error("Failed to copy page:", error)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-background p-4 text-foreground">
      <header className="mb-4">
        <h1 className="font-bold text-xl">设置</h1>
      </header>

      <main className="space-y-1 rounded-lg border border-border bg-card p-6">
        {/* 复制当前页面按钮 */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCopyCurrentPage}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            复制当前页面为 Markdown
          </button>
        </div>

        <div className="mb-6 border-border border-t"></div>

        {options && (
          <>
            <ToggleOption
              title="使用 Deffudle"
              description="使用 Deffudle 进行内容解析，提供替代的解析方法。"
              checked={options.useDeffudle}
              onCheckedChange={(checked) =>
                handleOptionChange("useDeffudle", checked)
              }
              infoLink="https://github.com/kepano/defuddle"
            />

            <div className="border-border border-t"></div>

            <ToggleOption
              title="使用 Mozilla Readability"
              description="使用 Readability 解析网页内容，生成更清晰的 Markdown 输出"
              checked={options.useReadability}
              onCheckedChange={(checked) =>
                handleOptionChange("useReadability", checked)
              }
              infoLink="https://github.com/mozilla/readability"
            />

            <div className="border-border border-t"></div>

            {/* wrap in triple backticks */}
            <ToggleOption
              title="用三个反引号包装"
              description="用三个反引号包装复制的 Markdown 内容"
              checked={options.wrapInTripleBackticks}
              onCheckedChange={(checked) =>
                handleOptionChange("wrapInTripleBackticks", checked)
              }
            />

            <div className="border-border border-t"></div>

            <ToggleOption
              title="显示成功提示"
              description="内容成功复制后显示通知提示"
              checked={options.showSuccessToast}
              onCheckedChange={(checked) =>
                handleOptionChange("showSuccessToast", checked)
              }
            />

            <div className="border-border border-t"></div>

            <ToggleOption
              title="显示 Raycast 庆祝动画"
              description="复制成功后播放庆祝动画。提示：首次使用时 Chrome 可能会询问'打开 Raycast.app？'。访问 https://raycast.com/confetti 一次并勾选'始终允许 www.raycast.com 打开此类链接'以停止看到该提示。"
              checked={options.showConfetti}
              onCheckedChange={(checked) =>
                handleOptionChange("showConfetti", checked)
              }
              infoLink="https://x.com/raycastapp/status/1691464764516343808"
            />
          </>
        )}
      </main>

      <footer className="mt-4 text-center text-muted-foreground text-xs">
        <p>cpdown v{packageJson.version} — 将任何网页复制为干净的 Markdown</p>
      </footer>
    </div>
  )
}
