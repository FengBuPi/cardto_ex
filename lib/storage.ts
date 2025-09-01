import { browser } from "wxt/browser"
import type { Language } from "./i18n"

export type OptionsState = {
  useDeffudle: boolean
  useReadability: boolean
  wrapInTripleBackticks: boolean
  showSuccessToast: boolean
  showConfetti: boolean
  language: Language
}

export const defaultOptions: OptionsState = {
  useDeffudle: true,
  useReadability: false,
  wrapInTripleBackticks: true,
  showSuccessToast: true,
  showConfetti: false,
  language: "zh",
}

export async function getOptions(): Promise<OptionsState> {
  try {
    const result = await browser.storage.sync.get(Object.keys(defaultOptions))
    return { ...defaultOptions, ...result }
  } catch (error) {
    console.error("获取选项时出错:", error)
    return defaultOptions
  }
}

export async function saveOptions(
  options: Partial<OptionsState>,
): Promise<void> {
  try {
    await browser.storage.sync.set(options)
  } catch (error) {
    console.error("保存选项时出错:", error)
  }
}

export async function resetOptions(): Promise<void> {
  try {
    await browser.storage.sync.clear()
  } catch (error) {
    console.error("重置选项时出错:", error)
  }
}
