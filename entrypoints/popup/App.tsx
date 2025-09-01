import { createTranslator, type Language } from "@/lib/i18n"
import { getOptions, type OptionsState, saveOptions } from "@/lib/storage"
import { useCallback, useEffect, useId, useMemo, useState } from "react"
import { browser } from "wxt/browser"
import packageJson from "../../package.json"
import { ToggleOption } from "./components/ToggleOption"

export const App = () => {
  const [options, setOptions] = useState<OptionsState | null>(null)

  const t = useMemo(
    () => createTranslator(options?.language ?? "zh"),
    [options?.language],
  )

  const languageSelectId = useId()

  const loadOptions = useCallback(async () => {
    const savedOptions = await getOptions()
    setOptions(savedOptions)
  }, [])

  useEffect(() => {
    loadOptions()
  }, [loadOptions])

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

  const handleLanguageChange = async (lang: Language) => {
    if (!options) return
    const newOptions = { ...options, language: lang }
    setOptions(newOptions)
    await saveOptions({ language: lang })
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
        <h1 className="font-bold text-xl">{t("common.settings")}</h1>
      </header>

      <main className="space-y-1 rounded-lg border border-border bg-card p-6">
        {/* Language selector */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <label htmlFor={languageSelectId} className="font-medium text-sm">
            {t("common.language")}
          </label>
          <select
            id={languageSelectId}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            value={options?.language ?? "zh"}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Copy current page button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCopyCurrentPage}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t("common.copyButton")}
          </button>
        </div>

        <div className="mb-6 border-border border-t"></div>

        {options && (
          <>
            <ToggleOption
              title={t("options.deffudle.title")}
              description={t("options.deffudle.description")}
              checked={options.useDeffudle}
              onCheckedChange={(checked) =>
                handleOptionChange("useDeffudle", checked)
              }
              infoLink="https://github.com/kepano/defuddle"
            />

            <div className="border-border border-t"></div>

            <ToggleOption
              title={t("options.readability.title")}
              description={t("options.readability.description")}
              checked={options.useReadability}
              onCheckedChange={(checked) =>
                handleOptionChange("useReadability", checked)
              }
              infoLink="https://github.com/mozilla/readability"
            />

            <div className="border-border border-t"></div>

            {/* wrap in triple backticks */}
            <ToggleOption
              title={t("options.wrapInTripleBackticks.title")}
              description={t("options.wrapInTripleBackticks.description")}
              checked={options.wrapInTripleBackticks}
              onCheckedChange={(checked) =>
                handleOptionChange("wrapInTripleBackticks", checked)
              }
            />

            <div className="border-border border-t"></div>

            <ToggleOption
              title={t("options.showSuccessToast.title")}
              description={t("options.showSuccessToast.description")}
              checked={options.showSuccessToast}
              onCheckedChange={(checked) =>
                handleOptionChange("showSuccessToast", checked)
              }
            />

            <div className="border-border border-t"></div>

            <ToggleOption
              title={t("options.showConfetti.title")}
              description={t("options.showConfetti.description")}
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
        <p>
          CardTo v{packageJson.version} — {t("common.footer")}
        </p>
      </footer>
    </div>
  )
}
